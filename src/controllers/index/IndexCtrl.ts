import {Controller, Get, Render} from "ts-express-decorators";
import {SquareGameService} from "../../services/SquareGameService";

@Controller("/")
export class IndexCtrl {

    constructor(private squareGameService: SquareGameService) {

    }
    @Get("/")
    @Render("index.ejs")
    async getIndex() {
        return {
            appName: "SquareGame",
            MAX_PLAYERS: this.squareGameService.maxPlayers,
            SCORE_MAX: this.squareGameService.scoreMax
        }
    }
}