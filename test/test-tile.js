/// <reference path="../typings/index.d.ts" />
/// <reference path="../dist/index.d.ts" />
var T = require("../dist/tile");
var Tile = T.Tile, Suit = T.Suit, TileType = T.TileType, Wind = T.Wind, Dragon = T.Dragon;

describe("A tile object", () => {
    
    
    
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

describe("The Tile class", () => {
    var w1 = new Tile(Suit.Character, 1);
    var w1_2 = new Tile(Suit.Character, 1);
    var w2 = new Tile(Suit.Character, 2);
    var w2_2 = new Tile(Suit.Character, 2);
    var w9 = new Tile(Suit.Character, 9);
    var w9_2 = new Tile(Suit.Character, 9);
    var p6 = new Tile(Suit.Circle, 6);
    var p6_2 = new Tile(Suit.Circle, 6);
    var s3 = new Tile(Suit.Bamboo, 3);
    var s3_2 = new Tile(Suit.Bamboo, 3);
    var east = new Tile(Suit.Wind, Wind.East);
    var east2 = new Tile(Suit.Wind, Wind.East);
    var bai = new Tile(Suit.Dragon, Dragon.White);
    var bai2 = new Tile(Suit.Dragon, Dragon.White);
    
    var sevenPairTiles = [w1, w1_2, w2, w2_2, w9, w9_2, p6, p6_2, s3, s3_2, east, east2, bai, bai2];
    
    it("throws an error when the constructor gets invalid stuff", () => {
        expect(() => { new Tile(Suit.Bamboo, 42) }).toThrow();
        expect(() => { new Tile(Suit.Character, 0) }).toThrow();
        expect(() => { new Tile(Suit.Dragon, -1) }).toThrow();
        expect(() => { new Tile(Suit.Wind, 5) }).toThrow();
        expect(() => { new Tile(Suit.Bamboo, 7) }).not.toThrow();
    });
    
    it("orders the tiles in the order of chars, circles, bamboos, winds, then dragons", () => {
        
        expect(Tile.compare(w1, w9)).toEqual(-1);
        expect(Tile.compare(s3, w9)).toEqual(1);
        expect(Tile.compare(s3, w1)).toEqual(1);
        expect(Tile.compare(east, w9)).toEqual(1);
        expect(Tile.compare(east, bai)).toEqual(-1);
        expect(Tile.compare(bai, bai2)).toEqual(0);
        expect([east, s3, bai, w9, w1].sort(Tile.compare))
            .toEqual([w1, w9, s3, east, bai]);
    });
    
    it("gets the indices of tiles in an array", () => {
        
    });
    
    it("can recognize seven pairs", () => {
        expect(Tile.formSevenPairs(
            sevenPairTiles
        )).not.toBeNull();
        expect(Tile.formSevenPairs(
            sevenPairTiles
        ).length).toEqual(7);
    })
    
    it("can form seven pairs when asked to form melds", () => {
        console.log(sevenPairTiles);
        expect(Tile.formMelds(sevenPairTiles).length).toEqual(1);
        expect(Tile.formMelds(sevenPairTiles)[0].length).toEqual(7);
    })
});