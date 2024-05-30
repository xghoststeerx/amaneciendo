const verifyToken = require('../config/verifyToken');
const OrdersController = require('../controllers/ordersController');
module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/orders/addresses/:orderId', verifyToken, OrdersController.getOrderAddresses);
    app.get('/api/orders/findByStatus/:status',  verifyToken, OrdersController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',  verifyToken, OrdersController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status',  verifyToken, OrdersController.findByClientAndStatus);
    app.get('/api/orders/findOrdersByDeliveryUser/:id_delivery',  verifyToken, OrdersController.findByDelivery);
    app.get('/api/orders/findOrdersByClientUser/:id_client', verifyToken, OrdersController.findByClient);
    app.get('/api/orders/findOrdersByEstancoUser/:id_estanco',verifyToken, OrdersController.findByEstanco);
    app.post('/api/orders/create',  verifyToken, OrdersController.create);
    app.put('/api/orders/modifyEstadoAccepted/:id/:idEstate',  verifyToken, OrdersController.modifyEstadoAccepted);
    app.put('/api/orders/modifyEstadoAcceptedEmpresario/:id', OrdersController.modifyEstadoEmpresario);
    app.put('/api/orders/modifyEstadoAgree/:id',  verifyToken, OrdersController.modifyEstadoAgree);
    app.put('/api/orders/modifyEstadoDeliver/:id',  verifyToken, OrdersController.modifyEstadoDeliver);
    app.put('/api/orders/updateToDispatched',  verifyToken, OrdersController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay',  verifyToken, OrdersController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivered',  verifyToken, OrdersController.updateToDelivered);
    //delivery
    app.get('/api/orders/available', verifyToken, OrdersController.findAvailable);
}