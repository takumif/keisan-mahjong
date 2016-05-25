import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"
import {Hand, WinningBonus, WinningMethod} from "./hand"

export abstract class Yaku {
    static japaneseName = "Japanese name not set";
    static englishName = "English name not set";
    
    /**
     * Calculates how many points the hand can receive from the yaku.
     * 0 if the yaku doesn't apply to the hand.
     */
    static calculate(hand: Hand): number {
        throw "Yaku.calculate(hand) needs to be overwritten";
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
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === TileType.Honor || tile.isTerminal()) {
                    return 0;
                }
            }
        }
        return 1;
    };
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
        var nbHonorTile = 0;
        var suit: Suit = null;
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === TileType.Honor) {
                    nbHonorTile++;
                } else {
                    if (suit == null) {
                        suit = tile.suit;
                    } else if (suit != tile.suit) {
                        return 0;
                    }
                }
            }
        }
        if (nbHonorTile > 0) {
            if (!hand.isClosed()) {
                return 2;
            } else {
                return 3;
            }
        } else {
            return 0;
        }
    }
}

/**
 * Chinitsu (full flush) yaku pattern
 * A hand with tiles from only one suit
 *
 * Must be closed: no
 * Han: 6 (closed) / 5 (open)
 */
export class Chinitsu extends Yaku {
    static japaneseName = "Chinitsu";
    static englishName = "Full Flush";
    
    static calculate(hand: Hand): number {
        var suit: Suit = null;
        for (var i = 0; i < hand.melds.length; i ++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === TileType.Honor) return 0;
                if (suit === null) {
                    suit = tile.suit;
                } else if (suit !== tile.suit) {
                    return 0;
                }
            }
        }
        if (hand.isClosed()) {
            return 6;
        } else {
            return 5;
        }
    };
}

/**
 * Honroutou (all terminals & honors) yaku pattern
 * A hand consisting of only terminals and honors
 *
 * Must be closed: no
 * Han: 2
 */
export class Honroutou extends Yaku {
    static japaneseName = "Honroutou";
    static englishName = "All terminals & honors";
    
    static calculate(hand: Hand): number {
        for (var i = 0; i < hand.melds.length; i ++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (! (tile.type === TileType.Honor || tile.isTerminal())) return 0; 
            }
        }
        return 2;
    };
}

/**
 * Iipeikou (pure double chii) yaku pattern
 * Two chiis of the same value and suit
 *
 * Must be closed: yes
 * Han: 1
 */
export class Iipeikou extends Yaku {
    static japaneseName = "Iipeikou";
    static englishName = "Pure Double Chii";
    
    static calculate(hand: Hand): number {
        if (!hand.isClosed()) return 0;
        
        var storedChiis: Straight[] = [];
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) {
                for (var j = 0; j < storedChiis.length; j++) {
                    if (storedChiis[j].tiles[0].suit == meld.tiles[0].suit &&
                        storedChiis[j].tiles[0].value == meld.tiles[0].value) {
                            return 1;
                    }
                }
                storedChiis.push(meld);
            }
        }
        return 0;
    };
}

/**
 * San Shoku Doujun (mixed triple chii) yaku pattern
 * Three chiis of the same value, with one in each suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class SanShokuDoujun extends Yaku {
    static japaneseName = "San Shoku Doujun";
    static englishName = "Mixed Triple Chii";
    
    static calculate(hand: Hand): number {
        /*
        var storedChiis: {[id: number]: {[id: number]: number}} = {};
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) {
                var tile = meld.tiles[0];
                
                if (storedChiis[tile.value] == undefined) {
                    storedChiis[tile.value] = { dot: 0, bamboo: 0, character: 0 };
                }
                
                var chii = storedChiis[tile.value];
                
                chii[tile.suit]++;
                
                if (chii.dot && chii.bamboo && chii.character) {
                    if (!hand.isClosed()) {
                        return 1;
                    } else {
                        return 2;
                    }
                }
            }
        }
        */
        return 0;
    };
}

/**
 * Itsu or Ikkitsuukan (pure straight) yaku pattern
 * Three consecutive chiis (1-9) in the same suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class Itsu extends Yaku {
    static japaneseName = "Itsu"; // can be call Ikkitsuukan
    static englishName = "Pure Straight";
    
    static calculate(hand: Hand): number {
        var storedChiis: {[id: number]: {[id: number]: number}} = {};
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) {
                var tile = meld.tiles[0];
                
                if (storedChiis[tile.suit] == undefined) {
                    storedChiis[tile.suit] = {1: 0, 4: 0, 7: 0};
                }
                
                var chii = storedChiis[tile.suit];
                
                chii[tile.value]++;
                
                if (chii[1] && chii[4] && chii[7]) {
                    if (!hand.isClosed()) {
                        return 1;
                    } else {
                        return 2;
                    }
                }
            }
        }
        return 0;
    };
}

/**
 * Chanta (outside hand) yaku pattern
 * A hand where all sets contain a terminal or honor tile, and at least one of the sets is a chii.
 * 
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
export class Chanta extends Yaku {
    static japaneseName = "Chanta";
    static englishName = "Outside Hand";

    static calculate(hand: Hand): number {
        var nbChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) nbChii++;

            var nbTerminalOrHonor = 0;
            for (var j = 0; j < meld.tiles.length; j++) {
                var tile = meld.tiles[j];
                if (tile.type === TileType.Honor || tile.isTerminal()) nbTerminalOrHonor++;
            }
            if (nbTerminalOrHonor == 0) return 0;
        }
        if (nbChii > 0) {
            if (hand.isClosed()) {
                return 2;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    }
}

/**
 * Chii Toitsu (seven pairs) yaku pattern
 * A hand consisting of seven pairs
 *
 * Must be closed: yes
 * Han: 2
 */
export class ChiiToitsu extends Yaku {
    static japaneseName = "Chii Toitsu";
    static englishName = "Seven Pairs";

    static calculate(hand: Hand): number {
        var nbPair = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Pair) nbPair++;
        }
        if (nbPair === 7) {
            return 2;
        } else {
            return 0;
        }
    }
}

/**
 * San Shoku Dokou (triple pon) yaku pattern
 * One pon or kan in each of the three suits, all having the same number.
 *
 * Must be closed: no
 * Han: 2
 */
export class SanShokuDokou extends Yaku {
    static japaneseName = "San Shoku Dokou";
    static englishName = "Triple Triple";

    static calculate(hand: Hand): number {
        var storedTriples: {[id: number]: number} = {};
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) {
                var tile = meld.tiles[0];
                if (tile.type === TileType.Number) {
                    if (storedTriples[tile.value] == undefined) storedTriples[tile.value] = 0;
                    storedTriples[tile.value]++;
                    if (storedTriples[tile.value] == 3) return 2;
                }
            }
        }
        return 0;
    }
}

/*
 * Toi-Toi Hou (all pons) yaku pattern
 * A hand with four pons/kans and one pair.
 * 
 * Must be closed: no
 * Han: 2
 */
export class ToiToiHou extends Yaku {
    static japaneseName = "Toi-Toi Hou";
    static englishName = "All Triple";

    static calculate(hand: Hand): number {
        var nbTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) nbTriple++;
        }
        if (nbTriple >= 4) {
            return 2;
        } else {
            return 0;
        }
    };
}

/**
 * Shou Sangen (little three dragons) yaku pattern
 * Two pons/kans of dragons plus one pair of dragons.
 *
 * Must be closed: no
 * Han: 2
 */
export class ShouSangen extends Yaku {
    static japaneseName = "Shou Sangen";
    static englishName = "Little Three Dragons";

    static calculate(hand: Hand): number {
        var nbDragonPair = 0;
        var nbDragonTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Pair) {
                if (meld.tiles[0].suit === Suit.Dragon) nbDragonPair++;
            } else if (meld instanceof Triple || meld instanceof Quadruple) {
                if (meld.tiles[0].suit === Suit.Dragon) nbDragonTriple++;
            }
        }
        if (nbDragonPair >= 1 && nbDragonTriple >=2) {
            return 2;
        } else {
            return 0;
        }
    };
}

/**
 * Ryan Peikou (twice pure double chiis) yaku pattern
 * Two pair of chiis, where each pair consists of two identical chiis.
 *
 * Must be closed: no (some rules say yes)
 * Han: 3
 *
 */
export class RyanPeikou extends Yaku {
    static japaneseName = "Ryan Peikou";
    static englishName = "Twice Pure Double Chii";
    
    static calculate(hand: Hand): number {
        var chiis: {[id: number]: number} = {};
        var nbPairOfChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) {
                var chiiKey = meld.tiles[0].suit + meld.tiles[0].value;
                if (chiis[chiiKey] == undefined) chiis[chiiKey] = 0; else nbPairOfChii++;
            }
        }        
        
        if (nbPairOfChii == 2) {
            if (hand.isClosed()) {
                return 3;
            } else {
                return 2;
            }
        }
        
        return 0;
    };
}

/**
 * Junchan Taiyai or Junchan Tayao or Junchan (terminals in all sets) yaku pattern
 * A hand with at least one chii and where all sets and the pair contains terminals
 * 
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
export class JunchanTaiyai extends Yaku {
    static japaneseName = "Junchan Taiyai"; // can also be call Junchan Tayao or Junchan
    static englishName = "Terminals in all sets";
    
    static calculate(hand: Hand): number {
        var nbChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Straight) nbChii++;
            var nbTerminal = 0;
            for (var j = 0; j < meld.tiles.length; j++) {
                var tile = meld.tiles[j];
                if (tile.type === TileType.Number && tile.isTerminal()) nbTerminal++;
            }
            if (nbTerminal == 0) return 0;
        }
        if (nbChii > 0) {
            return 3;
        } else {
            return 0;
        }
    };
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
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) {
                var tile = meld.tiles[0];
                if (tile.suit === Suit.Wind && tile.value == hand.seatWind) return 1;
            }
        }
        return 0;
    };
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
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) {
                var tile = meld.tiles[0];
                if (tile.suit === Suit.Wind && tile.value == hand.roundWind) return 1;
            }
        }
        return 0;
    };
}

/**
 * Fanpai/Yakuhai (Dragon Triple) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1
 */
export class FanpaiDragonTriple extends Yaku {
    static japaneseName = "Fanpai";
    static englishName = "Dragon Triple";
    
    static calculate(hand: Hand): number {
        var nbDragonTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) {
                if (meld.tiles[0].suit === Suit.Dragon) nbDragonTriple++;
            }
        }
        return nbDragonTriple;
    };
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
        if (!hand.isClosed()) return 0;
        if (hand.isEdgeWait()) return 0;
        if (hand.isClosedWait()) return 0;
        if (hand.isSingleWait()) return 0;
        
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            
            if (meld instanceof Pair) {
                if (meld.tiles[0].suit === Suit.Dragon) return 0;
                if (meld.tiles[0].suit === Suit.Wind) {
                    if (meld.tiles[0].value === hand.seatWind) return 0;
                    if (meld.tiles[0].value === hand.roundWind) return 0;
                }
            }
            
            if (meld instanceof Triple || meld instanceof Quadruple) return 0;
        }
        
        return 1;
    };
}

/**
 * San Ankou (3 closed pons) yaku pattern
 * A hand with three closed pons or kans.
 *
 * Must be closed: no
 * Han: 2
 */
export class SanAnkou extends Yaku {
    static japaneseName = "San Ankou";
    static englishName = "3 closed pons";
    
    static calculate(hand: Hand): number {
        var nbclosedTriple = 0;
        
        for (var i = 0; i < hand.closedMelds.length; i++) {
            var meld = hand.closedMelds[i];
            if (meld instanceof Triple || meld instanceof Quadruple) {
                nbclosedTriple++;
            }
        }
        
        if (nbclosedTriple >= 3) {
            return 2;
        }
        return 0;
    };
}

/**
 * San Quadruple Tsu (3 kans) yaku pattern
 * A hand with three kans.
 *
 * Must be closed: no
 * Han: 2
 */
export class SanQuadrupleTsu extends Yaku {
    static japaneseName = "San Quadruple Tsu";
    static englishName = "3 kans";
    
    static calculate(hand: Hand): number {
        var nbQuadruple = 0;
        
        for (var i = 0; i < hand.melds.length; i++) {
            if (hand.melds[i] instanceof Quadruple) {
                nbQuadruple++;
            }
        }
        
        if (nbQuadruple >= 3) {
            return 2;
        }
        return 0;
    };
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
    };
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
    };
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
    };
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
    };
}

/**
 * Haitei Raoyue (Last Tile Draw) yaku pattern
 * Winning on the very last tile
 *
 * Must be closed: no
 * Han: 1
 */
export class HaiteiRaoyue extends Yaku {
    static japaneseName = "Haitei Raoyue";
    static englishName = "Last Tile Draw";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Tsumo && hand.hasBonus(WinningBonus.LastFromWall)) {
            return 1;
        }
        return 0;
    };
}

/**
 * Houtei Raoyui (Last Tile Discard) yaku pattern
 * Winning on the very last discard
 *
 * Must be closed: no
 * Han: 1
 */
export class HouteiRaoyui extends Yaku {
    static japaneseName = "Houtei Raoyui";
    static englishName = "Last Tile Discard";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Ron && hand.hasBonus(WinningBonus.LastDiscard)) {
            return 1;
        }
        return 0;
    };
}

/**
 * Rinshan Kaihou (After Quadruple) yaku pattern
 * Winning after drawing a replacement tile.
 *
 * Must be closed: no
 * Han: 1
 */
export class RinshanKaihou extends Yaku {
    static japaneseName = "Rinshan Kaihou";
    static englishName = "After kan";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Tsumo && hand.hasBonus(WinningBonus.DeadWallDraw)) {
            return 1;
        }
        return 0;
    };
}

/**
 * Chan kan (Robbing the kan) yaku pattern
 * Winning on off a tile used to extend a kong.
 *
 * Must be closed: no
 * Han: 1
 */
export class ChanQuadruple extends Yaku {
    static japaneseName = "Chan Quadruple";
    static englishName = "Robbing the kan";
    
    static calculate(hand: Hand): number {
        if (hand.winMethod === WinningMethod.Ron && hand.hasBonus(WinningBonus.QuadrupleRob)) {
            return 1;
        }
        return 0;
    };
}

/**
 * Dora yaku pattern
 * 
 * Must be closed: no
 * Han: 1 / dora
 */
export class Dora extends Yaku {
    static japaneseName = "Dora";
    static englishName = "Dora";
    
    static calculate(hand: Hand): number {
        var points = 0;
        
        for (var i = 0; i < hand.dora.length; i++) {
            var doraTile = hand.dora[i];
            var tileAfterDora = doraTile.nextWithWrapAround();
            
            for (var j = 0; j < hand.melds.length; j++) {
                for (var k = 0; k < hand.melds[j].tiles.length; k++) {
                    var tile = hand.melds[j].tiles[k];
                    if (tile.equals(tileAfterDora)) {
                        points++;
                    }
                }
            }
        }
        
        return points;
    };
}

/**
 * Ura-Dora yaku pattern
 * 
 * Must be closed: no
 * Han: 1 / ura-dora
 */
export class UraDora extends Yaku {
    static japaneseName = "Ura-Dora";
    static englishName = "Ura-Dora";
    
    static calculate(hand: Hand): number {
        if (!hand.hasBonus(WinningBonus.Riichi) &&
            !hand.hasBonus(WinningBonus.DoubleRiichi)) {
            return 0;
        }
    
        var points = 0;
        
        for (var i = 0; i < hand.uraDora.length; i++) {
            var doraTile = hand.uraDora[i];
            var tileAfterDora = doraTile.nextWithWrapAround();
            
            for (var j = 0; j < hand.melds.length; j++) {
                for (var k = 0; k < hand.melds[j].tiles.length; k++) {
                    var tile = hand.melds[j].tiles[k];
                    if (tile.equals(tileAfterDora)) {
                        points++;
                    }
                }
            }
        }
        
        return points;
    };
}
