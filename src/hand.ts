class Hand {
    constructor(
        private concealedCombinaisons: HandCombinaison[],
        private openCombinaisons: HandCombinaison[],
        private seatWind,
        private roundWind,
        private winningCombinaisonIndex,
        private winningTileIndex,
        private winningType,
        private winningSecondType,
        private doraTiles,
        private uraDoraTiles
    ) {
        this.combinaisons = concealedCombinaisons.concat(this.openCombinaisons);
        this.isRiichi = false;
        this.isDoubleRiichi = false;
        this.isIppatsu = false;
    }
}