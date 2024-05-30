const NotificationsController = require('../controllers/notificationController');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {    
    app.get('/api/notifications/findByUser/:id',  verifyToken, NotificationsController.findByUser);
    app.post('/api/notifications/create',  verifyToken, NotificationsController.create);
    app.put('/api/notifications/modifyEstateNotification/:id',  verifyToken, NotificationsController.modifyEstateNotification);}