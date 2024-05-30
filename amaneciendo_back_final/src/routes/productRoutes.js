const productController = require('../controllers/productsController');
const verifyToken = require('../config/verifyToken');
module.exports = (app, upload) => {

    app.get('/api/product/findByEstanco/:id_estanco',  productController.findByEstanco);
    app.get('/api/product/findByCategory/:id_categoria',  productController.findByCategory);
    app.get('/api/product/findByCategoryAndEstanco/:id_categoria',  productController.findByCategoryAndEstanco);
    app.get('/api/product/allProductsByEstanco', productController.allProductsByEstanco);
    app.post('/api/product/create', productController.create);
    app.post('/api/product/create-whith-estanco-and-category', productController.createWithEstancoAndCategory);
    app.post('/api/product/createWithImage', upload.array('image', 1), productController.createWithImage);
    app.put('/api/product/updateWithImage', upload.array('image', 1), productController.updateWithImage);
    app.put('/api/product/update',  productController.update);
    app.delete('/api/product/delete/:id',  productController.delete);
}