import {Tile, Suit, TileType, Wind, Dragon} from "./tile"

export abstract class Meld {
    tiles: Tile[];
    suit: Suit;
    
    equals(other: Meld): boolean {
        if (this.tiles.length !== other.tiles.length ||
            this.suit !== other.suit) {
            return false;
        }
        for (var i = 0; i < this.tiles.length; i++) {
            if (!this.tiles[i].equals(other.tiles[i])) {
                return false;
            }
        }
        return true;
    }
    
    static hasOneOrSevenPairs(melds: Meld[]): boolean {
        var pairs = 0;
        melds.forEach((meld, i, a) => {
            if (meld instanceof Pair) {
                pairs++;
            }
        });
        return pairs === 1 || pairs === 7;
    }

    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples,
     * and there should be one to five melds (one of which a pair), or seven pairs.
     * An empty list is returned if all combinations end up with leftover tiles.
     */
    static formMelds(tiles: Tile[]): Meld[][] {
        if (tiles.length % 3 !== 2 || tiles.length > 14) {
            throw "Invalid number of tiles!";
        }
        var tiles = Tile.copyArray(tiles);
        tiles.sort(Tile.compare);
        
        var meldLists = Meld.formMeldsWithSortedTiles(tiles);
        
        return meldLists.filter((melds, i, a) => {
            return Meld.hasOneOrSevenPairs(melds);
        });
    }

    /**
     * Requires that the tiles are sorted.
     */
    private static formMeldsWithSortedTiles(tiles: Tile[]): Meld[][] {
        if (tiles.length === 0) {
            return [[]];
        }
        
        var meldLists: Meld[][] = [];
        
        meldLists = meldLists
            .concat(Meld.formMeldsWithFirstTileInPair(tiles))
            .concat(Meld.formMeldsWithFirstTileInTriple(tiles))
            .concat(Meld.formMeldsWithFirstTileInStraight(tiles));
        
        return meldLists;
    }

    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInPair(tiles: Tile[]): Meld[][] {
        if (tiles.length < 2 || !tiles[0].equals(tiles[1])) {
            return [];
        }
        var pair = new Pair(tiles[0]);
        return Meld.formMeldsWithSortedTiles(tiles.slice(2)).map((melds, i, a) => {
            return [pair].concat(melds);
        });
    }

    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInTriple(tiles: Tile[]): Meld[][] {
        if (tiles.length < 3 || !tiles[0].equals(tiles[1]) || !tiles[0].equals(tiles[2])) {
            return [];
        }
        var triple = new Triple(tiles[0]);
        return Meld.formMeldsWithSortedTiles(tiles.slice(3)).map((melds, i, a) => {
            return [triple].concat(melds);
        });
    }

    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInStraight(tiles: Tile[]): Meld[][] {
        if (tiles.length < 3) {
            return [];
        }
        var straight = Tile.extractStraight(tiles, tiles[0]);
        if (straight === null) {
            return [];
        } else {
            return Meld.formMeldsWithSortedTiles(straight.otherTiles).map((melds, i, a) => {
                return [straight.straight].concat(melds);
            });
        }
    }
}

export class Pair extends Meld {
    tiles: Tile[];
    
    constructor(tile: Tile) {
        super();
        this.tiles = [tile, tile];
        this.suit = tile.suit;
    }
}

export class Triple extends Meld {
    constructor(tile: Tile) {
        super();
        this.tiles = [tile, tile, tile];
        this.suit = tile.suit;
    }
}

export class Straight extends Meld {
    /**
     * You can either pass in the smallest tile, or all three tiles
     * as the arguments. They'd have the same effect
     */
    constructor(tile1: Tile, tile2?: Tile, tile3?: Tile) {
        super();
        if (tile2 === undefined) {
            tile2 = tile1.nextNumber();
            tile3 = tile2.nextNumber();
        }
        this.tiles = [tile1, tile2, tile3];
        this.suit = tile1.suit;
    }
}

export class Quadruple extends Meld {
    constructor(tile: Tile) {
        super();
        this.tiles = [tile, tile, tile, tile];
        this.suit = tile.suit;
    }
}
