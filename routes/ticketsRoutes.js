let app = require('../app');

const { body, validationResult } = require('express-validator');
let { format } = require('date-fns');

let ticketsService = require('../services/ticketsService');
let {
   isAuthenticated,
   isFormateurOrAuteur,
} = require('../services/authService');

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

function toTicketDto(ticket) {
   let copie = { ...ticket };
   copie.creation_formatted = format(ticket.creation, 'dd/MM/yyyy HH:mm');
   if (ticket.description && ticket.description.length > 50) {
      copie.description = ticket.description.substring(0, 50) + '...';
   } else {
      copie.description = '';
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
      /* TODO: si le ticket n'existe pas, on trace une erreur dans les logs */

      throw new Error('Le ticket ' + req.params.id + " n'a pas été trouvé");
   }

   res.render('detail-ticket', {
      session: req.session,
      ticket: ticket,
   });
});

app.post(
   '/tickets/enregistrer',
   isAuthenticated,
   body('titre').trim().notEmpty().withMessage('Champ obligatoire'),
   body('titre')
      .trim()
      .isLength({ max: 50 })
      .withMessage('Maximum 50 caractères'),
   body('description')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Minimum 3 caractères')
      .isLength({ max: 2000 })
      .withMessage('Maximum 2000 caractères'),
   (req, res) => {
      logger.debug('post-/tickets/enregistrer-body : ', req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         res.render('formulaire-ticket', {
            titre: 'Modification ticket',
            session: req.session,
            ticket: req.body,
            errors: errors.array(),
         });
         logger.debug('post-/tickets/enregistrer-errors : ', errors.array());
         return;
      }
      logger.debug(
         "post-/tickets/enregistrer-req-pas d'erreur de validation : ",
         req.body,
      );
      const auteur = req.session.user;

      if (!req.body._id) {
         ticketsService.addTicket(req.body.titre, auteur, req.body.description);
      } else {
         ticketsService.updateTicket(
            req.body._id,
            req.body.titre,
            req.body.description,
         );
      }

      res.redirect('/tickets');
   },
);

/* Suppression d'un ticket */
app.get(
   '/tickets/:id/supprimer',
   isFormateurOrAuteur,
   function (req, res, next) {
      ticketsService.deleteTicket(req.params.id);

      res.redirect('/tickets');
   },
);

/* Affichage de la page de modification de ticket */
app.get('/tickets/:id/modifier', isAuthenticated, async function (req, res) {
   const ticket = await ticketsService.findTicketById(req.params.id);
   res.render('formulaire-ticket', {
      session: req.session,
      titre: 'Modification ticket',
      ticket: ticket,
   });
});
