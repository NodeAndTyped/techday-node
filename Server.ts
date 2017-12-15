import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/servestatic";
import "ts-express-decorators/socketio";
import "ts-express-decorators/swagger";

@ServerSettings({
    acceptMimes: ["application/json"],
    debug: false,///process.env.NODE_ENV !== "production",
    mount: {
        "/": "./src/controllers/pages/**/*.js",
        "/rest": "./src/controllers/rest/**/*.js"
    },
    componentsScan: [
        "./src/services/**/*.js"
    ],
    serveStatic: {
        "/": [
            "./public",
            "./node_modules"
        ]
    },
    swagger: {
        path: "/docs"
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
        this.engine("ejs", cons.ejs);
    }
}