import { Tile } from "./tile";
import { Meld } from "./meld";
import { Hand } from "./hand";
export declare abstract class Yaku {
    static japaneseName: string;
    static englishName: string;
    static list: typeof Yaku[];
    /**
     * Calculates how many points the hand can receive from the yaku.
     * 0 if the yaku doesn't apply to the hand.
     */
    static calculate(hand: Hand): number;
    static getApplyingYakuList(hand: Hand): typeof Yaku[];
    static calculateHan(hand: Hand, yakus?: typeof Yaku[]): number;
    static jasmineToString(): string;
    private static initYakuList();
}
export declare abstract class AbstractDora extends Yaku {
    static calculateDoraPoints(doraTiles: Tile[], tiles: Tile[]): number;
}
export declare abstract class AbstractDoubleStraight extends Yaku {
    /**
     * If there's one there's iipeikou, and if there are two it's ryanpeikou
     */
    protected static countDoubleStraights(melds: Meld[]): number;
}
/**
 * Tanyaou Chuu (all simples) yaku pattern
 * A hand consisting only of suit tiles 2-8 (without terminal or honor tiles)
 *
 * Must be closed : no (some rules say yes)
 * Han : 1
 */
export declare class AllSimples extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
export declare class AllTriples extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Rinshan Kaihou (After Quadruple) yaku pattern
 * Winning after drawing a replacement tile.
 *
 * Must be closed: no
 * Han: 1
 */
export declare class DeadWallDraw extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Dora yaku pattern
 *
 * Must be closed: no
 * Han: 1 / dora
 */
export declare class Dora extends AbstractDora {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Double Riichi yaku pattern
 * Declaring riichi within the first uninterrupted go around.
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class DoubleRiichi extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Iipeikou (pure double chii) yaku pattern
 * Two chiis of the same value and suit
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class DoubleStraight extends AbstractDoubleStraight {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Fanpai/Yakuhai (Dragon Triple) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1 per meld
 */
export declare class FanpaiDragonTriple extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Fanpai/Yakuhai (Round Wind) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1
 */
export declare class FanpaiRoundWind extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Fanpai/Yakuhai (Seat Wind) yaku pattern
 * A pon or kan in the players wind.
 *
 * Must be closed: no
 * Han: 1
 */
export declare class FanpaiSeatWind extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Chinitsu (full flush) yaku pattern
 * A hand with tiles from only one suit
 *
 * Must be closed: no
 * Han: 6 (closed) / 5 (open)
 */
export declare class FullFlush extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Honitsu (half flush) yaku pattern
 * A hand with tiles from only one suit plus honor tiles
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
export declare class HalfFlush extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Ippatsu (One Shot) yaku pattern
 * Winning within the first uninterrupted go around after declaring riichi .
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class Ippatsu extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Haitei Raoyue (Last Tile Draw) yaku pattern
 * Winning on the very last tile
 *
 * Must be closed: no
 * Han: 1
 */
export declare class LastFromWall extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Houtei Raoyui (Last Tile Discard) yaku pattern
 * Winning on the very last discard
 *
 * Must be closed: no
 * Han: 1
 */
export declare class LastDiscard extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Shou Sangen (little three dragons) yaku pattern
 * Two pons/kans of dragons plus one pair of dragons.
 *
 * Must be closed: no
 * Han: 2
 */
export declare class LittleThreeDragons extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Menzen Tsumo (Fully closed Hand) yaku pattern
 * Going out on self-draw with a closed hand.
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class MenzenTsumo extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Pinfu (All chii / No points) yaku pattern
 * A hand with no fu except the one for winning
 * Just chii, no pair point (dragon or seat/prevalent wind) and a two-sided wait (only wait that give no fu)
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class Pinfu extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Itsu or Ikkitsuukan (pure straight) yaku pattern
 * Three consecutive chiis (1-9) in the same suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export declare class PureStraight extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Chan kan (Robbing the kan) yaku pattern
 * Winning on off a tile used to extend a kong.
 *
 * Must be closed: no
 * Han: 1
 */
export declare class QuadrupleRob extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Riichi yaku pattern
 * Waiting hand with declaration and 1000 point buy in.
 *
 * Must be closed: yes
 * Han: 1
 */
export declare class Riichi extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Chii Toitsu (seven pairs) yaku pattern
 * A hand consisting of seven pairs
 *
 * Must be closed: yes
 * Han: 2
 */
export declare class SevenPairs extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Honroutou (all terminals & honors) yaku pattern
 * A hand consisting of only terminals and honors
 *
 * Must be closed: no
 * Han: 2
 */
export declare class TerminalsAndHonors extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Junchan Taiyaochuu or Junchan (terminals in all melds) yaku pattern
 * A hand where all melds contain terminals
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
export declare class TerminalsInAllMelds extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Chanta (outside hand) yaku pattern
 * A hand where at least one meld contains honor tiles, and the rest contain a terminal.
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export declare class TerminalsOrHonorsInAllMelds extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * San Ankou (3 closed pons) yaku pattern
 * A hand with three closed pons or kans.
 *
 * Must be closed: no
 * Han: 2
 */
export declare class ThreeClosedTriples extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * San Shoku Doujun (mixed triple chii) yaku pattern
 * Three chiis of the same value, with one in each suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export declare class ThreeColorStraights extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * San Shoku Dokou (triple pon) yaku pattern
 * One pon or kan in each of the three suits, all having the same number.
 *
 * Must be closed: no
 * Han: 2
 */
export declare class ThreeColorTriples extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * San Kan Tsu (3 kans) yaku pattern
 * A hand with three kans.
 *
 * Must be closed: no
 * Han: 2
 */
export declare class ThreeQuadruples extends Yaku {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Ryanpeikou (twice pure double chiis) yaku pattern
 * Two pair of chiis, where each pair consists of two identical chiis.
 *
 * Must be closed: yes
 * Han: 3
 *
 */
export declare class TwoDoubleStraights extends AbstractDoubleStraight {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
/**
 * Ura-Dora yaku pattern
 *
 * Must be closed: no
 * Han: 1 / ura-dora
 */
export declare class UraDora extends AbstractDora {
    static japaneseName: string;
    static englishName: string;
    static calculate(hand: Hand): number;
}
