import {Tile, Suit, TileType, Wind, Dragon} from "./tile"

export abstract class Meld {
    tiles: Tile[];
    
    static hasOneOrSevenPairs(melds: Meld[]): boolean {
        var pairs = 0;
        melds.forEach((meld, i, a) => {
            if (meld instanceof Pair) {
                pairs++;
            }
        });
        return pairs === 1 || pairs === 7;
    }
}

export class Pair extends Meld {
    tiles: Tile[];
    
    constructor(tile1: Tile, tile2: Tile) {
        super();
        this.tiles = [tile1, tile2];
    }
}

export class Triple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3];
    }
}

export class Straight extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3];
    }
}

export class Quadruple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile, tile4: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3, tile4];
    }
}