import {BodyParams, Controller, Get, Patch} from "ts-express-decorators";
import {SquareGameService} from "../../services/SquareGameService";
import {SquareGameSettings} from "../../models/SquareGameSettings";

@Controller("/squaregame")
export class SquareGameCtrl {

    constructor(private squareGameService: SquareGameService) {

    }

    @Get("/settings")
    getSettings(): SquareGameSettings {
        const {maxPlayers, scoreMax} = this.squareGameService;
        return {
            nbPlayerMax: maxPlayers,
            scoreMax
        };
    }

    @Patch("/settings")
    patchSettings(@BodyParams("nbPlayerMax") nbPlayerMax: number, @BodyParams("scoreMax") scoreMax: number): SquareGameSettings {
        if (nbPlayerMax && nbPlayerMax >= 2) {
            this.squareGameService.maxPlayers = nbPlayerMax;
        }

        if (scoreMax && scoreMax >= 5) {
            this.squareGameService.scoreMax = scoreMax;
        }

        return this.getSettings();
    }
}