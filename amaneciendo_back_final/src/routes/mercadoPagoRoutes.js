const mercadoPagoController = require('../controllers/mercadoPagoController');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {

    app.post('/api/payments/create',  verifyToken, mercadoPagoController.createPayment);
    app.post('/api/payments/create-preference',  verifyToken, mercadoPagoController.createPreference)

}