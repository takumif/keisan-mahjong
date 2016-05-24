/// <reference path="../typings/index.d.ts" />
/// <reference path="../dist/index.d.ts" />
var T = require("../dist/tile");
var Tile = T.Tile, Suit = T.Suit, TileType = T.TileType, Wind = T.Wind, Dragon = T.Dragon;

describe("A tile object", () => {
    it("throws an error when the constructor gets invalid stuff", () => {
        expect(() => { new Tile(Suit.Bamboo, 42) }).toThrow();
        expect(() => { new Tile(Suit.Character, 0) }).toThrow();
        expect(() => { new Tile(Suit.Dragon, -1) }).toThrow();
        expect(() => { new Tile(Suit.Wind, 5) }).toThrow();
        expect(() => { new Tile(Suit.Bamboo, 7) }).not.toThrow();
    });
    
    it("equals another tile iff they have the same properties", () => {
        var tile = new Tile(Suit.Bamboo, 1);
        var same = new Tile(Suit.Bamboo, 1);
        var different1 = new Tile(Suit.Bamboo, 2);
        var different2 = new Tile(Suit.Wind, Wind.East);
        expect(tile.equals(same)).toBe(true);
        expect(tile.equals(different1)).toBe(false);
        expect(tile.equals(different1)).toBe(false);
    });
});