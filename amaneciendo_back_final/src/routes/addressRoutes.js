const addressController = require('../controllers/addressController');
const passport = require('passport');
const verifyToken = require('../config/verifyToken');

module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS


    app.get('/api/address/findByUser/:id_user',  verifyToken, addressController.findByUser);
    app.post('/api/address/create',  verifyToken, addressController.create);
    app.delete('/api/address/delete/:id', verifyToken, addressController.delete);
    app.put('/api/address/update/:id', verifyToken, addressController.update);


}