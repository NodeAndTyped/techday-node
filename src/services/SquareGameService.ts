import {$log} from "ts-log-debug";
import {PlayerSG} from "../models/PlayerSG";
import {SocketService} from "./SocketService";

export class SquareGameService {
    /**
     *
     */
    public maxPlayers: number = 4;
    /***
     *
     * @type {number}
     */
    public scoreMax: number = 10;
    /**
     *
     * @type {Map<string, SocketIO.Socket>}
     */
    private players: Map<string, PlayerSG> = new Map<string, PlayerSG>();
    /**
     *
     */
    private tick;

    constructor(private socketService: SocketService) {
        socketService.onConnection(this.onConnect);
    }

    private onConnect = (socket: any) => {
        $log.debug("New connection, ID =>", socket.id);
        const player = new PlayerSG(socket);

        //premier événement, ajout d'un utilisateur
        socket.on("client.player.name", (name: string) => this.setPlayerName(player, name));

        //player say i'am ready
        socket.on("client.player.ready", () => this.setPlayerReady(player));

        //start interval
        socket.on("client.start.game", () => this.startGame());

        //delete square
        socket.on("client.delete.square", () => this.deleteSquare(player));

        //player disconnect
        socket.on("disconnect", this.onDisconnect);
    };

    /**
     * Ajoute une joueur à la liste des joueurs.
     * Emet l'événement 'newplayer' si le joueur vient d'être créé.
     * @param player
     * @param name
     */
    public setPlayerName(player: PlayerSG, name: string): void {

        $log.debug("New player =>", name);

        player.name = name;

        if (this.players.size === this.maxPlayers) {
            $log.debug("stack overflow :p");
            return;
        }

        this.players.set(player.id, player);
        this.socketService.emit("server.player.new", this.getPlayers());
    }

    /**
     *
     */
    public startGame() {
        if (!this.tick) {

            $log.debug("Start game");

            this.sendSquarePosition();
            this.tick = setInterval(() => this.sendSquarePosition(), 1000);
        }
    };

    /**
     *
     */
    public setPlayerReady(player: PlayerSG) {

        $log.debug(player.name + " is ready");

        player.isReady = true;

        this.updatePlayersReady();
    };

    /**
     *
     */
    public deleteSquare(player: PlayerSG) {
        $log.debug("Player has clicked on the square =>", player.name);
        player.scoreUp();

        this.socketService.emit("server.deleted.square", this.getPlayers(), player);

        if (player.score >= this.scoreMax) {

            this.stopGame();

            player.socket.broadcast.emit("server.player.loose", player);
            player.socket.emit("server.player.win", player);
        }
    };

    /**
     *
     */
    public onDisconnect(player: PlayerSG) {

        $log.debug("Player disconnected =>", player.name, player.id);

        this.players.delete(player.id);
        this.stopGame();

        this.socketService.emit("server.stop.game", player, this.getPlayers());

    };

    /**
     *
     */
    public updatePlayersReady() {
        $log.debug("Waiting players", this.getNbPlayersReady(), "===", this.maxPlayers);
        this.socketService.emit("server.update.players.ready", this.getPlayers());

        if (+this.getNbPlayersReady() === +this.maxPlayers) {
            $log.debug("All players are ready");
            this.socketService.emit("server.start.countdown");
        }
    }

    /**
     *
     */
    public sendSquarePosition() {
        const index = Math.floor(Math.random() * 12),
            bgc = "#" + ((1 << 24) * Math.random() | 0).toString(16);

        this.socketService.emit("server.update.square", {index, bgc});
    };

    /**
     *
     * @returns {number}
     */
    public getNbPlayersReady() {
        let counter = 0;

        this
            .players
            .forEach(player => {
                if (player.isReady) {
                    counter++;
                }
            });


        return counter;
    }

    /**
     * Retourne la liste des joueurs.
     * @returns {Array}
     */
    public getPlayers(): PlayerSG[] {
        const players = [];
        this.players.forEach(e => players.push(e));

        return players;
    }

    /**
     *
     */
    public stopGame() {
        clearInterval(this.tick);
        delete this.tick;
    }

}
