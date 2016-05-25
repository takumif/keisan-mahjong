import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"

export class Hand {
    public melds: Meld[];
    public tiles: Tile[];
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
        this.tiles = this.getTiles();
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
    
    private getTiles(): Tile[] {
        var tiles: Tile[] = [];
        for (var i = 0; i < this.melds.length; i ++) {
            for (var j = 0; j < this.melds[i].tiles.length; j++) {
                tiles.push(this.melds[i].tiles[j]);
            }
        }
        return tiles;
    }
    
    /**
     * Returns points + 1 if closed, just points otherwise
     */
    plusOneIfClosed(points: number): number {
        if (this.isClosed()) {
            return points + 1;
        } else {
            return points;
        }
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
    Tsumo,  // self-draw
    Ron     // taking a discard
}
