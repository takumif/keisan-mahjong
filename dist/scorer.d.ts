import { Wind } from "./tile";
import { Meld, Pair } from "./meld";
import { Hand } from "./hand";
import { Yaku } from "./yaku";
export declare class Scorer {
    /**
     * Returns a list of payments to be made to the winner.
     * If it was a ron, it's a singleton of the points to pay,
     * and if it was a tsumo, it returns [x, y, y] where x is what the dealer
     * has to pay, and y is what the non-dealers have to pay.
     */
    static calculatePayments(hand: Hand): number[];
    static calculateBasePayment(han: number, fu: number): number;
    static calculateFu(hand: Hand, yakus?: typeof Yaku[]): number;
    static calculateFuForMeld(meld: Meld, closed: boolean, seatWind: Wind, roundWind: Wind): number;
    static calculateFuForNonPairMeld(meld: Meld, closed: boolean): number;
    static calculateFuForPair(pair: Pair, seatWind: Wind, roundWind: Wind): number;
    private static calculateFuFromWinMethod(hand);
    private static calculateFuFromMelds(hand);
    private static calculateFuFromWait(hand);
    private static splitPayment(base, winMethod, dealer);
    /**
     * digits should be 0.1, 1, 10, etc.
     */
    private static roundUpToNearest(digits, points);
}
