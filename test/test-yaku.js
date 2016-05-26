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
var Yaku = Y.Yaku;
var U = require("./util");

var info = {
    seatWind: Wind.East,
    roundWind: Wind.East, 
    winningTile: U.p6,
    dora: [U.p3],
    uraDora: [],
    bonuses: [], 
    winMethod: WinningMethod.Ron
}

describe("Yaku.getApplyingYakuList", () => {
    it("returns the correct list of yaku", () => {
        var hand = new Hand(
            [new Triple(U.w3), new Triple(U.w4), new Pair(U.s3)],
            [new Triple(U.p4)],
            new Triple(U.p6),
            info
        );
        expect(Yaku.getApplyingYakuList(hand)).toEqual([Y.AllSimples, Y.AllTriples, Y.Dora]);
    });
});

describe("AllSimples", () => {
    it("calculates points correctly", () => {
        var hand = new Hand(
            [new Triple(U.w2), new Straight(U.p3, U.p4, U.p5), new Pair(U.s8)],
            [new Triple(U.w5)],
            new Triple(U.p6),
            info
        );
        expect(Y.AllSimples.calculate(hand)).toEqual(1);
    });
});

describe("HalfFlush", () => {
    it("calculates points correctly", () => {
        info.winningTile = U.w4;
        var hand = new Hand([
                new Triple(U.w1),
                new Triple(U.w2),
                new Triple(U.e),
                new Pair(U.white)
            ], [], new Triple(U.w4), info
        );
        expect(Y.HalfFlush.calculate(hand)).toEqual(3);
    });
});
