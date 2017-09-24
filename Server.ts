import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/servestatic";
import Path = require("path");

const rootDir = Path.resolve(__dirname);

@ServerSettings({
    acceptMimes: ["application/json"],
    debug: process.env.NODE_ENV !== "production",
    mount: {
        "/": "${rootDir}/src/controllers/pages/**/*.js",
        "/rest": "${rootDir}/src/controllers/rest/**/*.js"
    },
    componentsScan: [
        "${rootDir}/src/services/**/*.js"
    ],
    serveStatic: {
        "/": [
            `${rootDir}/public`,
            `${rootDir}/node_modules`
        ]
    }
})
export class Server extends ServerLoader {
    $onMountingMiddlewares() {
        const bodyParser = require("body-parser"),
            methodOverride = require("method-override"),
            cons = require("consolidate");
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));


        this.set("views", "./views"); // le repertoire des vues
        //this.engine('pug', cons.pug); // Pour PUG
        this.engine("ejs", cons.ejs); // Pour ejs
        //this.engine('html', cons.swig); // Pour Swig

    }
}