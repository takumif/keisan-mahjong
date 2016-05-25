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
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === tile_1.TileType.Honor || tile.isTerminal())
                    return 0;
            }
        }
        return 1;
    };
    ;
    AllSimples.japaneseName = "Tanyao Chuu";
    AllSimples.englishName = "All Simples";
    return AllSimples;
}(Yaku));
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
        var nbHonorTile = 0;
        var suit = null;
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === tile_1.TileType.Honor) {
                    nbHonorTile++;
                }
                else {
                    if (suit == null) {
                        suit = tile.suit;
                    }
                    else if (suit != tile.suit) {
                        return 0;
                    }
                }
            }
        }
        if (nbHonorTile > 0) {
            if (!hand.isClosed()) {
                return 2;
            }
            else {
                return 3;
            }
        }
        else {
            return 0;
        }
    };
    HalfFlush.japaneseName = "Hon Itsu";
    HalfFlush.englishName = "Half Flush";
    return HalfFlush;
}(Yaku));
/**
 * Chinitsu (full flush) yaku pattern
 * A hand with tiles from only one suit
 *
 * Must be closed: no
 * Han: 6 (closed) / 5 (open)
 */
var Chinitsu = (function (_super) {
    __extends(Chinitsu, _super);
    function Chinitsu() {
        _super.apply(this, arguments);
    }
    Chinitsu.calculate = function (hand) {
        var suit = null;
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (tile.type === tile_1.TileType.Honor)
                    return 0;
                if (suit === null) {
                    suit = tile.suit;
                }
                else if (suit !== tile.suit) {
                    return 0;
                }
            }
        }
        if (hand.isClosed()) {
            return 6;
        }
        else {
            return 5;
        }
    };
    ;
    Chinitsu.japaneseName = "Chinitsu";
    Chinitsu.englishName = "Full Flush";
    return Chinitsu;
}(Yaku));
/**
 * Honroutou (all terminals & honors) yaku pattern
 * A hand consisting of only terminals and honors
 *
 * Must be closed: no
 * Han: 2
 */
var Honroutou = (function (_super) {
    __extends(Honroutou, _super);
    function Honroutou() {
        _super.apply(this, arguments);
    }
    Honroutou.calculate = function (hand) {
        for (var i = 0; i < hand.melds.length; i++) {
            for (var j = 0; j < hand.melds[i].tiles.length; j++) {
                var tile = hand.melds[i].tiles[j];
                if (!(tile.type === tile_1.TileType.Honor || tile.isTerminal()))
                    return 0;
            }
        }
        return 2;
    };
    ;
    Honroutou.japaneseName = "Honroutou";
    Honroutou.englishName = "All terminals & honors";
    return Honroutou;
}(Yaku));
/**
 * Iipeikou (pure double chii) yaku pattern
 * Two chiis of the same value and suit
 *
 * Must be closed: yes
 * Han: 1
 */
var Iipeikou = (function (_super) {
    __extends(Iipeikou, _super);
    function Iipeikou() {
        _super.apply(this, arguments);
    }
    Iipeikou.calculate = function (hand) {
        if (!hand.isClosed())
            return 0;
        var storedChiis = [];
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Straight) {
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
    ;
    Iipeikou.japaneseName = "Iipeikou";
    Iipeikou.englishName = "Pure Double Chii";
    return Iipeikou;
}(Yaku));
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
    ;
    SanShokuDoujun.japaneseName = "San Shoku Doujun";
    SanShokuDoujun.englishName = "Mixed Triple Chii";
    return SanShokuDoujun;
}(Yaku));
/**
 * Itsu or Ikkitsuukan (pure straight) yaku pattern
 * Three consecutive chiis (1-9) in the same suit
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
var Itsu = (function (_super) {
    __extends(Itsu, _super);
    function Itsu() {
        _super.apply(this, arguments);
    }
    Itsu.calculate = function (hand) {
        var storedChiis = {};
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Straight) {
                var tile = meld.tiles[0];
                if (storedChiis[tile.suit] == undefined) {
                    storedChiis[tile.suit] = { 1: 0, 4: 0, 7: 0 };
                }
                var chii = storedChiis[tile.suit];
                chii[tile.value]++;
                if (chii[1] && chii[4] && chii[7]) {
                    if (!hand.isClosed()) {
                        return 1;
                    }
                    else {
                        return 2;
                    }
                }
            }
        }
        return 0;
    };
    ;
    Itsu.japaneseName = "Itsu"; // can be call Ikkitsuukan
    Itsu.englishName = "Pure Straight";
    return Itsu;
}(Yaku));
/**
 * Chanta (outside hand) yaku pattern
 * A hand where all sets contain a terminal or honor tile, and at least one of the sets is a chii.
 *
 * Must be closed: no
 * Han: 2 (closed) / 1 (open)
 */
var Chanta = (function (_super) {
    __extends(Chanta, _super);
    function Chanta() {
        _super.apply(this, arguments);
    }
    Chanta.calculate = function (hand) {
        var nbChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Straight)
                nbChii++;
            var nbTerminalOrHonor = 0;
            for (var j = 0; j < meld.tiles.length; j++) {
                var tile = meld.tiles[j];
                if (tile.type === tile_1.TileType.Honor || tile.isTerminal())
                    nbTerminalOrHonor++;
            }
            if (nbTerminalOrHonor == 0)
                return 0;
        }
        if (nbChii > 0) {
            if (hand.isClosed()) {
                return 2;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    };
    Chanta.japaneseName = "Chanta";
    Chanta.englishName = "Outside Hand";
    return Chanta;
}(Yaku));
/**
 * Chii Toitsu (seven pairs) yaku pattern
 * A hand consisting of seven pairs
 *
 * Must be closed: yes
 * Han: 2
 */
var ChiiToitsu = (function (_super) {
    __extends(ChiiToitsu, _super);
    function ChiiToitsu() {
        _super.apply(this, arguments);
    }
    ChiiToitsu.calculate = function (hand) {
        var nbPair = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Pair)
                nbPair++;
        }
        if (nbPair === 7) {
            return 2;
        }
        else {
            return 0;
        }
    };
    ChiiToitsu.japaneseName = "Chii Toitsu";
    ChiiToitsu.englishName = "Seven Pairs";
    return ChiiToitsu;
}(Yaku));
/**
 * San Shoku Dokou (triple pon) yaku pattern
 * One pon or kan in each of the three suits, all having the same number.
 *
 * Must be closed: no
 * Han: 2
 */
var SanShokuDokou = (function (_super) {
    __extends(SanShokuDokou, _super);
    function SanShokuDokou() {
        _super.apply(this, arguments);
    }
    SanShokuDokou.calculate = function (hand) {
        var storedTriples = {};
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                var tile = meld.tiles[0];
                if (tile.type === tile_1.TileType.Number) {
                    if (storedTriples[tile.value] == undefined)
                        storedTriples[tile.value] = 0;
                    storedTriples[tile.value]++;
                    if (storedTriples[tile.value] == 3)
                        return 2;
                }
            }
        }
        return 0;
    };
    SanShokuDokou.japaneseName = "San Shoku Dokou";
    SanShokuDokou.englishName = "Triple Triple";
    return SanShokuDokou;
}(Yaku));
/*
 * Toi-Toi Hou (all pons) yaku pattern
 * A hand with four pons/kans and one pair.
 *
 * Must be closed: no
 * Han: 2
 */
var ToiToiHou = (function (_super) {
    __extends(ToiToiHou, _super);
    function ToiToiHou() {
        _super.apply(this, arguments);
    }
    ToiToiHou.calculate = function (hand) {
        var nbTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple)
                nbTriple++;
        }
        if (nbTriple >= 4) {
            return 2;
        }
        else {
            return 0;
        }
    };
    ;
    ToiToiHou.japaneseName = "Toi-Toi Hou";
    ToiToiHou.englishName = "All Triple";
    return ToiToiHou;
}(Yaku));
/**
 * Shou Sangen (little three dragons) yaku pattern
 * Two pons/kans of dragons plus one pair of dragons.
 *
 * Must be closed: no
 * Han: 2
 */
var ShouSangen = (function (_super) {
    __extends(ShouSangen, _super);
    function ShouSangen() {
        _super.apply(this, arguments);
    }
    ShouSangen.calculate = function (hand) {
        var nbDragonPair = 0;
        var nbDragonTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Pair) {
                if (meld.tiles[0].suit === tile_1.Suit.Dragon)
                    nbDragonPair++;
            }
            else if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                if (meld.tiles[0].suit === tile_1.Suit.Dragon)
                    nbDragonTriple++;
            }
        }
        if (nbDragonPair >= 1 && nbDragonTriple >= 2) {
            return 2;
        }
        else {
            return 0;
        }
    };
    ;
    ShouSangen.japaneseName = "Shou Sangen";
    ShouSangen.englishName = "Little Three Dragons";
    return ShouSangen;
}(Yaku));
/**
 * Ryan Peikou (twice pure double chiis) yaku pattern
 * Two pair of chiis, where each pair consists of two identical chiis.
 *
 * Must be closed: no (some rules say yes)
 * Han: 3
 *
 */
var RyanPeikou = (function (_super) {
    __extends(RyanPeikou, _super);
    function RyanPeikou() {
        _super.apply(this, arguments);
    }
    RyanPeikou.calculate = function (hand) {
        var chiis = {};
        var nbPairOfChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Straight) {
                var chiiKey = meld.tiles[0].suit + meld.tiles[0].value;
                if (chiis[chiiKey] == undefined)
                    chiis[chiiKey] = 0;
                else
                    nbPairOfChii++;
            }
        }
        if (nbPairOfChii == 2) {
            if (hand.isClosed()) {
                return 3;
            }
            else {
                return 2;
            }
        }
        return 0;
    };
    ;
    RyanPeikou.japaneseName = "Ryan Peikou";
    RyanPeikou.englishName = "Twice Pure Double Chii";
    return RyanPeikou;
}(Yaku));
/**
 * Junchan Taiyai or Junchan Tayao or Junchan (terminals in all sets) yaku pattern
 * A hand with at least one chii and where all sets and the pair contains terminals
 *
 * Must be closed: no
 * Han: 3 (closed) / 2 (open)
 */
var JunchanTaiyai = (function (_super) {
    __extends(JunchanTaiyai, _super);
    function JunchanTaiyai() {
        _super.apply(this, arguments);
    }
    JunchanTaiyai.calculate = function (hand) {
        var nbChii = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Straight)
                nbChii++;
            var nbTerminal = 0;
            for (var j = 0; j < meld.tiles.length; j++) {
                var tile = meld.tiles[j];
                if (tile.type === tile_1.TileType.Number && tile.isTerminal())
                    nbTerminal++;
            }
            if (nbTerminal == 0)
                return 0;
        }
        if (nbChii > 0) {
            return 3;
        }
        else {
            return 0;
        }
    };
    ;
    JunchanTaiyai.japaneseName = "Junchan Taiyai"; // can also be call Junchan Tayao or Junchan
    JunchanTaiyai.englishName = "Terminals in all sets";
    return JunchanTaiyai;
}(Yaku));
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
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                var tile = meld.tiles[0];
                if (tile.suit === tile_1.Suit.Wind && tile.value == hand.seatWind)
                    return 1;
            }
        }
        return 0;
    };
    ;
    FanpaiSeatWind.japaneseName = "Fanpai";
    FanpaiSeatWind.englishName = "Seat Wind";
    return FanpaiSeatWind;
}(Yaku));
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
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                var tile = meld.tiles[0];
                if (tile.suit === tile_1.Suit.Wind && tile.value == hand.roundWind)
                    return 1;
            }
        }
        return 0;
    };
    ;
    FanpaiRoundWind.japaneseName = "Fanpai";
    FanpaiRoundWind.englishName = "Round Wind";
    return FanpaiRoundWind;
}(Yaku));
/**
 * Fanpai/Yakuhai (Dragon Triple) yaku pattern
 * A pon or kan in the prevalent wind.
 *
 * Must be closed: no
 * Han: 1
 */
var FanpaiDragonTriple = (function (_super) {
    __extends(FanpaiDragonTriple, _super);
    function FanpaiDragonTriple() {
        _super.apply(this, arguments);
    }
    FanpaiDragonTriple.calculate = function (hand) {
        var nbDragonTriple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                if (meld.tiles[0].suit === tile_1.Suit.Dragon)
                    nbDragonTriple++;
            }
        }
        return nbDragonTriple;
    };
    ;
    FanpaiDragonTriple.japaneseName = "Fanpai";
    FanpaiDragonTriple.englishName = "Dragon Triple";
    return FanpaiDragonTriple;
}(Yaku));
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
        if (!hand.isClosed())
            return 0;
        if (hand.isEdgeWait())
            return 0;
        if (hand.isClosedWait())
            return 0;
        if (hand.isSingleWait())
            return 0;
        for (var i = 0; i < hand.melds.length; i++) {
            var meld = hand.melds[i];
            if (meld instanceof meld_1.Pair) {
                if (meld.tiles[0].suit === tile_1.Suit.Dragon)
                    return 0;
                if (meld.tiles[0].suit === tile_1.Suit.Wind) {
                    if (meld.tiles[0].value === hand.seatWind)
                        return 0;
                    if (meld.tiles[0].value === hand.roundWind)
                        return 0;
                }
            }
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple)
                return 0;
        }
        return 1;
    };
    ;
    Pinfu.japaneseName = "Pinfu";
    Pinfu.englishName = "All Chii / No points";
    return Pinfu;
}(Yaku));
/**
 * San Ankou (3 closed pons) yaku pattern
 * A hand with three closed pons or kans.
 *
 * Must be closed: no
 * Han: 2
 */
var SanAnkou = (function (_super) {
    __extends(SanAnkou, _super);
    function SanAnkou() {
        _super.apply(this, arguments);
    }
    SanAnkou.calculate = function (hand) {
        var nbclosedTriple = 0;
        for (var i = 0; i < hand.closedMelds.length; i++) {
            var meld = hand.closedMelds[i];
            if (meld instanceof meld_1.Triple || meld instanceof meld_1.Quadruple) {
                nbclosedTriple++;
            }
        }
        if (nbclosedTriple >= 3) {
            return 2;
        }
        return 0;
    };
    ;
    SanAnkou.japaneseName = "San Ankou";
    SanAnkou.englishName = "3 closed pons";
    return SanAnkou;
}(Yaku));
/**
 * San Quadruple Tsu (3 kans) yaku pattern
 * A hand with three kans.
 *
 * Must be closed: no
 * Han: 2
 */
var SanQuadrupleTsu = (function (_super) {
    __extends(SanQuadrupleTsu, _super);
    function SanQuadrupleTsu() {
        _super.apply(this, arguments);
    }
    SanQuadrupleTsu.calculate = function (hand) {
        var nbQuadruple = 0;
        for (var i = 0; i < hand.melds.length; i++) {
            if (hand.melds[i] instanceof meld_1.Quadruple) {
                nbQuadruple++;
            }
        }
        if (nbQuadruple >= 3) {
            return 2;
        }
        return 0;
    };
    ;
    SanQuadrupleTsu.japaneseName = "San Quadruple Tsu";
    SanQuadrupleTsu.englishName = "3 kans";
    return SanQuadrupleTsu;
}(Yaku));
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
        if (hand.winningDraw === hand_1.WinningDraw.Tsumo && hand.isClosed()) {
            return 1;
        }
        return 0;
    };
    ;
    MenzenTsumo.japaneseName = "Menzen Tsumo";
    MenzenTsumo.englishName = "Fully closed Hand";
    return MenzenTsumo;
}(Yaku));
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
        if (hand.riichi) {
            return 1;
        }
        return 0;
    };
    ;
    Riichi.japaneseName = "Riichi";
    Riichi.englishName = "Riichi";
    return Riichi;
}(Yaku));
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
        if (hand.doubleRiichi) {
            return 1;
        }
        return 0;
    };
    ;
    DoubleRiichi.japaneseName = "Double Riichi";
    DoubleRiichi.englishName = "Double Riichi";
    return DoubleRiichi;
}(Yaku));
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
        if (hand.ippatsu) {
            return 1;
        }
        return 0;
    };
    ;
    Ippatsu.japaneseName = "Ippatsu";
    Ippatsu.englishName = "One Shot";
    return Ippatsu;
}(Yaku));
/**
 * Haitei Raoyue (Last Tile Draw) yaku pattern
 * Winning on the very last tile
 *
 * Must be closed: no
 * Han: 1
 */
var HaiteiRaoyue = (function (_super) {
    __extends(HaiteiRaoyue, _super);
    function HaiteiRaoyue() {
        _super.apply(this, arguments);
    }
    HaiteiRaoyue.calculate = function (hand) {
        if (hand.winningDraw === hand_1.WinningDraw.Tsumo && hand.winBonus === hand_1.WinningTileBonus.LastFromWall) {
            return 1;
        }
        return 0;
    };
    ;
    HaiteiRaoyue.japaneseName = "Haitei Raoyue";
    HaiteiRaoyue.englishName = "Last Tile Draw";
    return HaiteiRaoyue;
}(Yaku));
/**
 * Houtei Raoyui (Last Tile Discard) yaku pattern
 * Winning on the very last discard
 *
 * Must be closed: no
 * Han: 1
 */
var HouteiRaoyui = (function (_super) {
    __extends(HouteiRaoyui, _super);
    function HouteiRaoyui() {
        _super.apply(this, arguments);
    }
    HouteiRaoyui.calculate = function (hand) {
        if (hand.winningDraw === hand_1.WinningDraw.Ron && hand.winBonus === hand_1.WinningTileBonus.LastDiscard) {
            return 1;
        }
        return 0;
    };
    ;
    HouteiRaoyui.japaneseName = "Houtei Raoyui";
    HouteiRaoyui.englishName = "Last Tile Discard";
    return HouteiRaoyui;
}(Yaku));
/**
 * Rinshan Kaihou (After Quadruple) yaku pattern
 * Winning after drawing a replacement tile.
 *
 * Must be closed: no
 * Han: 1
 */
var RinshanKaihou = (function (_super) {
    __extends(RinshanKaihou, _super);
    function RinshanKaihou() {
        _super.apply(this, arguments);
    }
    RinshanKaihou.calculate = function (hand) {
        if (hand.winningDraw === hand_1.WinningDraw.Tsumo && hand.winBonus === hand_1.WinningTileBonus.DeadWallDraw) {
            return 1;
        }
        return 0;
    };
    ;
    RinshanKaihou.japaneseName = "Rinshan Kaihou";
    RinshanKaihou.englishName = "After kan";
    return RinshanKaihou;
}(Yaku));
/**
 * Chan kan (Robbing the kan) yaku pattern
 * Winning on off a tile used to extend a kong.
 *
 * Must be closed: no
 * Han: 1
 */
var ChanQuadruple = (function (_super) {
    __extends(ChanQuadruple, _super);
    function ChanQuadruple() {
        _super.apply(this, arguments);
    }
    ChanQuadruple.calculate = function (hand) {
        if (hand.winningDraw === hand_1.WinningDraw.Ron && hand.winBonus === hand_1.WinningTileBonus.QuadrupleRob) {
            return 1;
        }
        return 0;
    };
    ;
    ChanQuadruple.japaneseName = "Chan Quadruple";
    ChanQuadruple.englishName = "Robbing the kan";
    return ChanQuadruple;
}(Yaku));
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
    ;
    Dora.japaneseName = "Dora";
    Dora.englishName = "Dora";
    return Dora;
}(Yaku));
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
        if (!hand.riichi)
            return 0;
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
    ;
    UraDora.japaneseName = "Ura-Dora";
    UraDora.englishName = "Ura-Dora";
    return UraDora;
}(Yaku));
