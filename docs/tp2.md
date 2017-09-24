# TP2 - Création du serveur

## Le serveur

Nous allons maintenant créer le serveur web avec Express (version TypeScript).
Pour ce faire, créer un nouveau fichier `server.js` à la racine du projet.

Dans ce fichier nous allons déclarer une la classe Server :

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";

@ServerSettings({
    acceptMimes: ["application/json"],
    debug: process.env.NODE_ENV !== "production"
})
export class Server extends ServerLoader {

}
```

Ensuite nous allons créer un fichier `app.js` qui servira à lancer l'application Node.js:

```typescript
import {Server} from "./server.js";
import {$log} from "ts-log-debug";

new Server().start()
    .then(() => {
       $log.debug("Hello, tout c'est bien passé !")
    })
    .catch((error) => {
        $log.error("Hum, désolé mais là ça passe pas :)", error)
    });
```

> Vous pouvez vérifier que le serveur s'initialiser correctement avec la commande `yarn start`.

## Les middlewares

Pour que notre serveur Express.js fonctionne un peu mieux, nous allons lui ajouté des middlewares.
Ces middlewares sont les suivants :

* [`body-parser`](https://github.com/expressjs/body-parser) pour la gestion des paramètres envoyés en `POST`, `PUT`, etc...
* [`method-override`](https://github.com/expressjs/method-override) pour gérer les verbes du protocole HTTP.

Une fois que vous avez installer les modules via npm (ou yarn), il faut les ajouter à liste des middlewares du serveur Express.
Editez votre serveur et ajoutez le hook suivant:

```typescript
import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "ts-express-decorators";

@ServerSettings({
    acceptMimes: ["application/json"],
    debug: process.env.NODE_ENV !== "production"
})
export class Server extends ServerLoader {
    $onMountingMiddlewares() {
        const bodyParser = require('body-parser'),
              methodOverride = require('method-override');
            this
                .use(GlobalAcceptMimesMiddleware)
                .use(methodOverride())
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({
                    extended: true
                }));

    }
}
```

## Le moteur de template

Bon là c'est vraiment une affaire de goût donc vous êtes libre d'utiliser le moteur de template qui vous plait.
Il existe un module qui permet d'utiliser n'importe quel moteur de template avec Express.
Ce module se nomme `consolidate`.

```bash
```

Voici comment configurer le moteur de template avec Express et Ts.ED:

```typescript
@ServerSettings({
    acceptMimes: ["application/json"],
    debug: process.env.NODE_ENV !== "production"
})
export class Server extends ServerLoader {
    $onMountingMiddlewares() {
        const bodyParser = require("body-parser"),
              methodOverride = require("method-override"),
              cons = require('consolidate');
              
            this
                .use(GlobalAcceptMimesMiddleware)
                .use(methodOverride())
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({
                    extended: true
                }));
           
            // engine
            this.set("views", "./views"); // le repertoire des vues
            this.engine('pug', cons.pug); // Pour PUG
            this.engine('ejs', cons.ejs); // Pour ejs
            this.engine('html', cons.swig); // Pour Swig
    }
}
```

## Les ressources statiques

Lancer la commande npm suivante :

```bash
yarn add serve-static
```
Ensuite on configure le serveur :
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/servestatic";
import Path = require("path");
const rootDir = Path.resolve(__dirname)

@ServerSettings({
   serveStatic: {
      "/": `${rootDir}/public`
   }
})
export class Server extends ServerLoader {

}
```

## Le controlleur

[Ts.Ed](https://romakita.github.io/ts-express-decorators) (pour ts-express-decorators) est basé sur le pattern MVC pour 
structurer notre application backend.

Pour exposer une route, il nous faut créer un controlleur et au moins une méthode pour que celle-ci soit appelée par Express
lorsqu'une requête demande une ressource via un url avec un verbe du protocole HTTP (o_O what ?).

Comme une exemple est toujours plus parlant en voici un :

```typescript
import {Controller, Get} from "ts-express-decorators";
import {Calendar} from "../models/Calendar";

@Controller("/calendars") // Ceci est le nom de la resource !
export class CalendarCtrl {
    
    @Get("/:id") // Ceci est un endpoint !
    async getCalendarById(@PathParams("id") id: string): Promise<Calendar> {
        return {id, description: "Mon calendrier qui est une resource"}
    }
}
```

Voici ce que nous dit ce code :

- **Verbe** : GET (du protocole HTTP),
- **Endpoint** : `/rest/calendars/:id`. Ça ressemble à une url non ?
- **Paramètre** : id de type string.
- **Type de retour**: Un calendrier.

