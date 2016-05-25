"use strict";
var Hand = (function () {
    function Hand(closedMelds, openMelds, seatWind, roundWind, 
        // private winningMeld: Meld,
        winningTile, 
        // private winType,
        // private winSecondType,
        dora, uraDora, riichi, doubleRiichi, ippatsu, winBonus, winningDraw) {
        this.closedMelds = closedMelds;
        this.openMelds = openMelds;
        this.seatWind = seatWind;
        this.roundWind = roundWind;
        this.winningTile = winningTile;
        this.dora = dora;
        this.uraDora = uraDora;
        this.riichi = riichi;
        this.doubleRiichi = doubleRiichi;
        this.ippatsu = ippatsu;
        this.winBonus = winBonus;
        this.winningDraw = winningDraw;
        this.melds = this.closedMelds.concat(this.openMelds);
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
    return Hand;
}());
exports.Hand = Hand;
(function (WinningTileBonus) {
    WinningTileBonus[WinningTileBonus["None"] = 0] = "None";
    WinningTileBonus[WinningTileBonus["QuadrupleRob"] = 1] = "QuadrupleRob";
    WinningTileBonus[WinningTileBonus["LastFromWall"] = 2] = "LastFromWall";
    WinningTileBonus[WinningTileBonus["LastDiscard"] = 3] = "LastDiscard";
    WinningTileBonus[WinningTileBonus["DeadWallDraw"] = 4] = "DeadWallDraw";
})(exports.WinningTileBonus || (exports.WinningTileBonus = {}));
var WinningTileBonus = exports.WinningTileBonus;
(function (WinningDraw) {
    WinningDraw[WinningDraw["Tsumo"] = 0] = "Tsumo";
    WinningDraw[WinningDraw["Ron"] = 1] = "Ron"; // taking a discard
})(exports.WinningDraw || (exports.WinningDraw = {}));
var WinningDraw = exports.WinningDraw;
