let app = require('../app');

const { body, validationResult } = require('express-validator');
let { format } = require('date-fns');

let ticketsService = require('../services/ticketsService');
let {
   isAuthenticated,
   isFormateurOrAuteur,
} = require('../services/authService');

function toTicketDto(ticket) {
   let copie = { ...ticket };
   copie.creation_formatted = format(ticket.creation, 'dd/MM/yyyy HH:mm');
   if (ticket.description && ticket.description.length > 50) {
      copie.description = ticket.description.substring(0, 50) + '...';
   } else {
      copie.description = ticket.description || '';
   }
   return copie;
}

app.get(['/', '/tickets'], async (req, res) => {
   let tickets = await ticketsService.findTickets();

   for (let i = 0; i < tickets.length; i++) {
      tickets[i] = toTicketDto(tickets[i]);
   }

   res.render('liste-tickets', { tickets, session: req.session });
});

// Liste des tickets
app.get(['/', '/tickets'], async (req, res) => {
   let tickets = await ticketsService.findTickets();
   tickets = tickets.map(toTicketDto);
   res.render('liste-tickets', { tickets, session: req.session });
});

/* Affichage de la page d'ajout de ticket */
app.get('/tickets/ajouter', isAuthenticated, function (req, res) {
   res.render('formulaire-ticket', {
      session: req.session,
      titre: 'Nouveau ticket',
      ticket: null,
   });
});

/* Affichage de la page détail d'un ticket */
app.get('/tickets/:id', async function (req, res) {
   const ticket = await ticketsService.findTicketById(req.params.id);

   if (!ticket) {
      console.warn(`Ticket non trouvé : ${req.params.id}`);
      return res.status(404).send('Ticket non trouvé');
   }

   res.render('detail-ticket', {
      session: req.session,
      ticket: ticket,
   });
});

/* Enregistrement d'un ticket */
app.post(
   '/tickets/enregistrer',
   isAuthenticated,
   body('titre').trim().notEmpty().withMessage('Champ obligatoire'),
   body('titre').trim().isLength({ max: 50 }).withMessage('Maximum 50 caractères'),
   body('description')
      .trim()
      .isLength({ min: 3 }).withMessage('Minimum 3 caractères')
      .isLength({ max: 2000 }).withMessage('Maximum 2000 caractères'),
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.render('formulaire-ticket', {
            titre: req.body._id ? 'Modification ticket' : 'Nouveau ticket',
            session: req.session,
            ticket: req.body,
            errors: errors.array(),
         });
      }

      const auteur = req.session.user;

      try {
         if (!req.body._id) {
            await ticketsService.addTicket(
               req.body.titre,
               auteur,
               req.body.description
            );
         } else {
            await ticketsService.updateTicket(
               req.body._id,
               req.body.titre,
               req.body.description
            );
         }
         return res.redirect('/tickets');
      } catch (error) {
         console.error("Erreur lors de l'enregistrement du ticket:", error);
         res.render('formulaire-ticket', {
            titre: req.body._id ? 'Modification ticket' : 'Nouveau ticket',
            session: req.session,
            ticket: req.body,
            errors: [{ msg: "Erreur serveur lors de l'enregistrement du ticket" }],
         });
      }
   }
);

/* Suppression d'un ticket */
app.get(
   '/tickets/:id/supprimer',
   isFormateurOrAuteur,
   async function (req, res, next) {
      await ticketsService.deleteTicket(req.params.id);
      res.redirect('/tickets');
   }
);

/* Affichage de la page de modification de ticket */
app.get('/tickets/:id/modifier', isAuthenticated, async function (req, res) {
   const ticket = await ticketsService.findTicketById(req.params.id);
   if (!ticket) {
      console.warn(`Ticket à modifier non trouvé : ${req.params.id}`);
      return res.status(404).send('Ticket non trouvé');
   }
   res.render('formulaire-ticket', {
      session: req.session,
      titre: 'Modification ticket',
      ticket: ticket,
   });
});
