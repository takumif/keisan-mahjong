"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Meld = (function () {
    function Meld() {
    }
    Meld.hasOneOrSevenPairs = function (melds) {
        var pairs = 0;
        melds.forEach(function (meld, i, a) {
            if (meld instanceof Pair) {
                pairs++;
            }
        });
        return pairs === 1 || pairs === 7;
    };
    return Meld;
}());
exports.Meld = Meld;
var Pair = (function (_super) {
    __extends(Pair, _super);
    function Pair(tile1, tile2) {
        _super.call(this);
        this.tiles = [tile1, tile2];
    }
    return Pair;
}(Meld));
exports.Pair = Pair;
var Triple = (function (_super) {
    __extends(Triple, _super);
    function Triple(tile1, tile2, tile3) {
        _super.call(this);
        this.tiles = [tile1, tile2, tile3];
    }
    return Triple;
}(Meld));
exports.Triple = Triple;
var Straight = (function (_super) {
    __extends(Straight, _super);
    function Straight(tile1, tile2, tile3) {
        _super.call(this);
        this.tiles = [tile1, tile2, tile3];
    }
    return Straight;
}(Meld));
exports.Straight = Straight;
var Quadruple = (function (_super) {
    __extends(Quadruple, _super);
    function Quadruple(tile1, tile2, tile3, tile4) {
        _super.call(this);
        this.tiles = [tile1, tile2, tile3, tile4];
    }
    return Quadruple;
}(Meld));
exports.Quadruple = Quadruple;
