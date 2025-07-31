const app = require('../app');
const usersService = require('../services/usersService');

/* Afficher l'écran de connexion */
app.get('/login', function (req, res) {
   res.render('login', {
      session: req.session,
   });
});

app.post('/login', function (req, res) {
   const { username, password } = req.body;

   const user = usersService.findUserByUsernameAndPassword(username, password);

   if (user) {
      req.session.user = user;
      res.redirect('/tickets');
   } else {
      res.status(401).render('login', {
         session: req.session,
         erreurConexion: 'Identifiant ou mot de passe incorrect',
      });
   }
});

/* Se déconnecter */
app.get('/logout', function (req, res, next) {
   if (req.session) {
      req.session.user = undefined;
      req.session.destroy(() => {
         console.log('session destroyed');
      });
   }

   res.redirect('/tickets');
});
