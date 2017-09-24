import * as SocketIO from "socket.io";
import {HttpServer, Inject, OnServerReady, Service} from "ts-express-decorators";

@Service()
export class SocketService implements OnServerReady {

    private _io: SocketIO.Server;
    private stacks = [];

    constructor(@Inject(HttpServer) private httpServer: HttpServer) {

    }

    $onServerReady() {
        this.createServer();
    }

    /**
     * Store all callbacks that will be adding to socket.io instance when
     *  it'll be created. See SocketService.createServer().
     */
    public onConnection(callback: Function): SocketService {
        this.stacks.push(callback);
        return this;
    }

    public emit = (eventName: string, ...args: any[]) => this._io.emit(eventName, ...args);

    createServer() {
        this._io = SocketIO(this.httpServer.get());

        // Map all callbacks to this connection events.
        this.stacks.forEach(cb => this._io.on("connection", cb));
    }

    get io(): SocketIO.Server {
        return this._io;
    }
}