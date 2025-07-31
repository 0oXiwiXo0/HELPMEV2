let ticketsService = require('./ticketsService');

module.exports.isAuthenticated = function isAuthenticated(req, res, next) {
   if (req.session?.user) {
      next(); // L'utilisateur est connecté, on continue
   } else {
      res.redirect('/login'); // Sinon, on redirige vers la page de login
   }
};

module.exports.isFormateurOrAuteur = async function isFormateurOrAuteur(
   req,
   res,
   next,
) {
   const ticket = await ticketsService.findTicketById(req.params.id);

   if (
      ticket &&
      req.session?.user &&
      (req.session.user.role === 'formateur' ||
         req.session.user._id === ticket.auteur._id)
   ) {
      next();
   } else {
      res.status(403).render('templates/principal', {
         bodyFragment: 'pages-fragments/erreur',
         session: req.session,
         error: {
            status: 403,
            message: '403 Forbidden',
         },
      });
   }
};
