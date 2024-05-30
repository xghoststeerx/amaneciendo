const passport = require('passport');
const franqController = require('../controllers/franqController');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {
    
// Rutas para las franquicias
app.get('/api/franquicias/getAll', franqController.getAll);
app.post('/api/franquicias/create',  franqController.create);
app.put('/api/franquicias/update',  franqController.update);
app.delete('/api/franquicias/delete/:id_franquicia', franqController.delete);


}