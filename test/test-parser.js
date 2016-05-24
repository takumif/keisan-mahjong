/// <reference path="../typings/index.d.ts" />
/// <reference path="../dist/index.d.ts" />
var T = require("../dist/tile");
var Tile = T.Tile, Suit = T.Suit, TileType = T.TileType, Wind = T.Wind, Dragon = T.Dragon;
var M = require("../dist/meld");
var Meld = M.Meld, Pair = M.Pair, Triple = M.Triple, Straight = M.Straight, Quadruple = M.Quadruple;
var P = require("../dist/parser");
var Parser = P.Parser;

describe("Parser.parseTile", () => {
    it("can parse tiles", () => {
        expect(Parser.parseTile(" W 3 ")).toEqual(new Tile(Suit.Character, 3));
        expect(Parser.parseTile("\nWest")).toEqual(new Tile(Suit.Wind, Wind.West));
    });
    
    it("gives errors if not parseable", () => {
        expect(() => { Parser.parseTile("") }).toThrow();
        expect(() => {Parser.parseTile("asdf1") }).toThrow();
    });
});