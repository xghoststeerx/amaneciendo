const Notification = require('../models/notification');

module.exports = {
    async findByUser(req, res) {
        const userId = req.params.id;
        console.log(userId);
    
        Notification.findByUser(userId, (err, data) => {
          if (err) {
            return res.status(501).json({
              success: false,
              message: 'Hubo un error al obtener las notificaciones',
              error: err
            });
          }
    
          return res.status(201).json(data);
        });
      },
    
      async modifyEstateNotification(req, res) {
        const notificationId = req.params.id;
    
        Notification.modifyEstateNotification(notificationId, (err, id) => {
          if (err) {
            return res.status(501).json({
              success: false,
              message: 'Hubo un error al modificar el estado de la notificación',
              error: err
            });
          }
    
          return res.status(201).json({
            success: true,
            message: 'El estado de la notificación se modificó correctamente',
            data: `${id}`
          });
        });
      },
    
      async create(req, res) {
        const notification = req.body;
    
        Notification.create(notification, (err, id) => {
          if (err) {
            return res.status(501).json({
              success: false,
              message: 'Hubo un error al crear la notificación',
              error: err
            });
          }
    
          return res.status(201).json({
            success: true,
            message: 'La notificación se creó correctamente',
            data: `${id}`
          });
        });
      }
    
}