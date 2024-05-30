
const zonaController = require('../controllers/zonaController');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {


// Rutas para las zonas
// app.get('/api/zonas/findByZonas/:id_categor', verifyToken, zonaController.findByZonas);
app.get('/api/zonas/getAll', zonaController.getAll);
// app.post('/api/zonas/create', verifyToken, zonaController.create);
// app.put('/api/zonas/update', verifyToken , zonaController.update);
// app.delete('/api/zonas/delete/:id', verifyToken, zonaController.delete);

}