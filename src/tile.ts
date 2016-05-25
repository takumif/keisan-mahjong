import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"

export class Tile {
    suit: Suit;
    type: TileType;
    value: number | Wind | Dragon;
    
    constructor(suit: Suit, value: number | Wind | Dragon) {
        this.suit = suit;
        this.value = value;
        if (suit === Suit.Dragon) {
            if (Dragon[value] === undefined) {
                throw "Invalid Wind value!";
            }
            this.type = TileType.Honor;
        } else if (suit === Suit.Wind) {
            if (Wind[value] === undefined) {
                throw "Invalid Wind value!";
            }
            this.type = TileType.Honor;
        } else {
            if (value < 1 || value > 9) {
                throw "Invalid number value!";
            }
            this.type = TileType.Number;
        }
    }
    
    /**
     * Returns null if the tile is a 9 or an honor tile
     */
    nextNumber(): Tile {
        if (this.type === TileType.Number) {
            if (this.value === 9) {
                return null;
            } else {
                return new Tile(this.suit, this.value + 1);
            }
        } else {
            return null;
        }
    }
    
    /**
     * Can be used for determining the dora
     */
    nextWithWrapAround(): Tile {
        if (this.suit === Suit.Wind) {
            switch (this.value) {
                case Wind.East:
                    return new Tile(this.suit, Wind.South);
                case Wind.South:
                    return new Tile(this.suit, Wind.West);
                case Wind.West:
                    return new Tile(this.suit, Wind.North);
                case Wind.North:
                    return new Tile(this.suit, Wind.East);
            }
        } else if (this.suit === Suit.Dragon) {
            switch (this.value) {
                case Dragon.White:
                    return new Tile(this.suit, Dragon.Green);
                case Dragon.Green:
                    return new Tile(this.suit, Dragon.Red);
                case Dragon.Red:
                    return new Tile(this.suit, Dragon.White);
            }
        } else {
            // it's a number tile
            return new Tile(this.suit, this.value % 9 + 1);
        }
    }
    
    /**
     * True iff the tile is 1 or 9
     */
    isTerminal(): boolean {
        return (
            (this.type === TileType.Number) &&
            (this.value === 1 || this.value === 9)
        );
    }
    
    equals(other: Tile): boolean {
        return this.suit === other.suit && this.value === other.value;
    }
    
    toString(): string {
        if (this.suit === Suit.Wind) {
            return Wind[this.value];
        } else if (this.suit === Suit.Dragon) {
            return Dragon[this.value];
        } else {
            return Suit[this.suit] + String(this.value);
        }
    }
    
    /**
     * Use this when sorting
     */
    static compare(tile1: Tile, tile2: Tile): number {
        if (tile1.suit < tile2.suit) {
            return -1; // mark tile1 as smaller
        } else if (tile1.suit > tile2.suit) {
            return 1; // mark tile2 as smaller
        } else {
            if (tile1.value < tile2.value) {
                return -1;
            } else if (tile1.value > tile2.value) {
                return 1;
            } else {
                return 0;
            }
        }
    }
        
    /**
     * Returns the index of the first occurrence of the tile including or after
     * the start index. Returns -1 if not found.
     */
    static indexOf(list: Tile[], tile: Tile, start = 0): number {
        for (var i = start; i < list.length; i++) {
            var ithTile = list[i];
            if (ithTile.equals(tile)) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Removes the first occurrence of the tile including or after
     * the start index. Returns true iff a removal happened.
     */
    static remove(list: Tile[], tile: Tile, start = 0): boolean {
        for (var i = start; i < list.length; i++) {
            if (list[i].equals(tile)) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Makes a shallow copy of the array
     */
    static copyArray(tiles: Tile[]): Tile[] {
        var copy: Tile[] = [];
        tiles.forEach((tile, i, a) => {
            copy.push(tile);
        });
        return copy;
    }
    
    /**
     * Returns null if exactly seven pairs can't be formed.
     * Requires that the input is sorted
     */
    static formSevenPairs(tiles: Tile[]): Pair[] {
        if (tiles.length !== 14) {
            return null;
        }
        
        var pairs: Pair[] = [];
        for (var i = 0; i < 14; i += 2) {
            if (!tiles[i].equals(tiles[i + 1])) {
                return null;
            }
            pairs.push(new Pair(tiles[i]));
        }
        return pairs;
    }
    
    /**
     * Returns null if not possible
     */
    static extractStraight(tiles: Tile[], firstTile: Tile): { straight: Straight; otherTiles: Tile[] } {
        if (firstTile.type !== TileType.Number) {
            return null;
        }
        var tiles = Tile.copyArray(tiles);
        var secondTile = firstTile.nextNumber();
        var thirdTile = (secondTile === null) ? null : secondTile.nextNumber();
        if (thirdTile === null) {
            return null;
        }
        
        var found = [firstTile, secondTile, thirdTile].map((tile, i, a) => {
            return Tile.remove(tiles, tile);
        });
        if (found.indexOf(false) !== -1) {
            // There was a tile we couldn't find in the array
            return null;
        } else {
            return {
                straight: new Straight(firstTile, secondTile, thirdTile),
                otherTiles: tiles
            };
        }
    }
}

export enum Suit {
    Character,
    Circle,
    Bamboo,
    Wind,
    Dragon
}

export enum TileType {
    Number,     // Character, Circle or Bamboo
    Honor       // Wind or Dragon
}

export enum Wind {
    East,
    South,
    West,
    North
}

export enum Dragon {
    White,
    Green,
    Red
}
