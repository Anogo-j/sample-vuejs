"use strict";
/* eslint-disable no-console */

const http = require("http");
const https = require("https");
const path = require("path");

const express = require("express");
const compression = require("compression");
const fs = require("fs");

const { LoadConfiguration } = require("./services/load-configuration.js");
const { Logger } = require("./services/logger.js");
const { StoreManager } = require("./services/store-manager.js");

const { publicRouterFactory } = require("./routers/public.js");
const { authentificationRouterFactory } = require("./routers/authentification.js");
const { staticRouterFactory } = require("./routers/static.js");
const { apiRouterFactory } = require("./routers/api.js");

const { name: moduleName, version: moduleVersion } = require("../package.json");

class Server {

	static async createServerAndStart(configurationFile) {
		const server = new Server();
		await server.initialize(configurationFile);
		await server.start();

		return server;
	}

	constructor() {
		this.logger = null;
		this.configuration = null;
		this.app = express();
		this.server = null;
	}

	async initialize(configurationFile) {
		const context = await Server.initializeContext({ configurationFile });

		this.logger = context.logger;
		this.configuration = context.configLoader.getValue("server");

		this.app.set("views", path.join(__dirname, "ejsPages"));
		this.app.set("view engine", "ejs");

		this.app.use(compression());
		this.app.use((request, response, next) =>
			this.checkUrlServerMiddleware(request, response, next));
		this.app.use(publicRouterFactory(context));
		this.app.use(await authentificationRouterFactory(context));
		this.app.use("/api", await apiRouterFactory(context));
		this.app.use(staticRouterFactory(context));

		// Route d'erreur
		this.app.use((error, request, response, next) =>
			this.errorMiddleware(error, request, response, next));
	}

	static async initializeContext({ configurationFile }) {
		const loadConfiguration = new LoadConfiguration(configurationFile);
		const configLoader = await loadConfiguration.load();

		const logger = new Logger(configLoader.getValue("logs")).getLogger();
		logger.log("info", "Configuration", configLoader.config);

		const context = {
			configLoader,
			logger,
		};

		const storeManager = new StoreManager({ path: path.join(__dirname, "stores"), context });
		await storeManager.loadInContext();

		return context;
	}

	checkUrlServerMiddleware(request, response, next) {
		if (request.hostname === this.configuration.url_server) {
			return next();
		}
		response.status(403).render("403", { title: `${ moduleName } ${ moduleVersion }` });
	}

	// eslint-disable-next-line no-unused-vars
	errorMiddleware(error, request, response, next) {
		this.logger.log("error", error.stack);
		response.status(500).render("error", { title: `${ moduleName } ${ moduleVersion }`, error });
	}

	start() {
		console.log(); console.log("Server starting ...");
		this.server = this.configuration.ssl.enable ?
			https.createServer({
				/* eslint-disable-next-line no-sync */
				key: fs.readFileSync(this.configuration.ssl.keyFile),
				/* eslint-disable-next-line no-sync */
				cert: fs.readFileSync(this.configuration.ssl.certFile),
			}, this.app) :
			http.createServer(this.app);

		return new Promise((resolve, reject) => {
			this.server.on("error", (error) => {
				const messageError = `impossible server start : ${error.message}`;
				console.log(messageError);
				this.logger.log("error", messageError);
				reject(error);
			});
			this.server.on("listening", () => {
				console.log("Server started");
				this.logger.log("info", `start server to ${
					this.configuration.host
				}:${
					this.configuration.port
				} ${this.configuration.ssl.enable ? "in ssl mode" : ""}`,
				);

				const urlStartApp = `url to start application : ${
					this.configuration.ssl.enable ? "https" : "http"
				}://${
					this.configuration.url_server
				}:${
					this.configuration.port
				}/`;
				console.log(urlStartApp);
				this.logger.log("info", urlStartApp);

				process.on("SIGINT", () => {
					console.log(); console.log("Server stopping ...");
					this.stop()
						.then(() => {
							/* eslint-disable-next-line no-console */
							console.log("Server stopped");
							process.exitCode = 0;
						})
						.catch((error) => {
							console.log(`impossible server stop : ${error.message}`);
							process.exitCode = 1;
						});
				});

				resolve();
			});
			this.server.listen({
				port: this.configuration.port,
				host: this.configuration.host,
			});
		});

	}

	stop() {
		if (!this.server) {
			return Promise.reject(new Error("Server not running"));
		}

		return new Promise((resolve, reject) => {
			this.server.on("error", (error) => {
				this.logger.log("error", `Server not closed ${error.message}`);
				reject(error);
			});
			this.server.on("close", () => {
				this.logger.log("info", "Server is closed");
				this.server = null;
				resolve();
			});
			this.server.close();
		});
	}
}

module.exports = { Server };
