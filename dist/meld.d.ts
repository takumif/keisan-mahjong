import { Tile } from "./tile";
export declare abstract class Meld {
    tiles: Tile[];
    static hasOneOrSevenPairs(melds: Meld[]): boolean;
}
export declare class Pair extends Meld {
    tiles: Tile[];
    constructor(tile1: Tile, tile2: Tile);
}
export declare class Triple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile);
}
export declare class Straight extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile);
}
export declare class Quadruple extends Meld {
    constructor(tile1: Tile, tile2: Tile, tile3: Tile, tile4: Tile);
}
