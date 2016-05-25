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

describe("Parser.parseHand", () => {
    it("can parse a hand", () => {
        var text =
            "closed: [w3, w4, w5, s7, s7, s7, s8, s8],\
            open: [s, s, s, red, red, red],\
            seat: e,\
            round: s,\
            win: s7,\
            dora: [s5],\
            ura dora: [],\
            riichi count: 0,\
            ippatsu: no";
        expect(Parser.parseHand(text)).toEqual(new Hand([
                new Straight(U.w3, U.w4, U.w5),
                new Triple(U.s7, U.s7, U.s7),
                new Pair(U.s8, U.s8)
            ], [
                new Triple(U.s, U.s, U.s),
                new Triple(U.red, U.red, U.red)
            ],
            Wind.East,
            Wind.South,
            U.s7,
            [U.s5],
            [],
            0,
            false
        ));
    });
});

describe("Parser.parseTiles", () => {
    it("can parse tiles", () => {
        expect(Parser.parseTiles("[w3, p9, s2, w, white]")).toEqual([
            new Tile(Suit.Character, 3),
            new Tile(Suit.Circle, 9),
            new Tile(Suit.Bamboo, 2),
            new Tile(Suit.Wind, Wind.West),
            new Tile(Suit.Dragon, Dragon.White),
        ]);
    });
});

describe("Parser.parseTile", () => {
    it("can parse a tile", () => {
        expect(Parser.parseTile(" W 3 ")).toEqual(new Tile(Suit.Character, 3));
        expect(Parser.parseTile("\nWest")).toEqual(new Tile(Suit.Wind, Wind.West));
    });
    
    it("gives errors if not parseable", () => {
        expect(() => { Parser.parseTile("") }).toThrow();
        expect(() => {Parser.parseTile("asdf1") }).toThrow();
    });
});
