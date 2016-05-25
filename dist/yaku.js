"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var tile_1 = require("./tile");
var meld_1 = require("./meld");
var hand_1 = require("./hand");
var Yaku = (function () {
    function Yaku() {
    }
    /**
     * Calculates how many points the hand can receive from the yaku.
     * 0 if the yaku doesn't apply to the hand.
     */
    Yaku.calculate = function (hand) {
        throw "Yaku.calculate(hand) needs to be overwritten";
    };
    Yaku.japaneseName = "Japanese name not set";
    Yaku.englishName = "English name not set";
    return Yaku;
}());
exports.Yaku = Yaku;
var AbstractDora = (function (_super) {
    __extends(AbstractDora, _super);
    function AbstractDora() {
        _super.apply(this, arguments);
    }
    AbstractDora.calculateDoraPoints = function (doraTiles, tiles) {
        var points = 0;
        doraTiles.forEach(function (doraTile, i, _) {
            var tileAfterDora = doraTile.nextWithWrapAround();
            tiles.forEach(function (tile, j, _) {
                if (tile.equals(tileAfterDora)) {
                    points++;
                }
            });
        });
        return points;
    };
    return AbstractDora;
}(Yaku));
exports.AbstractDora = AbstractDora;
var AbstractDoubleStraight = (function (_super) {
    __extends(AbstractDoubleStraight, _super);
    function AbstractDoubleStraight() {
        _super.apply(this, arguments);
    }
    /**
     * If there's one there's iipeikou, and if there are two it's ryanpeikou
     */
    AbstractDoubleStraight.countDoubleStraights = function (melds) {
        var straights = {};
        var count = 0;
        melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Straight) {
                var key = meld.toString();
                if (straights[key] === undefined) {
                    straights[key] = 1;
                }
                else {
                    straights[key]++;
                }
                if (straights[key] === 2 || straights[key] === 4) {
                    count++;
                }
            }
        });
        return count;
    };
    return AbstractDoubleStraight;
}(Yaku));
exports.AbstractDoubleStraight = AbstractDoubleStraight;
/**
 * Tanyaou Chuu (all simples) yaku pattern
 * A hand consisting only of suit tiles 2-8 (without terminal or honor tiles)
 *
 * Must be closed : no (some rules say yes)
 * Han : 1
 */
var AllSimples = (function (_super) {
    __extends(AllSimples, _super);
    function AllSimples() {
        _super.apply(this, arguments);
    }
    AllSimples.calculate = function (hand) {
        hand.tiles.forEach(function (tile, i, _) {
            if (tile.type === tile_1.TileType.Honor || tile.isTerminal()) {
                return 0;
            }
        });
        return 1;
    };
    AllSimples.japaneseName = "Tanyao Chuu";
    AllSimples.englishName = "All Simples";
    return AllSimples;
}(Yaku));
exports.AllSimples = AllSimples;
/**
 * Honitsu (half flush) yaku pattern
 * A hand with tiles from only one suit plus honor tiles
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
var HalfFlush = (function (_super) {
    __extends(HalfFlush, _super);
    function HalfFlush() {
        _super.apply(this, arguments);
    }
    HalfFlush.calculate = function (hand) {
        var hasHonorTiles = false;
        var suit = null;
        hand.melds.forEach(function (meld, i, _) {
            if (meld.suit === tile_1.Suit.Wind || meld.suit === tile_1.Suit.Dragon) {
                hasHonorTiles = true;
            }
            else {
                if (suit === null) {
                    suit = meld.suit;
                }
                else if (meld.suit !== suit) {
                    return 0;
                }
            }
        });
        if (hasHonorTiles) {
            return hand.plusOneIfClosed(2);
        }
        else {
            return 0;
        }
    };
    HalfFlush.japaneseName = "Hon Itsu";
    HalfFlush.englishName = "Half Flush";
    return HalfFlush;
}(Yaku));
exports.HalfFlush = HalfFlush;
/**
 * Chinitsu (full flush) yaku pattern
 * A hand with tiles from only one suit
 *
 * Must be closed: no
 * Han: 6 (closed) / 5 (open)
 */
var FullFlush = (function (_super) {
    __extends(FullFlush, _super);
    function FullFlush() {
        _super.apply(this, arguments);
    }
    FullFlush.calculate = function (hand) {
        var suit = null;
        hand.melds.forEach(function (meld, i, _) {
            var meld = hand.melds[i];
            if (suit === null) {
                suit = meld.suit;
            }
            else if (meld.suit !== suit) {
                return 0;
            }
        });
        return hand.plusOneIfClosed(5);
    };
    FullFlush.japaneseName = "Chinitsu";
    FullFlush.englishName = "Full Flush";
    return FullFlush;
}(Yaku));
exports.FullFlush = FullFlush;
/**
 * Honroutou (all terminals & honors) yaku pattern
 * A hand consisting of only terminals and honors
 *
 * Must be closed: no
 * Han: 2
 */
var TerminalsAndHonors = (function (_super) {
    __extends(TerminalsAndHonors, _super);
    function TerminalsAndHonors() {
        _super.apply(this, arguments);
    }
    TerminalsAndHonors.calculate = function (hand) {
        hand.tiles.forEach(function (tile, i, _) {
            if (!(tile.type === tile_1.TileType.Honor || tile.isTerminal())) {
                return 0;
            }
        });
        return 2;
    };
    TerminalsAndHonors.japaneseName = "Honroutou";
    TerminalsAndHonors.englishName = "All terminals & honors";
    return TerminalsAndHonors;
}(Yaku));
exports.TerminalsAndHonors = TerminalsAndHonors;
/**
 * Iipeikou (pure double chii) yaku pattern
 * Two chiis of the same value and suit
 *
 * Must be closed: yes
 * Han: 1
 */
var DoubleStraight = (function (_super) {
    __extends(DoubleStraight, _super);
    function DoubleStraight() {
        _super.apply(this, arguments);
    }
    DoubleStraight.calculate = function (hand) {
        if (!hand.isClosed()) {
            return 0;
        }
        if (DoubleStraight.countDoubleStraights(hand.melds) === 1) {
            return 1;
        }
        else {
            return 0;
        }
    };
    DoubleStraight.japaneseName = "Iipeikou";
    DoubleStraight.englishName = "Pure Double Straight";
    return DoubleStraight;
}(AbstractDoubleStraight));
exports.DoubleStraight = DoubleStraight;
/**
 * San Shoku Doujun (mixed triple chii) yaku pattern
 * Three chiis of the same value, with one in each suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
var SanShokuDoujun = (function (_super) {
    __extends(SanShokuDoujun, _super);
    function SanShokuDoujun() {
        _super.apply(this, arguments);
    }
    SanShokuDoujun.calculate = function (hand) {
        var straightsList = [];
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Straight) {
                var tile = meld.tiles[0];
                if (straightsList[tile.value] === undefined) {
                    straightsList[tile.value] = [];
                }
                var straights = straightsList[tile.value];
                straights[tile.suit] = true;
                if (straights[tile_1.Suit.Character] && straights[tile_1.Suit.Circle] && straights[tile_1.Suit.Bamboo]) {
                    return hand.plusOneIfClosed(1);
                }
            }
        });
        return 0;
    };
    SanShokuDoujun.japaneseName = "San Shoku Doujun";
    SanShokuDoujun.englishName = "Mixed Triple Chii";
    return SanShokuDoujun;
}(Yaku));
exports.SanShokuDoujun = SanShokuDoujun;
/**
 * Itsu or Ikkitsuukan (pure straight) yaku pattern
 * Three consecutive chiis (1-9) in the same suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
var PureStraight = (function (_super) {
    __extends(PureStraight, _super);
    function PureStraight() {
        _super.apply(this, arguments);
    }
    PureStraight.calculate = function (hand) {
        var suits = [tile_1.Suit.Character, tile_1.Suit.Circle, tile_1.Suit.Bamboo];
        var straights = {};
        suits.forEach(function (suit, i, _) {
            straights[suit] = [false, false, false];
        });
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Straight) {
                if (meld.tiles[0].value === 1) {
                    straights[meld.suit][0] = true;
                }
                else if (meld.tiles[0].value === 4) {
                    straights[meld.suit][1] = true;
                }
                else if (meld.tiles[1].value === 7) {
                    straights[meld.suit][2] = true;
                }
            }
        });
        suits.forEach(function (suit, i, _) {
            if (straights[suit][0] && straights[suit][1] && straights[suit][2]) {
                return hand.plusOneIfClosed(1);
            }
        });
        return 0;
    };
    PureStraight.japaneseName = "Ikkitsuukan";
    PureStraight.englishName = "Pure Straight";
    return PureStraight;
}(Yaku));
exports.PureStraight = PureStraight;
/**
 * Chanta (outside hand) yaku pattern
 * A hand where at least one meld contains honor tiles, and the rest contain a terminal.
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
var TerminalsOrHonorsInAllMelds = (function (_super) {
    __extends(TerminalsOrHonorsInAllMelds, _super);
    function TerminalsOrHonorsInAllMelds() {
        _super.apply(this, arguments);
    }
    TerminalsOrHonorsInAllMelds.calculate = function (hand) {
        var hasHonorTiles = false;
        var hasTerminals = false;
        hand.melds.forEach(function (meld, i, _) {
            if (meld.suit === tile_1.Suit.Wind || meld.suit === tile_1.Suit.Dragon) {
                hasHonorTiles = true;
            }
            else {
                if (meld.tiles[0].isTerminal() ||
                    (meld instanceof meld_1.Straight && meld.tiles[2].isTerminal())) {
                    hasTerminals = true;
                }
                else {
                    return 0;
                }
            }
        });
        if (hasHonorTiles && hasTerminals) {
            return hand.plusOneIfClosed(1);
        }
        else {
            return 0;
        }
    };
    TerminalsOrHonorsInAllMelds.japaneseName = "Chanta";
    TerminalsOrHonorsInAllMelds.englishName = "Terminals or honors in all sets";
    return TerminalsOrHonorsInAllMelds;
}(Yaku));
exports.TerminalsOrHonorsInAllMelds = TerminalsOrHonorsInAllMelds;
/**
 * Chii Toitsu (seven pairs) yaku pattern
 * A hand consisting of seven pairs
 *
 * Must be closed: yes
 * Han: 2
 */
var SevenPairs = (function (_super) {
    __extends(SevenPairs, _super);
    function SevenPairs() {
        _super.apply(this, arguments);
    }
    SevenPairs.calculate = function (hand) {
        var pairs = [];
        if (hand.closedMelds.length !== 7) {
            return 0;
        }
        hand.closedMelds.forEach(function (meld, i, _) {
            if (!(meld instanceof meld_1.Pair) ||
                pairs.indexOf(meld.toString()) !== -1) {
                return 0;
            }
            pairs.push(meld.toString());
        });
        return 2;
    };
    SevenPairs.japaneseName = "Chii Toitsu";
    SevenPairs.englishName = "Seven Pairs";
    return SevenPairs;
}(Yaku));
exports.SevenPairs = SevenPairs;
/**
 * San Shoku Dokou (triple pon) yaku pattern
 * One pon or kan in each of the three suits, all having the same number.
 *
 * Must be closed: no
 * Han: 2
 */
var ThreeColorTriples = (function (_super) {
    __extends(ThreeColorTriples, _super);
    function ThreeColorTriples() {
        _super.apply(this, arguments);
    }
    ThreeColorTriples.calculate = function (hand) {
        var tripleCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        hand.melds.forEach(function (meld, i, _) {
            if ((meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) &&
                meld.tiles[0].type === tile_1.TileType.Number) {
                tripleCounts[meld.tiles[0].value]++;
            }
        });
        if (Math.max.apply(Math, tripleCounts) === 3) {
            return 2;
        }
        else {
            return 0;
        }
    };
    ThreeColorTriples.japaneseName = "San Shoku Dokou";
    ThreeColorTriples.englishName = "Three Color Triples";
    return ThreeColorTriples;
}(Yaku));
exports.ThreeColorTriples = ThreeColorTriples;
/*
 * Toi-Toi Hou (all pons) yaku pattern
 * A hand with four pons/kans and one pair.
 *
 * Must be closed: no
 * Han: 2
 */
var AllTriples = (function (_super) {
    __extends(AllTriples, _super);
    function AllTriples() {
        _super.apply(this, arguments);
    }
    AllTriples.calculate = function (hand) {
        var count = 0;
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                count++;
            }
        });
        if (count === 4) {
            return 2;
        }
        else {
            return 0;
        }
    };
    AllTriples.japaneseName = "Toi-Toi Hou";
    AllTriples.englishName = "All Triples";
    return AllTriples;
}(Yaku));
exports.AllTriples = AllTriples;
/**
 * Shou Sangen (little three dragons) yaku pattern
 * Two pons/kans of dragons plus one pair of dragons.
 *
 * Must be closed: no
 * Han: 2
 */
var LittleThreeDragons = (function (_super) {
    __extends(LittleThreeDragons, _super);
    function LittleThreeDragons() {
        _super.apply(this, arguments);
    }
    LittleThreeDragons.calculate = function (hand) {
        var pairs = 0;
        var triples = 0;
        hand.melds.forEach(function (meld, i, _) {
            if (meld.suit === tile_1.Suit.Dragon) {
                if (meld instanceof meld_1.Pair) {
                    pairs++;
                }
                else {
                    triples++;
                }
            }
        });
        if (pairs === 1 && triples === 2) {
            return 2;
        }
        else {
            return 0;
        }
    };
    LittleThreeDragons.japaneseName = "Shou Sangen";
    LittleThreeDragons.englishName = "Little Three Dragons";
    return LittleThreeDragons;
}(Yaku));
exports.LittleThreeDragons = LittleThreeDragons;
/**
 * Ryanpeikou (twice pure double chiis) yaku pattern
 * Two pair of chiis, where each pair consists of two identical chiis.
 *
 * Must be closed: yes
 * Han: 3
 *
 */
var TwoDoubleStraights = (function (_super) {
    __extends(TwoDoubleStraights, _super);
    function TwoDoubleStraights() {
        _super.apply(this, arguments);
    }
    TwoDoubleStraights.calculate = function (hand) {
        if (!hand.isClosed()) {
            return 0;
        }
        if (TwoDoubleStraights.countDoubleStraights(hand.melds) === 2) {
            return 3;
        }
        else {
            return 0;
        }
    };
    TwoDoubleStraights.japaneseName = "Ryanpeikou";
    TwoDoubleStraights.englishName = "TwoDoubleStraights";
    return TwoDoubleStraights;
}(AbstractDoubleStraight));
exports.TwoDoubleStraights = TwoDoubleStraights;
/**
 * Junchan Taiyaochuu or Junchan (terminals in all melds) yaku pattern
 * A hand where all melds contain terminals
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
var TerminalsInAllMelds = (function (_super) {
    __extends(TerminalsInAllMelds, _super);
    function TerminalsInAllMelds() {
        _super.apply(this, arguments);
    }
    TerminalsInAllMelds.calculate = function (hand) {
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Straight) {
                if (!meld.tiles[0].isTerminal() &&
                    !meld.tiles[2].isTerminal()) {
                    return 0;
                }
            }
            else {
                if (!meld.tiles[0].isTerminal()) {
                    return 0;
                }
            }
        });
        return hand.plusOneIfClosed(2);
    };
    TerminalsInAllMelds.japaneseName = "Junchan Taiyaochuu";
    TerminalsInAllMelds.englishName = "Terminals in all melds";
    return TerminalsInAllMelds;
}(Yaku));
exports.TerminalsInAllMelds = TerminalsInAllMelds;
/**
 * Fanpai/Yakuhai (Seat Wind) yaku pattern
 * A pon or kan in the players wind.
 *
 * Must be closed: no
 * Han: 1
 */
var FanpaiSeatWind = (function (_super) {
    __extends(FanpaiSeatWind, _super);
    function FanpaiSeatWind() {
        _super.apply(this, arguments);
    }
    FanpaiSeatWind.calculate = function (hand) {
        hand.melds.forEach(function (meld, i, _) {
            if ((meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) &&
                meld.suit === tile_1.Suit.Wind &&
                meld.tiles[0].value === hand.seatWind) {
                return 1;
            }
        });
        return 0;
    };
    FanpaiSeatWind.japaneseName = "Fanpai";
    FanpaiSeatWind.englishName = "Seat Wind";
    return FanpaiSeatWind;
}(Yaku));
exports.FanpaiSeatWind = FanpaiSeatWind;
/**
 * Fanpai/Yakuhai (Round Wind) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1
 */
var FanpaiRoundWind = (function (_super) {
    __extends(FanpaiRoundWind, _super);
    function FanpaiRoundWind() {
        _super.apply(this, arguments);
    }
    FanpaiRoundWind.calculate = function (hand) {
        hand.melds.forEach(function (meld, i, _) {
            if ((meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) &&
                meld.suit === tile_1.Suit.Wind &&
                meld.tiles[0].value === hand.roundWind) {
                return 1;
            }
        });
        return 0;
    };
    FanpaiRoundWind.japaneseName = "Fanpai";
    FanpaiRoundWind.englishName = "Round Wind";
    return FanpaiRoundWind;
}(Yaku));
exports.FanpaiRoundWind = FanpaiRoundWind;
/**
 * Fanpai/Yakuhai (Dragon Triple) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1 per meld
 */
var FanpaiDragonTriple = (function (_super) {
    __extends(FanpaiDragonTriple, _super);
    function FanpaiDragonTriple() {
        _super.apply(this, arguments);
    }
    FanpaiDragonTriple.calculate = function (hand) {
        var count = 0;
        hand.melds.forEach(function (meld, i, _) {
            if ((meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) &&
                meld.suit === tile_1.Suit.Dragon) {
                count++;
            }
        });
        return count;
    };
    FanpaiDragonTriple.japaneseName = "Fanpai";
    FanpaiDragonTriple.englishName = "Dragon Triple";
    return FanpaiDragonTriple;
}(Yaku));
exports.FanpaiDragonTriple = FanpaiDragonTriple;
/**
 * Pinfu (All chii / No points) yaku pattern
 * A hand with no fu except the one for winning
 * Just chii, no pair point (dragon or seat/prevalent wind) and a two-sided wait (only wait that give no fu)
 *
 * Must be closed: yes
 * Han: 1
 */
var Pinfu = (function (_super) {
    __extends(Pinfu, _super);
    function Pinfu() {
        _super.apply(this, arguments);
    }
    Pinfu.calculate = function (hand) {
        if (!hand.isClosed() ||
            hand.isEdgeWait() ||
            hand.isClosedWait() ||
            hand.isSingleWait()) {
            return 0;
        }
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Pair) {
                if (meld.suit === tile_1.Suit.Dragon)
                    return 0;
                if (meld.suit === tile_1.Suit.Wind) {
                    if (meld.tiles[0].value === hand.seatWind)
                        return 0;
                    if (meld.tiles[0].value === hand.roundWind)
                        return 0;
                }
            }
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple)
                return 0;
        });
        return 1;
    };
    Pinfu.japaneseName = "Pinfu";
    Pinfu.englishName = "All Chii / No points";
    return Pinfu;
}(Yaku));
exports.Pinfu = Pinfu;
/**
 * San Ankou (3 closed pons) yaku pattern
 * A hand with three closed pons or kans.
 *
 * Must be closed: no
 * Han: 2
 */
var ThreeClosedTriples = (function (_super) {
    __extends(ThreeClosedTriples, _super);
    function ThreeClosedTriples() {
        _super.apply(this, arguments);
    }
    ThreeClosedTriples.calculate = function (hand) {
        var count = 0;
        hand.closedMelds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                count++;
            }
        });
        if (count >= 3) {
            return 2;
        }
        return 0;
    };
    ThreeClosedTriples.japaneseName = "San Ankou";
    ThreeClosedTriples.englishName = "Three Closed Triples";
    return ThreeClosedTriples;
}(Yaku));
exports.ThreeClosedTriples = ThreeClosedTriples;
/**
 * San Kan Tsu (3 kans) yaku pattern
 * A hand with three kans.
 *
 * Must be closed: no
 * Han: 2
 */
var ThreeQuadruples = (function (_super) {
    __extends(ThreeQuadruples, _super);
    function ThreeQuadruples() {
        _super.apply(this, arguments);
    }
    ThreeQuadruples.calculate = function (hand) {
        var quadruples = 0;
        hand.melds.forEach(function (meld, i, _) {
            if (meld instanceof meld_1.Quadruple) {
                quadruples++;
            }
        });
        if (quadruples >= 3) {
            return 2;
        }
        return 0;
    };
    ThreeQuadruples.japaneseName = "San Kan Tsu";
    ThreeQuadruples.englishName = "3 kans";
    return ThreeQuadruples;
}(Yaku));
exports.ThreeQuadruples = ThreeQuadruples;
/**
 * Menzen Tsumo (Fully closed Hand) yaku pattern
 * Going out on self-draw with a closed hand.
 *
 * Must be closed: yes
 * Han: 1
 */
var MenzenTsumo = (function (_super) {
    __extends(MenzenTsumo, _super);
    function MenzenTsumo() {
        _super.apply(this, arguments);
    }
    MenzenTsumo.calculate = function (hand) {
        if (hand.winMethod === hand_1.WinningMethod.Tsumo && hand.isClosed()) {
            return 1;
        }
        return 0;
    };
    MenzenTsumo.japaneseName = "Menzen Tsumo";
    MenzenTsumo.englishName = "Fully closed Hand";
    return MenzenTsumo;
}(Yaku));
exports.MenzenTsumo = MenzenTsumo;
/**
 * Riichi yaku pattern
 * Waiting hand with declaration and 1000 point buy in.
 *
 * Must be closed: yes
 * Han: 1
 */
var Riichi = (function (_super) {
    __extends(Riichi, _super);
    function Riichi() {
        _super.apply(this, arguments);
    }
    Riichi.calculate = function (hand) {
        if (hand.hasBonus(hand_1.WinningBonus.Riichi) ||
            hand.hasBonus(hand_1.WinningBonus.DoubleRiichi)) {
            return 1;
        }
        return 0;
    };
    Riichi.japaneseName = "Riichi";
    Riichi.englishName = "Riichi";
    return Riichi;
}(Yaku));
exports.Riichi = Riichi;
/**
 * Double Riichi yaku pattern
 * Declaring riichi within the first uninterrupted go around.
 *
 * Must be closed: yes
 * Han: 1
 */
var DoubleRiichi = (function (_super) {
    __extends(DoubleRiichi, _super);
    function DoubleRiichi() {
        _super.apply(this, arguments);
    }
    DoubleRiichi.calculate = function (hand) {
        if (hand.hasBonus(hand_1.WinningBonus.DoubleRiichi)) {
            return 1;
        }
        return 0;
    };
    DoubleRiichi.japaneseName = "Double Riichi";
    DoubleRiichi.englishName = "Double Riichi";
    return DoubleRiichi;
}(Yaku));
exports.DoubleRiichi = DoubleRiichi;
/**
 * Ippatsu (One Shot) yaku pattern
 * Winning within the first uninterrupted go around after declaring riichi .
 *
 * Must be closed: yes
 * Han: 1
 */
var Ippatsu = (function (_super) {
    __extends(Ippatsu, _super);
    function Ippatsu() {
        _super.apply(this, arguments);
    }
    Ippatsu.calculate = function (hand) {
        if (hand.hasBonus(hand_1.WinningBonus.Ippatsu)) {
            return 1;
        }
        return 0;
    };
    Ippatsu.japaneseName = "Ippatsu";
    Ippatsu.englishName = "One Shot";
    return Ippatsu;
}(Yaku));
exports.Ippatsu = Ippatsu;
/**
 * Haitei Raoyue (Last Tile Draw) yaku pattern
 * Winning on the very last tile
 *
 * Must be closed: no
 * Han: 1
 */
var LastFromWall = (function (_super) {
    __extends(LastFromWall, _super);
    function LastFromWall() {
        _super.apply(this, arguments);
    }
    LastFromWall.calculate = function (hand) {
        if (hand.winMethod === hand_1.WinningMethod.Tsumo && hand.hasBonus(hand_1.WinningBonus.LastFromWall)) {
            return 1;
        }
        return 0;
    };
    LastFromWall.japaneseName = "Haitei Raoyue";
    LastFromWall.englishName = "Last From Wall";
    return LastFromWall;
}(Yaku));
exports.LastFromWall = LastFromWall;
/**
 * Houtei Raoyui (Last Tile Discard) yaku pattern
 * Winning on the very last discard
 *
 * Must be closed: no
 * Han: 1
 */
var LastDiscard = (function (_super) {
    __extends(LastDiscard, _super);
    function LastDiscard() {
        _super.apply(this, arguments);
    }
    LastDiscard.calculate = function (hand) {
        if (hand.winMethod === hand_1.WinningMethod.Ron && hand.hasBonus(hand_1.WinningBonus.LastDiscard)) {
            return 1;
        }
        return 0;
    };
    LastDiscard.japaneseName = "Houtei Raoyui";
    LastDiscard.englishName = "Last Discard";
    return LastDiscard;
}(Yaku));
exports.LastDiscard = LastDiscard;
/**
 * Rinshan Kaihou (After Quadruple) yaku pattern
 * Winning after drawing a replacement tile.
 *
 * Must be closed: no
 * Han: 1
 */
var DeadWallDraw = (function (_super) {
    __extends(DeadWallDraw, _super);
    function DeadWallDraw() {
        _super.apply(this, arguments);
    }
    DeadWallDraw.calculate = function (hand) {
        if (hand.winMethod === hand_1.WinningMethod.Tsumo && hand.hasBonus(hand_1.WinningBonus.DeadWallDraw)) {
            return 1;
        }
        return 0;
    };
    DeadWallDraw.japaneseName = "Rinshan Kaihou";
    DeadWallDraw.englishName = "Dead Wall Draw";
    return DeadWallDraw;
}(Yaku));
exports.DeadWallDraw = DeadWallDraw;
/**
 * Chan kan (Robbing the kan) yaku pattern
 * Winning on off a tile used to extend a kong.
 *
 * Must be closed: no
 * Han: 1
 */
var QuadrupleRob = (function (_super) {
    __extends(QuadrupleRob, _super);
    function QuadrupleRob() {
        _super.apply(this, arguments);
    }
    QuadrupleRob.calculate = function (hand) {
        if (hand.winMethod === hand_1.WinningMethod.Ron && hand.hasBonus(hand_1.WinningBonus.QuadrupleRob)) {
            return 1;
        }
        return 0;
    };
    QuadrupleRob.japaneseName = "Chan Kan";
    QuadrupleRob.englishName = "Robbing the Quadruple";
    return QuadrupleRob;
}(Yaku));
exports.QuadrupleRob = QuadrupleRob;
/**
 * Dora yaku pattern
 *
 * Must be closed: no
 * Han: 1 / dora
 */
var Dora = (function (_super) {
    __extends(Dora, _super);
    function Dora() {
        _super.apply(this, arguments);
    }
    Dora.calculate = function (hand) {
        return Dora.calculateDoraPoints(hand.dora, hand.tiles);
    };
    Dora.japaneseName = "Dora";
    Dora.englishName = "Dora";
    return Dora;
}(AbstractDora));
exports.Dora = Dora;
/**
 * Ura-Dora yaku pattern
 *
 * Must be closed: no
 * Han: 1 / ura-dora
 */
var UraDora = (function (_super) {
    __extends(UraDora, _super);
    function UraDora() {
        _super.apply(this, arguments);
    }
    UraDora.calculate = function (hand) {
        if (!hand.hasBonus(hand_1.WinningBonus.Riichi) &&
            !hand.hasBonus(hand_1.WinningBonus.DoubleRiichi)) {
            return 0;
        }
        return UraDora.calculateDoraPoints(hand.uraDora, hand.tiles);
    };
    UraDora.japaneseName = "Ura-Dora";
    UraDora.englishName = "Ura-Dora";
    return UraDora;
}(AbstractDora));
exports.UraDora = UraDora;
