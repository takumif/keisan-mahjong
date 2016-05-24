var Hand = (function () {
    function Hand(concealedCombinaisons, openCombinaisons, seatWind, roundWind, winningCombinaisonIndex, winningTileIndex, winningType, winningSecondType, doraTiles, uraDoraTiles) {
        this.concealedCombinaisons = concealedCombinaisons;
        this.openCombinaisons = openCombinaisons;
        this.seatWind = seatWind;
        this.roundWind = roundWind;
        this.winningCombinaisonIndex = winningCombinaisonIndex;
        this.winningTileIndex = winningTileIndex;
        this.winningType = winningType;
        this.winningSecondType = winningSecondType;
        this.doraTiles = doraTiles;
        this.uraDoraTiles = uraDoraTiles;
        this.combinaisons = concealedCombinaisons.concat(this.openCombinaisons);
        this.isRiichi = false;
        this.isDoubleRiichi = false;
        this.isIppatsu = false;
    }
    return Hand;
}());
