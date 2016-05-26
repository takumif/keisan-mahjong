"use strict";
var meld_1 = require("./meld");
var Hand = (function () {
    /**
     * Put the winning meld in winningMeld, not openMelds.
     */
    function Hand(closedMelds, openMelds, winningMeld, info) {
        this.closedMelds = closedMelds;
        this.openMelds = openMelds;
        this.winningMeld = winningMeld;
        this.melds = this.closedMelds.concat(this.openMelds).concat([winningMeld]);
        this.tiles = this.getTiles();
        this.seatWind = info.seatWind;
        this.roundWind = info.roundWind;
        this.winningTile = info.winningTile;
        this.winMethod = info.winMethod;
        this.dora = info.dora ? info.dora : [];
        this.uraDora = info.uraDora ? info.uraDora : [];
        this.bonuses = info.bonuses ? info.bonuses : [];
    }
    Hand.prototype.isClosed = function () {
        return this.openMelds.length === 0;
    };
    /**
     * Waiting for just one side (e.g. 3 in 1-2-3) of a straight
     */
    Hand.prototype.isOneSideWait = function () {
        return this.winningMeld instanceof meld_1.Straight
            && ((this.winningTile.value === 3 && this.winningTile.equals(this.winningMeld.tiles[2]))
                || (this.winningTile.value === 7 && this.winningTile.equals(this.winningMeld.tiles[0])));
    };
    /**
     * Waiting for either side of a straight.
     * E.g. You have 3-4 and are waiting for either 2 or 5
     */
    Hand.prototype.isTwoSidesWait = function () {
        return this.winningMeld instanceof meld_1.Straight
            && !this.isOneSideWait()
            && !this.isMiddleWait();
    };
    /**
     * Waiting for the middle tile of a straight
     */
    Hand.prototype.isMiddleWait = function () {
        return this.winningMeld instanceof meld_1.Straight
            && this.winningTile.equals(this.winningMeld.tiles[1]);
    };
    /**
     * Waiting for one of the tiles in a pair
     */
    Hand.prototype.isPairWait = function () {
        return this.winningMeld instanceof meld_1.Pair;
    };
    Hand.prototype.hasBonus = function (bonus) {
        return this.bonuses.indexOf(bonus) !== -1;
    };
    /**
     * Returns points + 1 if closed, just points otherwise
     */
    Hand.prototype.plusOneIfClosed = function (points) {
        if (this.isClosed()) {
            return points + 1;
        }
        else {
            return points;
        }
    };
    Hand.prototype.getTiles = function () {
        var tiles = [];
        for (var i = 0; i < this.melds.length; i++) {
            for (var j = 0; j < this.melds[i].tiles.length; j++) {
                tiles.push(this.melds[i].tiles[j]);
            }
        }
        return tiles;
    };
    return Hand;
}());
exports.Hand = Hand;
(function (WinningBonus) {
    WinningBonus[WinningBonus["QuadrupleRob"] = 0] = "QuadrupleRob";
    WinningBonus[WinningBonus["LastFromWall"] = 1] = "LastFromWall";
    WinningBonus[WinningBonus["LastDiscard"] = 2] = "LastDiscard";
    WinningBonus[WinningBonus["DeadWallDraw"] = 3] = "DeadWallDraw";
    WinningBonus[WinningBonus["Riichi"] = 4] = "Riichi";
    WinningBonus[WinningBonus["DoubleRiichi"] = 5] = "DoubleRiichi";
    WinningBonus[WinningBonus["Ippatsu"] = 6] = "Ippatsu";
})(exports.WinningBonus || (exports.WinningBonus = {}));
var WinningBonus = exports.WinningBonus;
(function (WinningMethod) {
    WinningMethod[WinningMethod["Tsumo"] = 0] = "Tsumo";
    WinningMethod[WinningMethod["Ron"] = 1] = "Ron"; // taking a discard
})(exports.WinningMethod || (exports.WinningMethod = {}));
var WinningMethod = exports.WinningMethod;
