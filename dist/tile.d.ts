import { Meld, Pair } from "./meld";
export declare class Tile {
    suit: Suit;
    type: TileType;
    value: number | Wind | Dragon;
    constructor(suit: Suit, value: number | Wind | Dragon);
    /**
     * Use this when sorting
     */
    static compare(tile1: Tile, tile2: Tile): number;
    /**
     * Returns the index of the first occurrence of the tile including or after
     * the start index. Returns -1 if not found.
     */
    static indexOf(list: Tile[], tile: Tile, start?: number): number;
    /**
     * Removes the first occurrence of the tile including or after
     * the start index. Returns true iff a removal happened.
     */
    static remove(list: Tile[], tile: Tile, start?: number): boolean;
    /**
     * Makes a shallow copy of the array
     */
    static copyArray(tiles: Tile[]): Tile[];
    /**
     * Returns null if exactly seven pairs can't be formed.
     * Requires that the input is sorted
     */
    static formSevenPairs(tiles: Tile[]): Pair[];
    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples.
     * An empty list if no melds can be formed.
     */
    static formMelds(tiles: Tile[]): Meld[][];
    equals(other: Tile): boolean;
    /**
     * Returns null if the tile is a 9 or an honor tile
     */
    nextNumber(): Tile;
    /**
     * Can be used for determining the dora
     */
    nextWithWrapAround(): Tile;
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
    /**
     * Returns null if not possible
     */
    private static extractStraight(tiles, firstTile);
}
export declare enum Suit {
    Character = 0,
    Circle = 1,
    Bamboo = 2,
    Wind = 3,
    Dragon = 4,
}
export declare enum TileType {
    Number = 0,
    Honor = 1,
}
export declare enum Wind {
    East = 0,
    South = 1,
    West = 2,
    North = 3,
}
export declare enum Dragon {
    White = 0,
    Green = 1,
    Red = 2,
}
