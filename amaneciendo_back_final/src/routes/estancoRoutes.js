const passport = require('passport');
const estancoController = require('../controllers/estancoController');
module.exports = (app, upload) => {

    // Rutas para las franquicias
    app.get('/api/estanco/findByEstanco/:id_zona', estancoController.findByEstanco);
    app.get('/api/estanco/findEstancoByUser/:id_usuario', estancoController.findEstancoByUser);
    app.get('/api/estanco/listarEstancos', estancoController.listarEstanco);
    app.get('/api/estanco/findByEstancozona/:id_zona', estancoController.findByZona);
    app.post('/api/estanco/create', estancoController.create);
    app.post('/api/estanco/createWithImage', upload.array('imagen_estanco', 1), estancoController.createWithImage);
    app.put('/api/estanco/update', estancoController.update);
    app.put('/api/estanco/updateWithImage', upload.array('imagen_estanco', 1), estancoController.updateWithImage);
    app.delete('/api/estanco/delete/:id_estanco', estancoController.delete);

}