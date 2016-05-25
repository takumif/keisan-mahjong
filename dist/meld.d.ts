import { Tile, Suit } from "./tile";
export declare abstract class Meld {
    tiles: Tile[];
    suit: Suit;
    equals(other: Meld): boolean;
    toString(): string;
    static hasOneOrSevenPairs(melds: Meld[]): boolean;
    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples,
     * and there should be one to five melds (one of which a pair), or seven pairs.
     * An empty list is returned if all combinations end up with leftover tiles.
     */
    static formMelds(tiles: Tile[]): Meld[][];
    /**
     * Requires that the tiles are sorted.
     */
    private static formMeldsWithSortedTiles(tiles);
    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInPair(tiles);
    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInTriple(tiles);
    /**
     * Requires that the tiles are sorted
     */
    private static formMeldsWithFirstTileInStraight(tiles);
}
export declare class Pair extends Meld {
    tiles: Tile[];
    constructor(tile: Tile);
}
export declare class Triple extends Meld {
    constructor(tile: Tile);
}
export declare class Straight extends Meld {
    /**
     * You can either pass in the smallest tile, or all three tiles
     * as the arguments. They'd have the same effect
     */
    constructor(tile1: Tile, tile2?: Tile, tile3?: Tile);
}
export declare class Quadruple extends Meld {
    constructor(tile: Tile);
}
