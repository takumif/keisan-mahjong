"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tile_1 = require("./tile");
var Meld = (function () {
    function Meld() {
    }
    Meld.prototype.equals = function (other) {
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
    };
    Meld.prototype.toString = function () {
        var _this = this;
        var str = "[";
        this.tiles.forEach(function (tile, i, _) {
            str += tile.toString();
            if (i < _this.tiles.length - 1) {
                str += ", ";
            }
        });
        return str + "]";
    };
    Meld.hasOneOrSevenPairs = function (melds) {
        var pairs = 0;
        melds.forEach(function (meld, i, a) {
            if (meld instanceof Pair) {
                pairs++;
            }
        });
        return pairs === 1 || pairs === 7;
    };
    /**
     * Returns a list of possible ways to form melds with the given tiles.
     * We assume that the tiles are closed, and hence there are no quadruples,
     * and there should be one to five melds (one of which a pair), or seven pairs.
     * An empty list is returned if all combinations end up with leftover tiles.
     */
    Meld.formMelds = function (tiles) {
        if (tiles.length % 3 !== 2 || tiles.length > 14) {
            throw "Invalid number of tiles!";
        }
        var tiles = tile_1.Tile.copyArray(tiles);
        tiles.sort(tile_1.Tile.compare);
        var meldLists = Meld.formMeldsWithSortedTiles(tiles);
        return meldLists.filter(function (melds, i, a) {
            return Meld.hasOneOrSevenPairs(melds);
        });
    };
    /**
     * Requires that the tiles are sorted.
     */
    Meld.formMeldsWithSortedTiles = function (tiles) {
        if (tiles.length === 0) {
            return [[]];
        }
        var meldLists = [];
        meldLists = meldLists
            .concat(Meld.formMeldsWithFirstTileInPair(tiles))
            .concat(Meld.formMeldsWithFirstTileInTriple(tiles))
            .concat(Meld.formMeldsWithFirstTileInStraight(tiles));
        return meldLists;
    };
    /**
     * Requires that the tiles are sorted
     */
    Meld.formMeldsWithFirstTileInPair = function (tiles) {
        if (tiles.length < 2 || !tiles[0].equals(tiles[1])) {
            return [];
        }
        var pair = new Pair(tiles[0]);
        return Meld.formMeldsWithSortedTiles(tiles.slice(2)).map(function (melds, i, a) {
            return [pair].concat(melds);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Meld.formMeldsWithFirstTileInTriple = function (tiles) {
        if (tiles.length < 3 || !tiles[0].equals(tiles[1]) || !tiles[0].equals(tiles[2])) {
            return [];
        }
        var triple = new Triple(tiles[0]);
        return Meld.formMeldsWithSortedTiles(tiles.slice(3)).map(function (melds, i, a) {
            return [triple].concat(melds);
        });
    };
    /**
     * Requires that the tiles are sorted
     */
    Meld.formMeldsWithFirstTileInStraight = function (tiles) {
        if (tiles.length < 3) {
            return [];
        }
        var straight = tile_1.Tile.extractStraight(tiles, tiles[0]);
        if (straight === null) {
            return [];
        }
        else {
            return Meld.formMeldsWithSortedTiles(straight.otherTiles).map(function (melds, i, a) {
                return [straight.straight].concat(melds);
            });
        }
    };
    return Meld;
}());
exports.Meld = Meld;
var Pair = (function (_super) {
    __extends(Pair, _super);
    function Pair(tile) {
        _super.call(this);
        this.tiles = [tile, tile];
        this.suit = tile.suit;
    }
    return Pair;
}(Meld));
exports.Pair = Pair;
var Triple = (function (_super) {
    __extends(Triple, _super);
    function Triple(tile) {
        _super.call(this);
        this.tiles = [tile, tile, tile];
        this.suit = tile.suit;
    }
    return Triple;
}(Meld));
exports.Triple = Triple;
var Straight = (function (_super) {
    __extends(Straight, _super);
    /**
     * You can either pass in the smallest tile, or all three tiles
     * as the arguments. They'd have the same effect
     */
    function Straight(tile1, tile2, tile3) {
        _super.call(this);
        if (tile2 === undefined) {
            tile2 = tile1.nextNumber();
            tile3 = tile2.nextNumber();
        }
        this.tiles = [tile1, tile2, tile3];
        this.suit = tile1.suit;
    }
    return Straight;
}(Meld));
exports.Straight = Straight;
var Quadruple = (function (_super) {
    __extends(Quadruple, _super);
    function Quadruple(tile) {
        _super.call(this);
        this.tiles = [tile, tile, tile, tile];
        this.suit = tile.suit;
    }
    return Quadruple;
}(Meld));
exports.Quadruple = Quadruple;
