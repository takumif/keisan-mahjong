import {Tile, Suit, TileType, Wind, Dragon} from "./tile"
import {Meld, Pair, Triple, Straight, Quadruple} from "./meld"
import {Hand, WinningMethod} from "./hand"
import {Yaku, SevenPairs, AllSimples} from "./yaku"

export class Scorer {
    /**
     * Returns a list of payments to be made to the winner.
     * If it was a ron, it's a singleton of the points to pay,
     * and if it was a tsumo, it returns [x, y, y] where x is what the dealer
     * has to pay, and y is what the non-dealers have to pay.
     */
    static calculatePayments(hand: Hand): number[] {
        var yakus = Yaku.getApplyingYakuList(hand);
        var fu = Scorer.calculateFu(hand, yakus);
        var han = Yaku.calculateHan(hand, yakus);
        
        var base = Scorer.calculateBasePayment(fu, han);
        
        return Scorer.splitPayment(base, hand.winMethod, hand.seatWind === hand.roundWind);
    }
    
    static calculateBasePayment(han: number, fu: number): number {
        if (han >= 13) {
            return 8000;
        } else if (han >= 11) {
            return 6000;
        } else if (han >= 8) {
            return 4000;
        } else if (han >= 6) {
            return 3000;
        }
        
        var base = fu * Math.pow(2, han + 2);
        return Math.min(2000, base);
    }
    
    static calculateFu(hand: Hand, yakus?: typeof Yaku[]): number {
        yakus = yakus ? yakus : [];
        
        if (yakus.indexOf(SevenPairs) !== -1) {
            return 25;
        } else if (yakus.indexOf(AllSimples) !== -1) {
            return 20;
        }
        
        return Scorer.roundUpToNearest(10, 20
             + Scorer.calculateFuFromWinMethod(hand)
             + Scorer.calculateFuFromMelds(hand)
             + Scorer.calculateFuFromWait(hand));
    }
    
    static calculateFuForMeld(meld: Meld, closed: boolean, seatWind: Wind, roundWind: Wind): number {
        if (meld instanceof Pair) {
            return Scorer.calculateFuForPair(meld, seatWind, roundWind);
        } else {
            return Scorer.calculateFuForNonPairMeld(meld, closed);
        }
    }
    
    static calculateFuForNonPairMeld(meld: Meld, closed: boolean) {
        var fu = 0;
        if (meld instanceof Straight) {
            return 0;
        } else if (meld instanceof Triple) {
            fu = 2;
        } else if (meld instanceof Quadruple) {
            fu = 8;
        }
        
        if (meld.tiles[0].isTerminal() || meld.tiles[0].type === TileType.Honor) {
            fu *= 2;
        }
        if (closed) {
            fu *= 2;
        }
        return fu;
    }
    
    static calculateFuForPair(pair: Pair, seatWind: Wind, roundWind: Wind): number {
        if (pair.suit === Suit.Dragon) {
            return 2;
        } else if (pair.suit === Suit.Wind) {
            var wind = pair.tiles[0].value;
            var fu = 0;
            if (wind === seatWind) {
                fu += 2;
            }
            if (wind === roundWind) {
                fu += 2;
            }
            return fu;
        } else {
            return 0;
        }
    }
    
    private static calculateFuFromWinMethod(hand: Hand): number {
        if (hand.isClosed() && hand.winMethod === WinningMethod.Ron) {
            return 10;
        } else if (hand.winMethod === WinningMethod.Tsumo) {
            return 2;
        } else {
            return 0;
        }
    }
    
    private static calculateFuFromMelds(hand: Hand): number {
        var fu = 0;
        hand.closedMelds.forEach((meld, i, _) => {
            fu += Scorer.calculateFuForMeld(meld, true, hand.seatWind, hand.roundWind);
        });
        hand.openMelds.forEach((meld, i, _) => {
            fu += Scorer.calculateFuForMeld(meld, false, hand.seatWind, hand.roundWind);
        });
        fu += Scorer.calculateFuForMeld(hand.winningMeld, false, hand.seatWind, hand.roundWind);
        return fu;
    }
    
    private static calculateFuFromWait(hand: Hand): number {
        if (hand.isOneSideWait() || hand.isPairWait()) {
            return 2;
        } else {
            return 0;
        }
    }
    
    private static splitPayment(base: number, winMethod: WinningMethod, dealer: boolean): number[] {
        if (winMethod === WinningMethod.Ron) {
            if (dealer) {
                return [Scorer.roundUpToNearest(100, base * 6)];
            } else {
                return [Scorer.roundUpToNearest(100, base * 4)];
            }
        } else {
            if (dealer) {
                return [base * 2, base * 2, base * 2].map((n) => {return Scorer.roundUpToNearest(100, n)});
            } else {
                return [base * 2, base, base].map((n) => {return Scorer.roundUpToNearest(100, n)});
            }
        }
    }
    
    /**
     * digits should be 0.1, 1, 10, etc.
     */
    private static roundUpToNearest(digits: number, points: number): number {
        return Math.ceil(points / digits) * digits;
    }
}