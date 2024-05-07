const express = require('express');
const app = express();
const routesApp = require('./routes/users');
const session = require('express-session');
const crypto = require('./crypto/config');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: crypto.hashedSecret,
      resave: false, 
      saveUninitialized: true, 
      cookie: { secure: false },
    })
);

routesApp.routes(app);

app.listen(3000, () => {
    console.log(`Servidor en ejecución en http://localhost:3000`);
});
