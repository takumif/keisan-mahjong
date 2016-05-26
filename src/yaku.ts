import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"
import {Hand, WinningBonus, WinningMethod} from "./hand"

export abstract class Yaku {
    static japaneseName = "Japanese name not set";
    static englishName = "English name not set";
    static list: typeof Yaku[];
    
    /**
     * Calculates how many points the hand can receive from the yaku.
     * 0 if the yaku doesn't apply to the hand.
     */
    static calculate(hand: Hand): number {
        throw "Yaku.calculate(hand) needs to be overwritten";
    }
    
    static getApplyingYakuList(hand: Hand): typeof Yaku[] {
        var applyingYakus: typeof Yaku[] = [];
        Yaku.initYakuList();
        Yaku.list.forEach((Y, i, _) => {
            if (Y.calculate(hand) > 0) {
                applyingYakus.push(Y);
            }
        });
        return applyingYakus;
    }
    
    static calculateHan(hand: Hand, yakus?: typeof Yaku[]): number {
        var han = 0;
        if (yakus === undefined) {
            Yaku.initYakuList();
            yakus = Yaku.list;
        }
        yakus.forEach((Y, i, _) => {
            han += Y.calculate(hand);
        });
        return han;
    }
    
    static jasmineToString(): string {
        return this.englishName;
    }
    
    private static initYakuList(): void {
        if (Yaku.list === undefined) {
            Yaku.list = [
                AllSimples,
                AllTriples,
                DeadWallDraw,
                Dora,
                DoubleRiichi,
                DoubleStraight,
                FanpaiDragonTriple,
                FanpaiRoundWind,
                FanpaiSeatWind,
                FullFlush,
                HalfFlush,
                Ippatsu,
                LastDiscard,
                LastFromWall,
                LittleThreeDragons,
                MenzenTsumo,
                Pinfu,
                PureStraight,
                QuadrupleRob,
                Riichi,
                SevenPairs,
                TerminalsAndHonors,
                TerminalsInAllMelds,
                TerminalsOrHonorsInAllMelds,
                ThreeClosedTriples,
                ThreeColorStraights,
                ThreeColorTriples,
                ThreeQuadruples,
                TwoDoubleStraights,
                UraDora
            ];
        }
    }
}

export abstract class AbstractDora extends Yaku {
    static calculateDoraPoints(doraTiles: Tile[], tiles: Tile[]): number {
        var points = 0;
        doraTiles.forEach((doraTile, i, _) => {
            var tileAfterDora = doraTile.nextWithWrapAround();
            tiles.forEach((tile, j, _) => {
                if (tile.equals(tileAfterDora)) {
                    points++;
                }
            });
        });
        
        return points;
    }
}

export abstract class AbstractDoubleStraight extends Yaku {
    /**
     * If there's one there's iipeikou, and if there are two it's ryanpeikou
     */
    protected static countDoubleStraights(melds: Meld[]): number {
        var straights: {[id: string]: number} = {};
        var count = 0;
        melds.forEach((meld, i, _) => {
            if (meld instanceof Straight) {
                var key = meld.toString();
                if (straights[key] === undefined) {
                    straights[key] = 1;
                } else {
                    straights[key]++;
                }
                
                if (straights[key] === 2 || straights[key] === 4) {
                    count++;
                }
            }
        });
        return count;
    }
}

/**
 * Tanyaou Chuu (all simples) yaku pattern
 * A hand consisting only of suit tiles 2-8 (without terminal or honor tiles)
 * 
 * Must be closed : no (some rules say yes)
 * Han : 1
 */
export class AllSimples extends Yaku {
    static japaneseName = "Tanyao Chuu";
    static englishName = "All Simples";
    
    static calculate(hand: Hand): number {
        hand.tiles.forEach((tile, i, _) => {
            if (tile.type === TileType.Honor || tile.isTerminal()) {
                return 0;
            }
        })
        return 1;
    }
}

/*
 * Toi-Toi Hou (all pons) yaku pattern
 * A hand with four pons/kans and one pair.
 * 
 * Must be closed: no
 * Han: 2
 */
export class AllTriples extends Yaku {
    static japaneseName = "Toi-Toi Hou";
    static englishName = "All Triples";

    static calculate(hand: Hand): number {
        var count = 0;
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Triple || meld instanceof Quadruple) {
                count++;
            }
        });
        if (count === 4) {
            return 2;
        } else {
            return 0;
        }
    }
}

/**
 * Rinshan Kaihou (After Quadruple) yaku pattern
 * Winning after drawing a replacement tile.
 *
 * Must be closed: no
 * Han: 1
 */
export class DeadWallDraw extends Yaku {
    static japaneseName = "Rinshan Kaihou";
    static englishName = "Dead Wall Draw";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Tsumo && hand.hasBonus(WinningBonus.DeadWallDraw)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Dora yaku pattern
 * 
 * Must be closed: no
 * Han: 1 / dora
 */
export class Dora extends AbstractDora {
    static japaneseName = "Dora";
    static englishName = "Dora";
    
    static calculate(hand: Hand): number {
        return Dora.calculateDoraPoints(hand.dora, hand.tiles);
    }
}

/**
 * Double Riichi yaku pattern
 * Declaring riichi within the first uninterrupted go around.
 *
 * Must be closed: yes
 * Han: 1
 */
export class DoubleRiichi extends Yaku {
    static japaneseName = "Double Riichi";
    static englishName = "Double Riichi";
    
    static calculate(hand: Hand): number {
        if (hand.hasBonus(WinningBonus.DoubleRiichi)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Iipeikou (pure double chii) yaku pattern
 * Two chiis of the same value and suit
 *
 * Must be closed: yes
 * Han: 1
 */
export class DoubleStraight extends AbstractDoubleStraight {
    static japaneseName = "Iipeikou";
    static englishName = "Pure Double Straight";
    
    static calculate(hand: Hand): number {
        if (!hand.isClosed()) {
            return 0;
        }
        
        if (DoubleStraight.countDoubleStraights(hand.melds) === 1) {
            return 1;
        } else {
            return 0;
        }
    }
}

/**
 * Fanpai/Yakuhai (Dragon Triple) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1 per meld
 */
export class FanpaiDragonTriple extends Yaku {
    static japaneseName = "Fanpai";
    static englishName = "Dragon Triple";
    
    static calculate(hand: Hand): number {
        var count = 0;
        hand.melds.forEach((meld, i, _) => {
            if ((meld instanceof Triple || meld instanceof Quadruple) &&
                meld.suit === Suit.Dragon) {
                count++;
            }
        })
        return count;
    }
}

/**
 * Fanpai/Yakuhai (Round Wind) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1
 */
export class FanpaiRoundWind extends Yaku {
    static japaneseName = "Fanpai";
    static englishName = "Round Wind";
    
    static calculate(hand: Hand): number {
        hand.melds.forEach((meld, i, _) => {
            if ((meld instanceof Triple || meld instanceof Quadruple) &&
                meld.suit === Suit.Wind &&
                meld.tiles[0].value === hand.roundWind) {
                return 1;
            }
        });
        return 0;
    }
}

/**
 * Fanpai/Yakuhai (Seat Wind) yaku pattern
 * A pon or kan in the players wind.
 *
 * Must be closed: no
 * Han: 1
 */
export class FanpaiSeatWind extends Yaku {
    static japaneseName = "Fanpai";
    static englishName = "Seat Wind";
    
    static calculate(hand: Hand): number {
        hand.melds.forEach((meld, i, _) => {
            if ((meld instanceof Triple || meld instanceof Quadruple) &&
                meld.suit === Suit.Wind &&
                meld.tiles[0].value === hand.seatWind) {
                return 1;
            }
        });
        return 0;
    }
}

/**
 * Chinitsu (full flush) yaku pattern
 * A hand with tiles from only one suit
 *
 * Must be closed: no
 * Han: 6 (closed) / 5 (open)
 */
export class FullFlush extends Yaku {
    static japaneseName = "Chinitsu";
    static englishName = "Full Flush";
    
    static calculate(hand: Hand): number {
        var suit: Suit = null;
        hand.melds.forEach((meld, i, _) => {
            var meld = hand.melds[i];
            if (suit === null) {
                suit = meld.suit;
            } else if (meld.suit !== suit) {
                return 0;
            }
        });
        return hand.plusOneIfClosed(5);
    }
}

/**
 * Honitsu (half flush) yaku pattern
 * A hand with tiles from only one suit plus honor tiles
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
export class HalfFlush extends Yaku {
    static japaneseName = "Hon Itsu";
    static englishName = "Half Flush";
    
    static calculate(hand: Hand): number {
        var hasHonorTiles = false;
        var suit: Suit = null;
        hand.melds.forEach((meld, i, _) => {
            if (meld.suit === Suit.Wind || meld.suit === Suit.Dragon) {
                hasHonorTiles = true;
            } else {
                if (suit === null) {
                    suit = meld.suit;
                } else if (meld.suit !== suit) {
                    return 0;
                }
            }
        });
        if (hasHonorTiles) {
            return hand.plusOneIfClosed(2);
        } else {
            return 0;
        }
    }
}

/**
 * Ippatsu (One Shot) yaku pattern
 * Winning within the first uninterrupted go around after declaring riichi .
 *
 * Must be closed: yes
 * Han: 1
 */
export class Ippatsu extends Yaku {
    static japaneseName = "Ippatsu";
    static englishName = "One Shot";
    
    static calculate(hand: Hand): number {
        if (hand.hasBonus(WinningBonus.Ippatsu)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Haitei Raoyue (Last Tile Draw) yaku pattern
 * Winning on the very last tile
 *
 * Must be closed: no
 * Han: 1
 */
export class LastFromWall extends Yaku {
    static japaneseName = "Haitei Raoyue";
    static englishName = "Last From Wall";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Tsumo && hand.hasBonus(WinningBonus.LastFromWall)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Houtei Raoyui (Last Tile Discard) yaku pattern
 * Winning on the very last discard
 *
 * Must be closed: no
 * Han: 1
 */
export class LastDiscard extends Yaku {
    static japaneseName = "Houtei Raoyui";
    static englishName = "Last Discard";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Ron && hand.hasBonus(WinningBonus.LastDiscard)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Shou Sangen (little three dragons) yaku pattern
 * Two pons/kans of dragons plus one pair of dragons.
 *
 * Must be closed: no
 * Han: 2
 */
export class LittleThreeDragons extends Yaku {
    static japaneseName = "Shou Sangen";
    static englishName = "Little Three Dragons";

    static calculate(hand: Hand): number {
        var pairs = 0;
        var triples = 0;
        hand.melds.forEach((meld, i, _) => {
            if (meld.suit === Suit.Dragon) {
                if (meld instanceof Pair) {
                    pairs++;
                } else {
                    triples++;
                }
            }
        });
        if (pairs === 1 && triples === 2) {
            return 2;
        } else {
            return 0;
        }
    }
}

/**
 * Menzen Tsumo (Fully closed Hand) yaku pattern
 * Going out on self-draw with a closed hand.
 *
 * Must be closed: yes
 * Han: 1
 */
export class MenzenTsumo extends Yaku {
    static japaneseName = "Menzen Tsumo";
    static englishName = "Fully closed Hand";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Tsumo && hand.isClosed()) {
            return 1;
        }
        return 0;
    }
}

/**
 * Pinfu (All chii / No points) yaku pattern
 * A hand with no fu except the one for winning
 * Just chii, no pair point (dragon or seat/prevalent wind) and a two-sided wait (only wait that give no fu)
 *
 * Must be closed: yes
 * Han: 1
 */
export class Pinfu extends Yaku {
    static japaneseName = "Pinfu";
    static englishName = "All Chii / No points";
    
    static calculate(hand: Hand): number {
        if (!hand.isClosed()    ||
            hand.isEdgeWait()   ||
            hand.isClosedWait() ||
            hand.isSingleWait()) {
            return 0;
        }
        
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Pair) {
                if (meld.suit === Suit.Dragon) return 0;
                if (meld.suit === Suit.Wind) {
                    if (meld.tiles[0].value === hand.seatWind) return 0;
                    if (meld.tiles[0].value === hand.roundWind) return 0;
                }
            }
            if (meld instanceof Triple || meld instanceof Quadruple) return 0;
        });
        
        return 1;
    }
}

/**
 * Itsu or Ikkitsuukan (pure straight) yaku pattern
 * Three consecutive chiis (1-9) in the same suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class PureStraight extends Yaku {
    static japaneseName = "Ikkitsuukan";
    static englishName = "Pure Straight";
    
    static calculate(hand: Hand): number {
        var suits = [Suit.Character, Suit.Circle, Suit.Bamboo];
        var straights: {[id: number]: boolean[]} = {};
        
        suits.forEach((suit, i, _) => {
            straights[suit] = [false, false, false];
        });
        
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Straight) {
                if (meld.tiles[0].value === 1) {
                    straights[meld.suit][0] = true;
                } else if (meld.tiles[0].value === 4) {
                    straights[meld.suit][1] = true;
                } else if (meld.tiles[1].value === 7) {
                    straights[meld.suit][2] = true;
                }
            }
        });
        
        suits.forEach((suit, i, _) => {
            if (straights[suit][0] && straights[suit][1] && straights[suit][2]) {
                return hand.plusOneIfClosed(1);
            }
        });
        return 0;
    }
}

/**
 * Chan kan (Robbing the kan) yaku pattern
 * Winning on off a tile used to extend a kong.
 *
 * Must be closed: no
 * Han: 1
 */
export class QuadrupleRob extends Yaku {
    static japaneseName = "Chan Kan";
    static englishName = "Robbing the Quadruple";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Ron && hand.hasBonus(WinningBonus.QuadrupleRob)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Riichi yaku pattern
 * Waiting hand with declaration and 1000 point buy in. 
 *
 * Must be closed: yes
 * Han: 1
 */
export class Riichi extends Yaku {
    static japaneseName = "Riichi";
    static englishName = "Riichi";
    
    static calculate(hand: Hand): number {
        if (hand.hasBonus(WinningBonus.Riichi) ||
            hand.hasBonus(WinningBonus.DoubleRiichi)) {
            return 1;
        }
        return 0;
    }
}

/**
 * Chii Toitsu (seven pairs) yaku pattern
 * A hand consisting of seven pairs
 *
 * Must be closed: yes
 * Han: 2
 */
export class SevenPairs extends Yaku {
    static japaneseName = "Chii Toitsu";
    static englishName = "Seven Pairs";

    static calculate(hand: Hand): number {
        var pairs: string[] = [];
        
        if (hand.closedMelds.length !== 7) {
            return 0;
        }
        hand.closedMelds.forEach((meld, i, _) => {
            if (!(meld instanceof Pair) ||
                pairs.indexOf(meld.toString()) !== -1) {
                return 0;
            }
            pairs.push(meld.toString());
        });
        return 2;
    }
}

/**
 * Honroutou (all terminals & honors) yaku pattern
 * A hand consisting of only terminals and honors
 *
 * Must be closed: no
 * Han: 2
 */
export class TerminalsAndHonors extends Yaku {
    static japaneseName = "Honroutou";
    static englishName = "All terminals & honors";
    
    static calculate(hand: Hand): number {
        hand.tiles.forEach((tile, i, _) => {
            if (!(tile.type === TileType.Honor || tile.isTerminal())) {
                return 0;
            }
        })
        return 2;
    }
}

/**
 * Junchan Taiyaochuu or Junchan (terminals in all melds) yaku pattern
 * A hand where all melds contain terminals
 * 
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
export class TerminalsInAllMelds extends Yaku {
    static japaneseName = "Junchan Taiyaochuu";
    static englishName = "Terminals in all melds";
    
    static calculate(hand: Hand): number {
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Straight) {
                if (!meld.tiles[0].isTerminal() &&
                    !meld.tiles[2].isTerminal()) {
                    return 0;
                }
            } else {
                if (!meld.tiles[0].isTerminal()) {
                    return 0;
                }
            }
        });
        return hand.plusOneIfClosed(2);
    }
}

/**
 * Chanta (outside hand) yaku pattern
 * A hand where at least one meld contains honor tiles, and the rest contain a terminal.
 * 
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class TerminalsOrHonorsInAllMelds extends Yaku {
    static japaneseName = "Chanta";
    static englishName = "Terminals or honors in all sets";

    static calculate(hand: Hand): number {
        var hasHonorTiles = false;
        var hasTerminals = false;
        hand.melds.forEach((meld, i, _) => {
            if (meld.suit === Suit.Wind || meld.suit === Suit.Dragon) {
                hasHonorTiles = true;
            } else {
                if (meld.tiles[0].isTerminal() ||
                    (meld instanceof Straight && meld.tiles[2].isTerminal())) {
                    hasTerminals = true;
                } else {
                    return 0;
                }
            }
        });
        if (hasHonorTiles && hasTerminals) {
            return hand.plusOneIfClosed(1);
        } else {
            return 0;
        }
    }
}

/**
 * San Ankou (3 closed pons) yaku pattern
 * A hand with three closed pons or kans.
 *
 * Must be closed: no
 * Han: 2
 */
export class ThreeClosedTriples extends Yaku {
    static japaneseName = "San Ankou";
    static englishName = "Three Closed Triples";
    
    static calculate(hand: Hand): number {
        var count = 0;
        
        hand.closedMelds.forEach((meld, i, _) => {
            if (meld instanceof Triple || meld instanceof Quadruple) {
                count++;
            }
        });
        if (count >= 3) {
            return 2;
        }
        return 0;
    }
}

/**
 * San Shoku Doujun (mixed triple chii) yaku pattern
 * Three chiis of the same value, with one in each suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class ThreeColorStraights extends Yaku {
    static japaneseName = "San Shoku Doujun";
    static englishName = "Three Color Straights";
    
    static calculate(hand: Hand): number {
        var straightsList: boolean[][] = [];
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Straight) {
                var tile = meld.tiles[0];
                
                if (straightsList[tile.value] === undefined) {
                    straightsList[tile.value] = [];
                }
                
                var straights = straightsList[tile.value];
                straights[tile.suit] = true;
                
                if (straights[Suit.Character] && straights[Suit.Circle] && straights[Suit.Bamboo]) {
                    return hand.plusOneIfClosed(1);
                }
            } 
        });
        return 0;
    }
}

/**
 * San Shoku Dokou (triple pon) yaku pattern
 * One pon or kan in each of the three suits, all having the same number.
 *
 * Must be closed: no
 * Han: 2
 */
export class ThreeColorTriples extends Yaku {
    static japaneseName = "San Shoku Dokou";
    static englishName = "Three Color Triples";

    static calculate(hand: Hand): number {
        var tripleCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        hand.melds.forEach((meld, i, _) => {
            if ((meld instanceof Triple || meld instanceof Quadruple) &&
                meld.tiles[0].type === TileType.Number) {
                tripleCounts[meld.tiles[0].value]++;
            }
        });
        if (Math.max(...tripleCounts) === 3) {
            return 2;
        } else {
            return 0;
        }
    }
}

/**
 * San Kan Tsu (3 kans) yaku pattern
 * A hand with three kans.
 *
 * Must be closed: no
 * Han: 2
 */
export class ThreeQuadruples extends Yaku {
    static japaneseName = "San Kan Tsu";
    static englishName = "3 kans";
    
    static calculate(hand: Hand): number {
        var quadruples = 0;
        
        hand.melds.forEach((meld, i, _) => {
            if (meld instanceof Quadruple) {
                quadruples++;
            }
        });
        
        if (quadruples >= 3) {
            return 2;
        }
        return 0;
    }
}

/**
 * Ryanpeikou (twice pure double chiis) yaku pattern
 * Two pair of chiis, where each pair consists of two identical chiis.
 *
 * Must be closed: yes
 * Han: 3
 *
 */
export class TwoDoubleStraights extends AbstractDoubleStraight {
    static japaneseName = "Ryanpeikou";
    static englishName = "TwoDoubleStraights";
    
    static calculate(hand: Hand): number {
        if (!hand.isClosed()) {
            return 0;
        }
        
        if (TwoDoubleStraights.countDoubleStraights(hand.melds) === 2) {
            return 3;
        } else {
            return 0;
        }
    }
}

/**
 * Ura-Dora yaku pattern
 * 
 * Must be closed: no
 * Han: 1 / ura-dora
 */
export class UraDora extends AbstractDora {
    static japaneseName = "Ura-Dora";
    static englishName = "Ura-Dora";
    
    static calculate(hand: Hand): number {
        if (!hand.hasBonus(WinningBonus.Riichi) &&
            !hand.hasBonus(WinningBonus.DoubleRiichi)) {
            return 0;
        }
        return UraDora.calculateDoraPoints(hand.uraDora, hand.tiles);
    }
}
