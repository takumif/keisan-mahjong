"use strict";
var Hand = (function () {
    function Hand(closedMelds, openMelds, info) {
        this.closedMelds = closedMelds;
        this.openMelds = openMelds;
        this.melds = this.closedMelds.concat(this.openMelds);
        this.tiles = this.getTiles();
        this.seatWind = info.seatWind;
        this.roundWind = info.roundWind;
        this.winningTile = info.winningTile;
        this.dora = info.dora;
        this.uraDora = info.uraDora;
        this.bonuses = info.bonuses;
        this.winMethod = info.winMethod;
    }
    Hand.prototype.isClosed = function () {
        return this.openMelds.length === 0;
    };
    Hand.prototype.isEdgeWait = function () {
        throw "unimplemented";
    };
    Hand.prototype.isClosedWait = function () {
        throw "unimplemented";
    };
    Hand.prototype.isSingleWait = function () {
        throw "unimplemented";
    };
    Hand.prototype.hasBonus = function (bonus) {
        return this.bonuses.indexOf(bonus) !== -1;
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
