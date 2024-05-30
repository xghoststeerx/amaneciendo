const usersController = require('../controllers/usersController');

const verifyToken = require('../config/verifyToken');
module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/users/findDeliveryMen', verifyToken, usersController.findDeliveryMen);

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);
    app.post('/api/users/updatePassword', verifyToken, usersController.updatePassword);
    app.post('/api/users/updatePasswordWhithCode', verifyToken, usersController.verifyCode);

    
    // 401 UNAUTHORIZED
    app.put('/api/users/update', verifyToken , upload.array('image', 1), usersController.updateWithImage);
    app.put('/api/users/updateWithoutImage', verifyToken, usersController.updateWithoutImage);
    app.put('/api/users/updateNotificationToken', verifyToken, usersController.updateNotificationToken);


}