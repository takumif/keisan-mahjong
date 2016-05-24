import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"

class Hand {
    private melds: Meld[];
    
    constructor(
        private closedMelds: Meld[],
        private openMelds: Meld[],
        private seatWind: Wind,
        private roundWind: Wind,
        private winningMeld: Meld,
        private winningTile: Tile,
        // private winType,
        // private winSecondType,
        private doraTiles: Tile[],
        private uraDoraTiles: Tile[],
        private riichiCount: number,
        private ippatsu: boolean
    ) {
        this.melds = this.closedMelds.concat(this.openMelds);
    }
}