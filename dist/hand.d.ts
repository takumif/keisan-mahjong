import { Tile, Wind } from "./tile";
import { Meld } from "./meld";
export declare class Hand {
    closedMelds: Meld[];
    openMelds: Meld[];
    melds: Meld[];
    tiles: Tile[];
    seatWind: Wind;
    roundWind: Wind;
    winningTile: Tile;
    dora: Tile[];
    uraDora: Tile[];
    bonuses: WinningBonus[];
    winMethod: WinningMethod;
    constructor(closedMelds: Meld[], openMelds: Meld[], info: {
        seatWind: Wind;
        roundWind: Wind;
        winningTile: Tile;
        dora: Tile[];
        uraDora: Tile[];
        bonuses: WinningBonus[];
        winMethod: WinningMethod;
    });
    isClosed(): boolean;
    isEdgeWait(): boolean;
    isClosedWait(): boolean;
    isSingleWait(): boolean;
    hasBonus(bonus: WinningBonus): boolean;
    private getTiles();
    /**
     * Returns points + 1 if closed, just points otherwise
     */
    plusOneIfClosed(points: number): number;
}
export declare enum WinningBonus {
    QuadrupleRob = 0,
    LastFromWall = 1,
    LastDiscard = 2,
    DeadWallDraw = 3,
    Riichi = 4,
    DoubleRiichi = 5,
    Ippatsu = 6,
}
export declare enum WinningMethod {
    Tsumo = 0,
    Ron = 1,
}
