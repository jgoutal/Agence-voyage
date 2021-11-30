class Billet{
    constructor(GareArrivee, GareDepart, HeureDepart, HeureArrivee, DateDepart, DateArrivee , VilleDestination, VilleDepart, Prix, Train) {
        this.GareArrivee = GareArrivee;
        this.GareDepart = GareDepart;
        this.HeureDepart = HeureDepart;
        this.HeureArrivee = HeureArrivee;
        this.DateDepart = DateDepart;
        this.DateArrivee = DateArrivee;
        this.VilleDestination = VilleDestination;
        this.VilleDepart = VilleDepart;
        this.Prix = Prix;
        this.Train = Train
    }
}

module.exports = Billet