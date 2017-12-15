import {Server} from "./Server.js";
import {$log} from "ts-log-debug";

new Server().start()
    .then(() => {
        $log.debug("Hello, tout c'est bien passé !")
    })
    .catch((error) => {
        $log.error("Hum, désolé mais là ça passe pas :)", error)
    });