const EtatTicket = Object.freeze({
   OUVERT: 'ouvert',
   CLOS: 'clos',
   TOUS: 'tous',
});

class Ticket {
   constructor(id, titre, auteur, description, creation) {
      this.id = id;
      this.titre = titre;
      this.auteur = auteur;
      this.description = description;
      this.creation = creation;
      this.etat = EtatTicket.OUVERT;
   }
}

module.exports = { Ticket, EtatTicket };
