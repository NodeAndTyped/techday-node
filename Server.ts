import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "ts-express-decorators";

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