const { findTickets, setTickets } = require('../services/ticketsService');

const { EtatTicket } = require('../bo/Ticket');

describe('findTickets', () => {
   test('findTickets-tous les tickets triés par date de création asc', () => {
      //Arrange
      const tickets = [
         {
            id: 1,
            titre: 'Ticket 1',
            auteur: { name: 'Alice', id: 1 },
            description: 'Description du ticket 1',
            creation: new Date('2025-06-07T15:30:00Z'),
            etat: EtatTicket.OUVERT,
         },
         {
            id: 2,
            titre: 'Ticket 2',
            auteur: { name: 'Bob', id: 2 },
            description: 'Description du ticket 2',
            creation: new Date('2025-06-07T15:35:00Z'),
            etat: EtatTicket.CLOS,
         },
         {
            id: 3,
            titre: 'Ticket 3',
            auteur: { name: 'Joe', id: 3 },
            description: 'Description du ticket 3',
            creation: new Date('2025-06-08T15:05:00Z'),
            etat: EtatTicket.OUVERT,
         },
      ];
      setTickets(tickets);

      //Act
      const tabTickets = findTickets();

      // Vérifie que le tableau retourné a la bonne longueur
      expect(tabTickets).toHaveLength(3);

      // Vérifie le contenu du premier ticket
      expect(tabTickets[0]).toMatchObject({
         id: 1,
         titre: 'Ticket 1',
         auteur: { name: 'Alice', id: 1 },
         description: 'Description du ticket 1',
         etat: EtatTicket.OUVERT,
      });

      // Vérifie que le champ "creation" est bien une date
      expect(tabTickets[0].creation).toBeInstanceOf(Date);
      expect(tabTickets[0].creation.toISOString()).toBe(
         '2025-06-07T15:30:00.000Z',
      );

      // Vérifie que la modification du tableau retourné ne modifie pas l'original
      tabTickets.push({ id: 3, etat: EtatTicket.OUVERT });
      expect(findTickets()).toHaveLength(3);
   });
});
