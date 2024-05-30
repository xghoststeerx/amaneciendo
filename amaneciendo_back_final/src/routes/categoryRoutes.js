const categoriesController = require('../controllers/categoriesController');
const passport = require('passport');
const verifyToken = require('../config/verifyToken');
module.exports = (app, upload) => {

    app.get('/api/categories/getAll', categoriesController.getAll);
    app.get('/api/categories/getByEstanco/:id_estanco', categoriesController.getByEstanco);
    app.post('/api/categories/createWithImage', upload.array('image', 1), categoriesController.createWithImage);
    app.post('/api/categories/create', upload.array('image', 1), categoriesController.create);
    app.post('/api/categories/createCategoryEstanco', categoriesController.createCategoryEstanco);
    app.put('/api/categories/updateWithImage', verifyToken , upload.array('image', 1), categoriesController.updateWithImage);
    app.put('/api/categories/update', verifyToken , categoriesController.update);
    app.delete('/api/categories/delete/:id', verifyToken, categoriesController.delete);

}