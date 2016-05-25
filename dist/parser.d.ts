import { Tile } from "./tile";
import { Meld } from "./meld";
import { Hand } from "./hand";
export declare class Parser {
    static parseHand(text: string): Hand;
    static parseTiles(text: string): Tile[];
    static parseTile(text: string): Tile;
    static exportHand(hand: Hand): string;
    static exportMelds(melds: Meld[]): string;
    static exportTile(tile: Tile): string;
    private static parseHonorTile(text);
    private static parseNumberTile(text, value);
}
