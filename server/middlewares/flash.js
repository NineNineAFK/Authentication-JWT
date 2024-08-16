const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'Aaditya@3737',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
