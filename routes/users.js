const middlewares = require('../middlewares/authMiddleware');
const users = require('../data/users');

const routes = (app) => {
    app.get('/', (req, res) => {
        if(req.session.token) {
            res.send(`
            <a href="/dashboard">Dashboard</a>
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesión</button>
            </form>
            `);
        } else {
            res.send(`
                <form action="/login" method="post">
                    <label for="username">Usuario:</label>
                    <input type="text" id="username" name="username" required><br>
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required><br>
                    <button type="submit">Iniciar sesión</button>
                </form>
                <a href="/dashboard">Dashboard</a>
            `);
        };
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body; 
        const user = users.users.find(
          (user) => user.username === username && user.password === password
        );
      
        if (user) {
          const token = middlewares.generateToken(user);
          req.session.token = token;
          res.redirect('/dashboard');
        } else {
          res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });

    app.get('/dashboard', middlewares.verifyToken, (req, res) => {
        const userId = req.user;
        const user = users.users.find((user) => user.id === userId);
      
        if (user) {
          res.send(
            ` <h1>Bienvenido, ${user.name}!</h1> <p>ID: ${user.id}</p> <p>Usuario: ${user.username}</p> <br> <form action="/logout" method="post"> <button type="submit">Cerrar sesión</button> </form> <a href="/">home</a> `
          );
        } else {
          res.status(401).json({ message: 'Usuario no encontrado' });
        }
    });

    app.post('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });
};

module.exports = {routes}