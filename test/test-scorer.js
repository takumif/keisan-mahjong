/// <reference path="../typings/index.d.ts" />
/// <reference path="../dist/index.d.ts" />
var T = require("../dist/tile");
var Tile = T.Tile, Suit = T.Suit, TileType = T.TileType, Wind = T.Wind, Dragon = T.Dragon;
var M = require("../dist/meld");
var Meld = M.Meld, Pair = M.Pair, Triple = M.Triple, Straight = M.Straight, Quadruple = M.Quadruple;
var P = require("../dist/parser");
var Parser = P.Parser;
var H = require("../dist/hand");
var Hand = H.Hand, WinningBonus = H.WinningBonus, WinningMethod = H.WinningMethod;
var Y = require("../dist/yaku");
var S = require("../dist/scorer");
var Scorer = S.Scorer;
var U = require("./util");

var info = {
    seatWind: Wind.East,
    roundWind: Wind.East, 
    winningTile: U.s8,
    dora: [U.p3],
    uraDora: [],
    bonuses: [], 
    winMethod: WinningMethod.Ron
}

describe("Scorer.calculateBasePayment", () => {
    it("calculates the base payment correctly", () => {
        expect(Scorer.calculateBasePayment(4, 30)).toEqual(1920);
        expect(Scorer.calculateBasePayment(3, 60)).toEqual(1920);
    });
});