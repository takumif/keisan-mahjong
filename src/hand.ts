import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"

export class Hand {
    public melds: Meld[];
    
    constructor(
        public closedMelds: Meld[],
        public openMelds: Meld[],
        public seatWind: Wind,
        public roundWind: Wind,
        // private winningMeld: Meld,
        public winningTile: Tile,
        // private winType,
        // private winSecondType,
        public dora: Tile[],
        public uraDora: Tile[],
        public riichi: boolean,
        public doubleRiichi: boolean,
        public ippatsu: boolean,
        public winBonus: WinningTileBonus,
        public winningDraw: WinningDraw
    ) {
        this.melds = this.closedMelds.concat(this.openMelds);
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
}

export enum WinningTileBonus {
    None,
    QuadrupleRob,
    LastFromWall,
    LastDiscard,
    DeadWallDraw
}

export enum WinningDraw {
    Tsumo, // self-draw
    Ron // taking a discard
}
