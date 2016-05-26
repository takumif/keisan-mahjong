"use strict";
var tile_1 = require("./tile");
var Parser = (function () {
    function Parser() {
    }
    Parser.parseHand = function (text) {
        throw "parseHand unimplemented";
    };
    Parser.parseTiles = function (text) {
        text = text.replace(/\s|\[|\]|\(|\)/g, "");
        var splitText = text.split(",");
        return splitText.map(function (tileText, i, a) {
            return Parser.parseTile(tileText);
        });
    };
    Parser.parseTile = function (text) {
        text = text.replace(/\s/g, "");
        var num = Number(text.charAt(text.length - 1));
        if (isNaN(num)) {
            return Parser.parseHonorTile(text);
        }
        else {
            return Parser.parseNumberTile(text.substring(0, text.length - 1), num);
        }
    };
    Parser.exportHand = function (hand) {
        throw "unimplemented";
    };
    Parser.exportMelds = function (melds) {
        throw "unimplemented";
    };
    Parser.exportTile = function (tile) {
        throw "unimplemented";
    };
    Parser.parseHonorTile = function (text) {
        text = text.replace(/\s/g, "").toLowerCase();
        switch (text) {
            case "east":
            case "e":
                return new tile_1.Tile(tile_1.Suit.Wind, tile_1.Wind.East);
            case "south":
            case "s":
                return new tile_1.Tile(tile_1.Suit.Wind, tile_1.Wind.South);
            case "west":
            case "w":
                return new tile_1.Tile(tile_1.Suit.Wind, tile_1.Wind.West);
            case "north":
            case "n":
                return new tile_1.Tile(tile_1.Suit.Wind, tile_1.Wind.North);
            case "white":
            case "bai":
            case "haku":
                return new tile_1.Tile(tile_1.Suit.Dragon, tile_1.Dragon.White);
            case "green":
            case "fa":
            case "hatsu":
                return new tile_1.Tile(tile_1.Suit.Dragon, tile_1.Dragon.Green);
            case "red":
            case "zhong":
            case "chun":
                return new tile_1.Tile(tile_1.Suit.Dragon, tile_1.Dragon.Red);
        }
        throw "Unable to parse the text for a tile: " + text;
    };
    Parser.parseNumberTile = function (text, value) {
        text = text.replace(/\s/g, "").toLowerCase();
        switch (text) {
            case "character":
            case "w":
            case "wan":
                return new tile_1.Tile(tile_1.Suit.Character, value);
            case "circle":
            case "t":
            case "p":
            case "ton":
                return new tile_1.Tile(tile_1.Suit.Circle, value);
            case "bamboo":
            case "s":
            case "sou":
                return new tile_1.Tile(tile_1.Suit.Bamboo, value);
        }
        throw "Unable to parse the text for a tile: " + text;
    };
    return Parser;
}());
exports.Parser = Parser;
