import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"
import {Hand} from "./hand"

export class Parser {
    static parseHand(text: string): Hand {
        throw "unimplemented";
    }
    
    static parseTiles(text: string): Tile[] {
        text = text.replace(/\s|\[|\]|\(|\)/g, "");
        var splitText = text.split(",");
        return splitText.map((tileText, i, a) => {
            return Parser.parseTile(tileText);
        });
    }
    
    static parseTile(text: string): Tile {
        text = text.replace(/\s/g, "");
        var num = Number(text.charAt(text.length - 1));
        if (isNaN(num)) {
            return Parser.parseHonorTile(text);
        } else {
            return Parser.parseNumberTile(text.substring(0, text.length - 1), num);
        }
    }
    
    static exportHand(hand: Hand): string {
        throw "unimplemented";
    }
    
    static exportMelds(melds: Meld[]): string {
        throw "unimplemented";
    }
    
    static exportTile(tile: Tile): string {
        throw "unimplemented";
    }
    
    private static parseHonorTile(text: string): Tile {
        text = text.replace(/\s/g, "").toLowerCase();
        switch (text) {
            case "east":
            case "e":
                return new Tile(Suit.Wind, Wind.East);
            case "south":
            case "s":
                return new Tile(Suit.Wind, Wind.South);
            case "west":
            case "w":
                return new Tile(Suit.Wind, Wind.West);
            case "north":
            case "n":
                return new Tile(Suit.Wind, Wind.North);
            case "white":
            case "bai":
            case "haku":
                return new Tile(Suit.Dragon, Dragon.White);
            case "green":
            case "fa":
            case "hatsu":
                return new Tile(Suit.Dragon, Dragon.Green);
            case "red":
            case "zhong":
            case "chun":
                return new Tile(Suit.Dragon, Dragon.Red);
        }
        throw "Unable to parse the text for a tile: " + text;
    }
    
    private static parseNumberTile(text: string, value: number): Tile {
        text = text.replace(/\s/g, "").toLowerCase();
        switch (text) {
            case "character":
            case "w":
            case "wan":
                return new Tile(Suit.Character, value);
            case "circle":
            case "t":
            case "p":
            case "ton":
                return new Tile(Suit.Circle, value);
            case "bamboo":
            case "s":
            case "sou":
                return new Tile(Suit.Bamboo, value);
        }
        throw "Unable to parse the text for a tile: " + text;
    }
}