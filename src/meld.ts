/// <reference path="tile.ts" />

abstract class Meld {
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

class Pair extends Meld {
    tiles: Tile[];
    
    constructor(tile1: Tile, tile2: Tile) {
        super();
        this.tiles = [tile1, tile2];
    }
}

class Triple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3];
    }
}

class Straight extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3];
    }
}

class Quadruple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile, tile4: Tile) {
        super();
        this.tiles = [tile1, tile2, tile3, tile4];
    }
}