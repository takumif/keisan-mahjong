import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"

export class Hand {
    public melds: Meld[];
    public seatWind: Wind;
    public roundWind: Wind;
    public winningTile: Tile;
    public dora: Tile[];
    public uraDora: Tile[];
    public bonuses: WinningBonus[];
    public winMethod: WinningMethod;
    
    constructor(
        public closedMelds: Meld[],
        public openMelds: Meld[],
        info: {
            seatWind: Wind;
            roundWind: Wind;
            winningTile: Tile;
            dora: Tile[];
            uraDora: Tile[];
            bonuses: WinningBonus[];
            winMethod: WinningMethod;
        }
    ) {
        this.melds = this.closedMelds.concat(this.openMelds);
        this.seatWind = info.seatWind;
        this.roundWind = info.roundWind;
        this.winningTile = info.winningTile;
        this.dora = info.dora;
        this.uraDora = info.uraDora;
        this.bonuses = info.bonuses;
        this.winMethod = info.winMethod;
    }
    
    isClosed(): boolean {
        return this.openMelds.length === 0;
    }
    
    isEdgeWait(): boolean {
        throw "unimplemented";
    }
    
    isClosedWait(): boolean {
        throw "unimplemented";
    }
    
    isSingleWait(): boolean {
        throw "unimplemented";
    }
    
    hasBonus(bonus: WinningBonus): boolean {
        return this.bonuses.indexOf(bonus) !== -1;
    }
}

export enum WinningBonus {
    QuadrupleRob,
    LastFromWall,
    LastDiscard,
    DeadWallDraw,
    Riichi,
    DoubleRiichi,
    Ippatsu
}

export enum WinningMethod {
    Tsumo, // self-draw
    Ron // taking a discard
}
