"use strict";
var tile_1 = require("./tile");
var meld_1 = require("./meld");
var hand_1 = require("./hand");
var yaku_1 = require("./yaku");
var Scorer = (function () {
    function Scorer() {
    }
    /**
     * Returns a list of payments to be made to the winner.
     * If it was a ron, it's a singleton of the points to pay,
     * and if it was a tsumo, it returns [x, y, y] where x is what the dealer
     * has to pay, and y is what the non-dealers have to pay.
     */
    Scorer.calculatePayments = function (hand) {
        var yakus = yaku_1.Yaku.getApplyingYakuList(hand);
        var fu = Scorer.calculateFu(hand, yakus);
        var han = yaku_1.Yaku.calculateHan(hand, yakus);
        var base = Scorer.calculateBasePayment(fu, han);
        return Scorer.splitPayment(base, hand.winMethod, hand.seatWind === hand.roundWind);
    };
    Scorer.calculateBasePayment = function (han, fu) {
        if (han >= 13) {
            return 8000;
        }
        else if (han >= 11) {
            return 6000;
        }
        else if (han >= 8) {
            return 4000;
        }
        else if (han >= 6) {
            return 3000;
        }
        var base = fu * Math.pow(2, han + 2);
        return Math.min(2000, base);
    };
    Scorer.calculateFu = function (hand, yakus) {
        yakus = yakus ? yakus : [];
        if (yakus.indexOf(yaku_1.SevenPairs) !== -1) {
            return 25;
        }
        else if (yakus.indexOf(yaku_1.AllSimples) !== -1) {
            return 20;
        }
        return Scorer.roundUpToNearest(10, 20
            + Scorer.calculateFuFromWinMethod(hand)
            + Scorer.calculateFuFromMelds(hand)
            + Scorer.calculateFuFromWait(hand));
    };
    Scorer.calculateFuForMeld = function (meld, closed, seatWind, roundWind) {
        if (meld instanceof meld_1.Pair) {
            return Scorer.calculateFuForPair(meld, seatWind, roundWind);
        }
        else {
            return Scorer.calculateFuForNonPairMeld(meld, closed);
        }
    };
    Scorer.calculateFuForNonPairMeld = function (meld, closed) {
        var fu = 0;
        if (meld instanceof meld_1.Straight) {
            return 0;
        }
        else if (meld instanceof meld_1.Triple) {
            fu = 2;
        }
        else if (meld instanceof meld_1.Quadruple) {
            fu = 8;
        }
        if (meld.tiles[0].isTerminal() || meld.tiles[0].type === tile_1.TileType.Honor) {
            fu *= 2;
        }
        if (closed) {
            fu *= 2;
        }
        return fu;
    };
    Scorer.calculateFuForPair = function (pair, seatWind, roundWind) {
        if (pair.suit === tile_1.Suit.Dragon) {
            return 2;
        }
        else if (pair.suit === tile_1.Suit.Wind) {
            var wind = pair.tiles[0].value;
            var fu = 0;
            if (wind === seatWind) {
                fu += 2;
            }
            if (wind === roundWind) {
                fu += 2;
            }
            return fu;
        }
        else {
            return 0;
        }
    };
    Scorer.calculateFuFromWinMethod = function (hand) {
        if (hand.isClosed() && hand.winMethod === hand_1.WinningMethod.Ron) {
            return 10;
        }
        else if (hand.winMethod === hand_1.WinningMethod.Tsumo) {
            return 2;
        }
        else {
            return 0;
        }
    };
    Scorer.calculateFuFromMelds = function (hand) {
        var fu = 0;
        hand.closedMelds.forEach(function (meld, i, _) {
            fu += Scorer.calculateFuForMeld(meld, true, hand.seatWind, hand.roundWind);
        });
        hand.openMelds.forEach(function (meld, i, _) {
            fu += Scorer.calculateFuForMeld(meld, false, hand.seatWind, hand.roundWind);
        });
        fu += Scorer.calculateFuForMeld(hand.winningMeld, false, hand.seatWind, hand.roundWind);
        return fu;
    };
    Scorer.calculateFuFromWait = function (hand) {
        if (hand.isOneSideWait() || hand.isPairWait()) {
            return 2;
        }
        else {
            return 0;
        }
    };
    Scorer.splitPayment = function (base, winMethod, dealer) {
        if (winMethod === hand_1.WinningMethod.Ron) {
            if (dealer) {
                return [Scorer.roundUpToNearest(100, base * 6)];
            }
            else {
                return [Scorer.roundUpToNearest(100, base * 4)];
            }
        }
        else {
            if (dealer) {
                return [base * 2, base * 2, base * 2].map(function (n) { return Scorer.roundUpToNearest(100, n); });
            }
            else {
                return [base * 2, base, base].map(function (n) { return Scorer.roundUpToNearest(100, n); });
            }
        }
    };
    /**
     * digits should be 0.1, 1, 10, etc.
     */
    Scorer.roundUpToNearest = function (digits, points) {
        return Math.ceil(points / digits) * digits;
    };
    return Scorer;
}());
exports.Scorer = Scorer;
