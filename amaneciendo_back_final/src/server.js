const express = require('express');
const app = express();
const http = require('http');
require('dotenv').config();
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const io = require('socket.io')(server);
const mercadopago = require('mercadopago');
const sequelize = require('./config/database');
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN
});

/*
 * IMPORTTAR SOCKETS
 */
const ordersSocket = require('./sockets/ordersSocket');

/*
 * IMPORTAR RUTAS
 */
const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');
const estancoRoutes = require('./routes/estancoRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const franquiciaRoutes = require('./routes/franqRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const bankRoutes = require('./routes/bankRoutes');
const session = require('express-session');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use(cors());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.disable('x-powered-by');

app.set('port', port);

/*
 * LLAMADO A LOS SOCKETS
 */
ordersSocket(io);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Directorio donde se almacenarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Nombre original del archivo
    }
  });
  
const upload = multer({ storage: storage });
/*
 * LLAMADO DE LAS RUTAS
 */
usersRoutes(app, upload);
categoriesRoutes(app, upload);
addressRoutes(app);
productRoutes(app, upload);
orderRoutes(app);
mercadoPagoRoutes(app);
estancoRoutes(app, upload);
franquiciaRoutes(app);
zoneRoutes(app);
notificationRoutes(app);
searchRoutes(app);
bankRoutes(app)
sequelize.sync()
  .then(() => {
    server.listen(3000, '192.168.80.17' || 'localhost', function() {
      console.log('Aplicacion de NodeJS ' + port + ' Iniciada...');
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar con la base de datos:', error);
  });
// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

module.exports = {
    app: app,
    server: server
}
// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR