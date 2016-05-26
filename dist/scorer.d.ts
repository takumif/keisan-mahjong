import { Wind } from "./tile";
import { Meld, Pair } from "./meld";
import { Hand } from "./hand";
import { Yaku } from "./yaku";
export declare class Scorer {
    static calculatePayments(hand: Hand): number[];
    static calculateBasePayment(han: number, fu: number): number;
    static calculateFu(hand: Hand, yakus: typeof Yaku[]): number;
    static calculateFuForMeld(meld: Meld, closed: boolean, seatWind: Wind, roundWind: Wind): number;
    static calculateFuForNonPairMeld(meld: Meld, closed: boolean): number;
    static calculateFuForPair(pair: Pair, seatWind: Wind, roundWind: Wind): number;
    private static calculateFuFromWinMethod(hand);
    private static calculateFuFromMelds(hand);
    private static calculateFuFromWait(hand);
    private static splitPayment(base, winMethod, dealer);
    private static roundUpToNearest100(points);
}
