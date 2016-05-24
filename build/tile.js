/// <reference path="meld.ts" />
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
            if (value < 0 || value > 9) {
                throw "Invalid number value!";
            }
            this.type = TileType.Number;
        }
    }
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
            if (tiles[i] !== tiles[i + 1]) {
                return null;
            }
            pairs.push(new Pair(tiles[i], tiles[i + 1]));
        }
        return pairs;
    };
    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples.
     * An empty list if no melds can be formed.
     */
    Tile.formMelds = function (tiles) {
        if (tiles.length % 3 !== 2) {
            throw "Invalid number of tiles!";
        }
        var tiles = Tile.copyArray(tiles);
        tiles.sort(Tile.compare);
        return Tile.formMeldsWithSortedTiles(tiles);
    };
    Tile.prototype.equals = function (other) {
        return this.suit === other.suit && this.value === other.value;
    };
    /**
     * Returns null if the tile is a 9 or an honor tile
     */
    Tile.prototype.nextNumber = function () {
        if (this.type === TileType.Number) {
            if (this.value === 9) {
                return null;
            }
            else {
                return new Tile(this.suit, this.value);
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
     * Requires that the tiles are sorted.
     */
    Tile.formMeldsWithSortedTiles = function (tiles) {
        if (tiles.length === 0) {
            return [[]];
        }
        var meldLists = [];
        meldLists.concat(Tile.formMeldsWithFirstTileInPair(tiles));
        meldLists.concat(Tile.formMeldsWithFirstTileInTriple(tiles));
        meldLists.concat(Tile.formMeldsWithFirstTileInStraight(tiles));
        return meldLists.filter(function (melds, i, a) {
            return Meld.hasOneOrSevenPairs(melds);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInPair = function (tiles) {
        if (tiles.length % 3 !== 2) {
            throw "Invalid number of tiles!";
        }
        if (!tiles[0].equals(tiles[1])) {
            return [[]];
        }
        var pair = new Pair(tiles[0], tiles[1]);
        return Tile.formMeldsWithSortedTiles(tiles.slice(2)).map(function (melds, i, a) {
            return melds.concat([pair]);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInTriple = function (tiles) {
        if (tiles.length % 3 !== 2 || tiles.length < 3) {
            throw "Invalid number of tiles!";
        }
        if (!tiles[0].equals(tiles[1]) || !tiles[0].equals(tiles[2])) {
            return [[]];
        }
        var triple = new Triple(tiles[0], tiles[1], tiles[2]);
        return Tile.formMeldsWithSortedTiles(tiles.slice(3)).map(function (melds, i, a) {
            return melds.concat([triple]);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Tile.formMeldsWithFirstTileInStraight = function (tiles) {
        if (tiles.length % 3 !== 2 || tiles.length < 3) {
            throw "Invalid number of tiles!";
        }
        var straight = Tile.extractStraight(tiles, tiles[0]);
        if (straight === null) {
            return [[]];
        }
        else {
            return Tile.formMeldsWithSortedTiles(straight.otherTiles).map(function (melds, i, a) {
                return melds.concat([straight.straight]);
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
                straight: new Straight(firstTile, secondTile, thirdTile),
                otherTiles: tiles
            };
        }
    };
    return Tile;
}());
var Suit;
(function (Suit) {
    Suit[Suit["Character"] = 0] = "Character";
    Suit[Suit["Circle"] = 1] = "Circle";
    Suit[Suit["Bamboo"] = 2] = "Bamboo";
    Suit[Suit["Wind"] = 3] = "Wind";
    Suit[Suit["Dragon"] = 4] = "Dragon";
})(Suit || (Suit = {}));
var TileType;
(function (TileType) {
    TileType[TileType["Number"] = 0] = "Number";
    TileType[TileType["Honor"] = 1] = "Honor"; // Wind or Dragon
})(TileType || (TileType = {}));
var Wind;
(function (Wind) {
    Wind[Wind["East"] = 0] = "East";
    Wind[Wind["South"] = 1] = "South";
    Wind[Wind["West"] = 2] = "West";
    Wind[Wind["North"] = 3] = "North";
})(Wind || (Wind = {}));
var Dragon;
(function (Dragon) {
    Dragon[Dragon["White"] = 0] = "White";
    Dragon[Dragon["Green"] = 1] = "Green";
    Dragon[Dragon["Red"] = 2] = "Red";
})(Dragon || (Dragon = {}));
