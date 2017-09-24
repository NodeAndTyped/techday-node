import {ContentType, Controller, Get, Render} from "ts-express-decorators";
import {SquareGameService} from "../../services/SquareGameService";
import {Name} from "ts-express-decorators/lib/swagger";

@Controller("/")
@Name("Pages")
export class IndexCtrl {

    constructor(private squareGameService: SquareGameService) {

    }

    @Get("")
    @Render("index.ejs")
    @ContentType("text/html")
    async getIndex() {
        return {
            appName: "SquareGame",
            MAX_PLAYERS: this.squareGameService.maxPlayers,
            SCORE_MAX: this.squareGameService.scoreMax
        };
    }
}