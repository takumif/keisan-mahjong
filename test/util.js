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

module.exports = {
    w1: new Tile(Suit.Character, 1),
    w2: new Tile(Suit.Character, 2),
    w3: new Tile(Suit.Character, 3),
    w4: new Tile(Suit.Character, 4),
    w5: new Tile(Suit.Character, 5),
    w6: new Tile(Suit.Character, 6),
    w7: new Tile(Suit.Character, 7),
    w8: new Tile(Suit.Character, 8),
    w9: new Tile(Suit.Character, 9),
    
    p1: new Tile(Suit.Circle, 1),
    p2: new Tile(Suit.Circle, 2),
    p3: new Tile(Suit.Circle, 3),
    p4: new Tile(Suit.Circle, 4),
    p5: new Tile(Suit.Circle, 5),
    p6: new Tile(Suit.Circle, 6),
    p7: new Tile(Suit.Circle, 7),
    p8: new Tile(Suit.Circle, 8),
    p9: new Tile(Suit.Circle, 9),
    
    s1: new Tile(Suit.Bamboo, 1),
    s2: new Tile(Suit.Bamboo, 2),
    s3: new Tile(Suit.Bamboo, 3),
    s4: new Tile(Suit.Bamboo, 4),
    s5: new Tile(Suit.Bamboo, 5),
    s6: new Tile(Suit.Bamboo, 6),
    s7: new Tile(Suit.Bamboo, 7),
    s8: new Tile(Suit.Bamboo, 8),
    s9: new Tile(Suit.Bamboo, 9),
    
    e: new Tile(Suit.Wind, Wind.East),
    s: new Tile(Suit.Wind, Wind.South),
    w: new Tile(Suit.Wind, Wind.West),
    n: new Tile(Suit.Wind, Wind.North),
    
    white: new Tile(Suit.Dragon, Dragon.White),
    green: new Tile(Suit.Dragon, Dragon.Green),
    red: new Tile(Suit.Dragon, Dragon.Red)
};