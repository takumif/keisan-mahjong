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
    
    /**
     * Put the winning meld in winningMeld, not openMelds.
     */
    constructor(
        public closedMelds: Meld[],
        public openMelds: Meld[],
        public winningMeld: Meld,
        info: {
            seatWind: Wind;
            roundWind: Wind;
            winningTile: Tile;
            winMethod: WinningMethod;
            dora?: Tile[];
            uraDora?: Tile[];
            bonuses?: WinningBonus[];
        }
    ) {
        this.melds = this.closedMelds.concat(this.openMelds).concat([winningMeld]);
        this.tiles = this.getTiles();
        this.seatWind = info.seatWind;
        this.roundWind = info.roundWind;
        this.winningTile = info.winningTile;
        this.winMethod = info.winMethod;
        this.dora = info.dora ? info.dora : [];
        this.uraDora = info.uraDora ? info.uraDora : [];
        this.bonuses = info.bonuses ? info.bonuses : [];
    }
    
    isClosed(): boolean {
        return this.openMelds.length === 0;
    }
    
    /**
     * Waiting for just one side (e.g. 3 in 1-2-3) of a straight
     */
    isOneSideWait(): boolean {
        return this.winningMeld instanceof Straight
            && ((this.winningTile.value === 3 && this.winningTile.equals(this.winningMeld.tiles[2]))
                || (this.winningTile.value === 7 && this.winningTile.equals(this.winningMeld.tiles[0])));
    }
    
    /**
     * Waiting for either side of a straight.
     * E.g. You have 3-4 and are waiting for either 2 or 5
     */
    isTwoSidesWait(): boolean {
        return this.winningMeld instanceof Straight
            && !this.isOneSideWait()
            && !this.isMiddleWait();
    }
    
    /**
     * Waiting for the middle tile of a straight
     */
    isMiddleWait(): boolean {
        return this.winningMeld instanceof Straight
            && this.winningTile.equals(this.winningMeld.tiles[1]);
    }
    
    /**
     * Waiting for one of the tiles in a pair
     */
    isPairWait(): boolean {
        return this.winningMeld instanceof Pair;
    }
    
    hasBonus(bonus: WinningBonus): boolean {
        return this.bonuses.indexOf(bonus) !== -1;
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
    
    private getTiles(): Tile[] {
        var tiles: Tile[] = [];
        for (var i = 0; i < this.melds.length; i ++) {
            for (var j = 0; j < this.melds[i].tiles.length; j++) {
                tiles.push(this.melds[i].tiles[j]);
            }
        }
        return tiles;
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
