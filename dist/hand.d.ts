import { Tile, Wind } from "./tile";
import { Meld } from "./meld";
export declare class Hand {
    closedMelds: Meld[];
    openMelds: Meld[];
    winningMeld: Meld;
    melds: Meld[];
    tiles: Tile[];
    seatWind: Wind;
    roundWind: Wind;
    winningTile: Tile;
    dora: Tile[];
    uraDora: Tile[];
    bonuses: WinningBonus[];
    winMethod: WinningMethod;
    /**
     * Put the winning meld in winningMeld, not openMelds.
     */
    constructor(closedMelds: Meld[], openMelds: Meld[], winningMeld: Meld, info: {
        seatWind: Wind;
        roundWind: Wind;
        winningTile: Tile;
        winMethod: WinningMethod;
        dora?: Tile[];
        uraDora?: Tile[];
        bonuses?: WinningBonus[];
    });
    isClosed(): boolean;
    /**
     * Waiting for just one side (e.g. 3 in 1-2-3) of a straight
     */
    isOneSideWait(): boolean;
    /**
     * Waiting for either side of a straight.
     * E.g. You have 3-4 and are waiting for either 2 or 5
     */
    isTwoSidesWait(): boolean;
    /**
     * Waiting for the middle tile of a straight
     */
    isMiddleWait(): boolean;
    /**
     * Waiting for one of the tiles in a pair
     */
    isPairWait(): boolean;
    hasBonus(bonus: WinningBonus): boolean;
    /**
     * Returns points + 1 if closed, just points otherwise
     */
    plusOneIfClosed(points: number): number;
    private getTiles();
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
