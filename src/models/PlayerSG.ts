export class PlayerSG {

    /**
     *
     */
    public name: string;
    /**
     *
     */
    public isReady: boolean;
    /**
     *
     */
    private _score: number = 0;
    /**
     *
     */
    private _socket: any;

    constructor(socket: any) {
        this._socket = socket;
    }

    get id(): string {
        return this._socket.id;
    }

    get socket(): any {
        return this._socket;
    }

    get score(): number {
        return this._score;
    }

    /**
     *
     */
    public scoreUp() {
        this._score++;
    }

    /**
     *
     */
    public toJSON = () => ({
        userId: this.id,
        name: this.name,
        score: this._score,
        isReady: this.isReady
    });
}