# @sbesson/sample-vuejs

<!-- TOC -->

- [Execution du projet](#execution-du-projet)
  - [En développement](#en-développement)
  - [En production](#en-production)
- [Documentation sur le développement](#documentation-sur-le-développement)
  - [L'arborescence de 1er niveau](#larborescence-de-1er-niveau)
  - [Le serveur](#le-serveur)
    - [L'arborescence des sources](#larborescence-des-sources)
    - [server.js](#serverjs)
    - [Les stores](#les-stores)
    - [Les routers](#les-routers)
    - [l'api](#lapi)
      - [l'arborescence](#larborescence)
      - [api.js](#apijs)
      - [module API](#module-api)
    - [le context](#le-context)
  - [le front `/src`](#le-front-src)
    - [L'arborescence des sources](#larborescence-des-sources-1)
    - [Les stores](#les-stores-1)

<!-- /TOC -->

Ce projet est un exemple de développement nodejs/vuejs délivrant une api utilisé par le front.

dependances principales utilisées :

* express
* express-openapi-validator
* swagger-parser
* swagger-ui-express
* vue
* vue-material

## Execution du projet

### En développement

Il faut lancer le serveur :

`npm start`

Le serveur écoute sur le port 8081, si on appelle directement ce port, c'est le front qui se trouve dans `/dist` qui sera utilisé et donc pas le front en développement.

Il faut maintenant lancer le serveur de développement.

`npm run serve`

Le serveur de développement écoute sur le port 8080.

L'url du site <http://localhost:8080>

### En production

Il faut générer le front :

`npm run build`

Et lancer le serveur avec une configuration de production

`node . /path/config-prod.json`

## Documentation sur le développement

### L'arborescence de 1er niveau

* **data** : Contient les données de base (fichier de conf, certificat ssl de test, etc ...). n'est pas utilisé en production
* **server** : contient le code source du serveur (backend)
* **src** : contient le code source de l'interface utilisateur (frontend)
* **public** : Pages html de vue-cli

l'`index.js` ne fait que lancer le serveur.

### Le serveur

Les sources du serveurs se trouve donc dans le répertoire `server`.

#### L'arborescence des sources

* **ejsPages** : Template ejs de page html
* **routers** : Les routers express
* **services** : Services générales
* **stores** : Gestion des différents store de donnée.

#### server.js

Démarre le serveur après l'avoir initialisé.

Pour cela voici les actions qu'il effectue :

1. Initialisation du context
    * Chargement de la configuration
    * Initialisation du logger
    * Initialisation du service ejs (pour les template des pages html)
    * Initialisation des stores
1. Initialisation des middlewares et des routers
    * Compression des réponses
    * Validation de l'url d'appel
    * Gestion des pages publiques
    * Authentification
    * Gestion de l'API
    * Gestion des pages statiques
    * Gestion des erreurs
1. Lancement du serveur
1. Gestion de l'arrêt du serveur sur SIGINT

#### Les stores

On trouve les stores dans le répertoire `/stores`.

Le nom du fichier javascript doit d'être du style `<name>.store.js` et doit exporter une class du même nom (`<name>Store`) mais avec la 1ere lettre en majuscule.

Exemple, pour le store `infos` le fichier source est `infos.store.js` et export la class `InfosStore`.

Cette class recevra, lors de son constructeur, le context (avec la configuration, le logger et le service ejs) et devra contenir une méthode `initialize()` permettant d'initialiser le store.

Les stores seront instanciés automatiquement par `server.js` et leur méthode `initialize()` sera exécutée.

L'instance sera ensuite mis dans le context.

#### Les routers

Il y a 4 routers :

* **api** : Contient les sources de l'api url `/api` en fonction des modules créés dans le répertoire `api`.
* **authentification** : router express gérant l'authentification
* **public** : router express gérant les pages publiques (ne réclamant pas d'authentification)
* **static** : router express délivrant les pages statiques du site (il faut être authentifié pour recevoir ces pages)

#### l'api

##### l'arborescence

L'api se trouve dans le répertoire `/server/routers/api`

* **modules** : contient le code d'un module
* **openapi** : Fichier yml d'openapi globale à l'API
* **services** : service général de l'API

##### api.js

Génère le router express de l'api.

Pour cela il met en place les routes suivantes pour le chemin `/api` :

* **\<all>** : contrôle api via openapi (utilisation de `express-openapi-validator`, `swagger-parser`)
* **/** : Accès à la documentation openapi (utilisation de `swagger-ui-express`)
* **/\<modules>** : Mise en place du router du module \<module> avec le control des droits admin
* **Gestion d'erreur** : Mise en place des middleware d'erreur (erreur openapi et générale)

##### module API

Un module API correspond aux routes du chemin `/api/<module>`.

Les sources des modules se trouve dans le répertoire `/server/routers/api/modules/<module>`

On doit trouver à la racine du répertoire du module un fichier `<module>.module.js`

Ce dernier doit exporter deux propriétés :

* **authorizedRoutes** : doit être un object contenant deux propriétés :
  * **admin** : array de regExp des routes accessible que par l'admin
  * **all** : array de regExp des routes accessible par tous les utilisateurs
* **routerFactory** : function recevant le context et retournant un router express contenant les routes du module.

On doit trouver également à la racine du module un répertoire `openapi` qui devra contenir au moins le fichier `openapi.yml` qui devra contenir les `tags` et `paths` spécifique au module.

#### le context

Le context contient :

* **configLoader** : object de type ConfigLoader (`sb-configuration-loader`) permettant de récupérer les options de configuration.
* **logger** : logger (`winston`)
* **ejs** : service permettant de générer des pages html via les template ejs
* **\<store>** : Accès à l'instance des stores.

### le front `/src`

#### L'arborescence des sources

* **components** : module vuejs `.vue`
* **stores** : les stores
* **eventBus.js** : Bus d'événement global à toute l'application
* **main.js** : Charge la configuration et monte le 1er module vuejs
* **sample-vuejs.vue** : Le 1er module de l'application

#### Les stores

Se sont des simples object (singleton) de données récupérer via l'api rest du back.
Ils sont généralement référencés dans le `data` d'un module vuejs, ce qui permet de mettre à jour l'affichage dès qu'une donnée change. Principe expliqué [ici](https://fr.vuejs.org/v2/guide/state-management.html#Gestion-d%E2%80%99etat-simple-a-partir-de-rien).
