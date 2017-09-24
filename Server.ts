import {ServerLoader, ServerSettings} from "ts-express-decorators";

@ServerSettings({
    acceptMimes: ["application/json"],
    debug: process.env.NODE_ENV !== "production"
})
export class Server extends ServerLoader {

}