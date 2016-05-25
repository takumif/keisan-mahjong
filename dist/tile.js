"use strict";
var meld_1 = require("./meld");
var Tile = (function () {
    function Tile(suit, value) {
        this.suit = suit;
        this.value = value;
        if (suit === Suit.Dragon) {
            if (Dragon[value] === undefined) {
                throw "Invalid Wind value!";
            }
            this.type = TileType.Honor;
        }
        else if (suit === Suit.Wind) {
            if (Wind[value] === undefined) {
                throw "Invalid Wind value!";
            }
            this.type = TileType.Honor;
        }
        else {
            if (value < 1 || value > 9) {
                throw "Invalid number value!";
            }
            this.type = TileType.Number;
        }
    }
    /**
     * Returns null if the tile is a 9 or an honor tile
     */
    Tile.prototype.nextNumber = function () {
        if (this.type === TileType.Number) {
            if (this.value === 9) {
                return null;
            }
            else {
                return new Tile(this.suit, this.value + 1);
            }
        }
        else {
            return null;
        }
    };
    /**
     * Can be used for determining the dora
     */
    Tile.prototype.nextWithWrapAround = function () {
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
        }
        else if (this.suit === Suit.Dragon) {
            switch (this.value) {
                case Dragon.White:
                    return new Tile(this.suit, Dragon.Green);
                case Dragon.Green:
                    return new Tile(this.suit, Dragon.Red);
                case Dragon.Red:
                    return new Tile(this.suit, Dragon.White);
            }
        }
        else {
            // it's a number tile
            return new Tile(this.suit, this.value % 9 + 1);
        }
    };
    /**
     * True iff the tile is 1 or 9
     */
    Tile.prototype.isTerminal = function () {
        return ((this.type === TileType.Number) &&
            (this.value === 1 || this.value === 9));
    };
    Tile.prototype.equals = function (other) {
        return this.suit === other.suit && this.value === other.value;
    };
    Tile.prototype.toString = function () {
        if (this.suit === Suit.Wind) {
            return Wind[this.value];
        }
        else if (this.suit === Suit.Dragon) {
            return Dragon[this.value];
        }
        else {
            return Suit[this.suit] + String(this.value);
        }
    };
    /**
     * Use this when sorting
     */
    Tile.compare = function (tile1, tile2) {
        if (tile1.suit < tile2.suit) {
            return -1; // mark tile1 as smaller
        }
        else if (tile1.suit > tile2.suit) {
            return 1; // mark tile2 as smaller
        }
        else {
            if (tile1.value < tile2.value) {
                return -1;
            }
            else if (tile1.value > tile2.value) {
                return 1;
            }
            else {
                return 0;
            }
        }
    };
    /**
     * Returns the index of the first occurrence of the tile including or after
     * the start index. Returns -1 if not found.
     */
    Tile.indexOf = function (list, tile, start) {
        if (start === void 0) { start = 0; }
        for (var i = start; i < list.length; i++) {
            var ithTile = list[i];
            if (ithTile.equals(tile)) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Removes the first occurrence of the tile including or after
     * the start index. Returns true iff a removal happened.
     */
    Tile.remove = function (list, tile, start) {
        if (start === void 0) { start = 0; }
        for (var i = start; i < list.length; i++) {
            if (list[i].equals(tile)) {
                list.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    /**
     * Makes a shallow copy of the array
     */
    Tile.copyArray = function (tiles) {
        var copy = [];
        tiles.forEach(function (tile, i, a) {
            copy.push(tile);
        });
        return copy;
    };
    /**
     * Returns null if exactly seven pairs can't be formed.
     * Requires that the input is sorted
     */
    Tile.formSevenPairs = function (tiles) {
        if (tiles.length !== 14) {
            return null;
        }
        var pairs = [];
        for (var i = 0; i < 14; i += 2) {
            if (!tiles[i].equals(tiles[i + 1])) {
                return null;
            }
            pairs.push(new meld_1.Pair(tiles[i], tiles[i + 1]));
        }
        return pairs;
    };
    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples,
     * and there should be one to five melds (one of which a pair), or seven pairs.
     * An empty list is returned if all combinations end up with leftover tiles.
     */
    Tile.formMelds = function (tiles) {
        if (tiles.length % 3 !== 2 || tiles.length > 14) {
            throw "Invalid number of tiles!";
        }
        var tiles = Tile.copyArray(tiles);
        tiles.sort(Tile.compare);
        var meldLists = Tile.formMeldsWithSortedTiles(tiles);
        return meldLists.filter(function (melds, i, a) {
            return meld_1.Meld.hasOneOrSevenPairs(melds);
        });
    };
    /**
     * Requires that the tiles are sorted.
     */
    Tile.formMeldsWithSortedTiles = function (tiles) {
        if (tiles.length === 0) {
            return [[]];
        }
        var meldLists = [];
        meldLists = meldLists
            .concat(Tile.formMeldsWithFirstTileInPair(tiles))
            .concat(Tile.formMeldsWithFirstTileInTriple(tiles))
            .concat(Tile.formMeldsWithFirstTileInStraight(tiles));
        return meldLists;
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInPair = function (tiles) {
        if (tiles.length < 2 || !tiles[0].equals(tiles[1])) {
            return [];
        }
        var pair = new meld_1.Pair(tiles[0], tiles[1]);
        return Tile.formMeldsWithSortedTiles(tiles.slice(2)).map(function (melds, i, a) {
            return [pair].concat(melds);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInTriple = function (tiles) {
        if (tiles.length < 3 || !tiles[0].equals(tiles[1]) || !tiles[0].equals(tiles[2])) {
            return [];
        }
        var triple = new meld_1.Triple(tiles[0], tiles[1], tiles[2]);
        return Tile.formMeldsWithSortedTiles(tiles.slice(3)).map(function (melds, i, a) {
            return [triple].concat(melds);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInStraight = function (tiles) {
        if (tiles.length < 3) {
            return [];
        }
        var straight = Tile.extractStraight(tiles, tiles[0]);
        if (straight === null) {
            return [];
        }
        else {
            return Tile.formMeldsWithSortedTiles(straight.otherTiles).map(function (melds, i, a) {
                return [straight.straight].concat(melds);
            });
        }
    };
    /**
     * Returns null if not possible
     */
    Tile.extractStraight = function (tiles, firstTile) {
        if (firstTile.type !== TileType.Number) {
            return null;
        }
        var tiles = Tile.copyArray(tiles);
        var secondTile = firstTile.nextNumber();
        var thirdTile = (secondTile === null) ? null : secondTile.nextNumber();
        if (thirdTile === null) {
            return null;
        }
        var found = [firstTile, secondTile, thirdTile].map(function (tile, i, a) {
            return Tile.remove(tiles, tile);
        });
        if (found.indexOf(false) !== -1) {
            // There was a tile we couldn't find in the array
            return null;
        }
        else {
            return {
                straight: new meld_1.Straight(firstTile, secondTile, thirdTile),
                otherTiles: tiles
            };
        }
    };
    return Tile;
}());
exports.Tile = Tile;
(function (Suit) {
    Suit[Suit["Character"] = 0] = "Character";
    Suit[Suit["Circle"] = 1] = "Circle";
    Suit[Suit["Bamboo"] = 2] = "Bamboo";
    Suit[Suit["Wind"] = 3] = "Wind";
    Suit[Suit["Dragon"] = 4] = "Dragon";
})(exports.Suit || (exports.Suit = {}));
var Suit = exports.Suit;
(function (TileType) {
    TileType[TileType["Number"] = 0] = "Number";
    TileType[TileType["Honor"] = 1] = "Honor"; // Wind or Dragon
})(exports.TileType || (exports.TileType = {}));
var TileType = exports.TileType;
(function (Wind) {
    Wind[Wind["East"] = 0] = "East";
    Wind[Wind["South"] = 1] = "South";
    Wind[Wind["West"] = 2] = "West";
    Wind[Wind["North"] = 3] = "North";
})(exports.Wind || (exports.Wind = {}));
var Wind = exports.Wind;
(function (Dragon) {
    Dragon[Dragon["White"] = 0] = "White";
    Dragon[Dragon["Green"] = 1] = "Green";
    Dragon[Dragon["Red"] = 2] = "Red";
})(exports.Dragon || (exports.Dragon = {}));
var Dragon = exports.Dragon;
