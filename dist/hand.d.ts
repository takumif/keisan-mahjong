import { Tile, Wind } from "./tile";
import { Meld } from "./meld";
export declare class Hand {
    closedMelds: Meld[];
    openMelds: Meld[];
    seatWind: Wind;
    roundWind: Wind;
    winningTile: Tile;
    dora: Tile[];
    uraDora: Tile[];
    riichi: boolean;
    doubleRiichi: boolean;
    ippatsu: boolean;
    winBonus: WinningTileBonus;
    winningDraw: WinningDraw;
    melds: Meld[];
    constructor(closedMelds: Meld[], openMelds: Meld[], seatWind: Wind, roundWind: Wind, winningTile: Tile, dora: Tile[], uraDora: Tile[], riichi: boolean, doubleRiichi: boolean, ippatsu: boolean, winBonus: WinningTileBonus, winningDraw: WinningDraw);
    isClosed(): boolean;
    isEdgeWait(): boolean;
    isClosedWait(): boolean;
    isSingleWait(): boolean;
}
export declare enum WinningTileBonus {
    None = 0,
    QuadrupleRob = 1,
    LastFromWall = 2,
    LastDiscard = 3,
    DeadWallDraw = 4,
}
export declare enum WinningDraw {
    Tsumo = 0,
    Ron = 1,
}
