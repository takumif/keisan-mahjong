/// <reference path="../typings/index.d.ts" />
/// <reference path="../dist/index.d.ts" />
var T = require("../dist/tile");
var Tile = T.Tile, Suit = T.Suit, TileType = T.TileType, Wind = T.Wind, Dragon = T.Dragon;
var M = require("../dist/meld");
var Meld = M.Meld, Pair = M.Pair, Triple = M.Triple, Straight = M.Straight, Quadruple = M.Quadruple;
var P = require("../dist/parser");
var Parser = P.Parser;
var H = require("../dist/hand");
var Hand = H.Hand;
var U = require("./util");

var sevenPairTiles = [U.w1, U.w1, U.w2, U.w2, U.w9, U.w9, U.p6, U.p6, U.s3, U.s3, U.e, U.e, U.white, U.white];
var ibeikou = [U.w1, U.w1, U.w2, U.w2, U.w3, U.w3, U.w9, U.w9, U.w9, U.s3, U.s3, U.s3, U.e, U.e];

describe("", () => {
    it("can form seven pairs when asked to form melds (formMelds)", () => {
        expect(Meld.formMelds(sevenPairTiles).length).toEqual(1);
        expect(Meld.formMelds(sevenPairTiles)[0].length).toEqual(7);
    });
    
    it("can get ibeikou right, and give back melds in the right order (formMelds)", () => {
        var melds = Meld.formMelds(ibeikou);
        expect(melds.length).toBeGreaterThan(0);
        expect(melds[0]).toContain(new Straight(U.w1, U.w2, U.w3));
        expect(melds[0]).toContain(new Triple(U.s3, U.s3, U.s3));
        expect(melds[0].length).toEqual(5);
        expect(melds[0]).toEqual([
            new Straight(U.w1, U.w2, U.w3),
            new Straight(U.w1, U.w2, U.w3),
            new Triple(U.w9, U.w9, U.w9),
            new Triple(U.s3, U.s3, U.s3),
            new Pair(U.e, U.e)
        ]);
    });
});
