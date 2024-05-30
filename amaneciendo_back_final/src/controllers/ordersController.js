const Order = require("../models/order");
const OrderHasProducts = require("../models/order_has_products");
const Notification = require("../models/notification");
const { sendOrderNotificationEmail } = require("../utils/verificationUtils");
module.exports = {
  async findByStatus(req, res) {
    try {
      const status = req.params.status;
      const orders = await Order.findByStatus(status);
      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Hubo un error al listar las órdenes",
        error: error.message,
      });
    }
  },

  async findByDeliveryAndStatus(req, res) {
    try {
      const idDelivery = req.params.id_delivery;
      const status = req.params.status;
      const orders = await Order.findByDeliveryAndStatus(idDelivery, status);
      return res.status(200).json(orders);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al listar las órdenes",
        error: error.message,
      });
    }
  },

  async findByClientAndStatus(req, res) {
    try {
      const idClient = req.params.id_client;
      const status = req.params.status;
      const orders = await Order.findByClientAndStatus(idClient, status);
      return res.status(200).json(orders);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al listar las órdenes",
        error: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const orders = req.body;
      const orderIds = await Order.createOrder(orders);
      await sendOrderNotificationEmail(req.user.email, orders);
      return res.status(201).json({
        success: true,
        message: "Las órdenes se han creado correctamente",
        data: orderIds,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al crear las órdenes",
        error: error.message,
      });
    }
  },

  async updateToDispatched(req, res) {
    try {
      const { id, idDelivery } = req.body;
      const idOrder = await Order.updateToDispatched(id, idDelivery);
      return res.status(200).json({
        success: true,
        message: "La orden se ha actualizado correctamente",
        data: idOrder,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar la orden",
        error: error.message,
      });
    }
  },

  async updateToOnTheWay(req, res) {
    try {
      const { id, idDelivery } = req.body;
      const idOrder = await Order.updateToOnTheWay(id, idDelivery);
      return res.status(200).json({
        success: true,
        message: "La orden se ha actualizado correctamente",
        data: idOrder,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar la orden",
        error: error.message,
      });
    }
  },

  async updateToDelivered(req, res) {
    try {
      const { id, idDelivery } = req.body;
      const idOrder = await Order.updateToDelivered(id, idDelivery);
      return res.status(200).json({
        success: true,
        message: "La orden se ha actualizado correctamente",
        data: idOrder,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar la orden",
        error: error.message,
      });
    }
  },

  async findByDelivery(req, res) {
    try {
      const idDelivery = req.params.id_delivery;
      const orders = await Order.findByDelivery(idDelivery);
      return res.status(200).json(orders);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener las órdenes por repartidor",
        error: error.message,
      });
    }
  },
  async getOrderAddresses(req, res) {
    try {
      const orderId = req.params.orderId;
      const addresses = await Order.getOrderAddresses(orderId);
      console.log("estas son las direcciones: " + JSON.stringify(addresses));
      return res.status(200).json(addresses);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener las direcciones de la orden",
        error: error.message,
      });
    }
  },

  async findByClient(req, res) {
    try {
      const idClient = req.params.id_client;
      const orders = await Order.findByClient(idClient);

      const formattedOrders = orders.map((order) => {
        return {
          id: order.id.toString(),
          id_client: order.idClient.toString(),
          id_address: order.idAddress.toString(),
          id_delivery: order.idDelivery ? order.idDelivery.toString() : null,
          id_estanco: order.idEstanco.toString(),
          codeDelivery: order.codeClient,
          status: order.estate.status,
          address: JSON.stringify({
            id: order.address.id.toString(),
            address: order.address.address,
            neighborhood: order.address.neighborhood,
            lat: order.address.lat,
            lnt: order.address.lng,
          }),
          delivery: order.Delivery
            ? JSON.stringify({
                id: order.Delivery.id.toString(),
                name: order.Delivery.name,
                lastname: order.Delivery.lastname,
                image: order.Delivery.image,
                phone: order.Delivery.phone,
              })
            : JSON.stringify({
                id: null,
                name: null,
                lastname: null,
                image: null,
                phone: null,
              }),
          estanco: JSON.stringify({
            id: order.estanco.id_estanco.toString(),
            nombre_estanco: order.estanco.nombre_estanco,
            direccion_estanco: order.estanco.direccion_estanco,
            barrio: order.estanco.barrio,
            telefono_estanco: order.estanco.telefono_estanco,
            imagen_estanco: order.estanco.imagen_estanco,
            logo_estanco: order.estanco.logo_estanco,
            descripcion: order.estanco.descripcion,
            hora_estanco: order.estanco.hora_estanco,
            horario_estanco: order.estanco.horario_estanco,
            latitud: order.estanco.latitud,
            longitud: order.estanco.longitud,
          }),
          product: order.products.map((product) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            quantity: product.order_has_products.quantity,
            orderProductPrice: product.order_has_products.price,
          })),
        };
      });
      return res.status(200).json(formattedOrders);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener las órdenes por cliente",
        error: error.message,
      });
    }
  },

  async findByEstanco(req, res) {
    try {
      const idEstanco = req.params.id_estanco;
      const orders = await Order.findByEstanco(idEstanco);
      const formattedOrders = orders.map((order) => {
        return {
          id: order.id.toString(),
          id_client: order.idClient.toString(),
          id_address: order.idAddress.toString(),
          id_delivery: order.idDelivery ? order.idDelivery.toString() : null,
          id_estanco: order.idEstanco.toString(),
          status: order.estate.status,
          address: JSON.stringify({
            id: order.address.id.toString(),
            address: order.address.address,
            neighborhood: order.address.neighborhood,
            lat: order.address.lat,
            lnt: order.address.lng,
          }),
          client: JSON.stringify({
            id: order.Client.id.toString(),
            name: order.Client.name,
            lastname: order.Client.lastname,
            image: order.Client.image,
            phone: order.Client.phone,
          }),
          delivery: order.Delivery
            ? JSON.stringify({
                id: order.Delivery.id.toString(),
                name: order.Delivery.name,
                lastname: order.Delivery.lastname,
                image: order.Delivery.image,
                phone: order.Delivery.phone,
              })
            : JSON.stringify({
                id: null,
                name: null,
                lastname: null,
                image: null,
                phone: null,
              }),
          estanco: JSON.stringify({
            id: order.estanco.id_estanco.toString(),
            nombre_estanco: order.estanco.nombre_estanco,
            direccion_estanco: order.estanco.direccion_estanco,
            barrio: order.estanco.barrio,
            telefono_estanco: order.estanco.telefono_estanco,
            imagen_estanco: order.estanco.imagen_estanco,
            logo_estanco: order.estanco.logo_estanco,
            descripcion: order.estanco.descripcion,
            hora_estanco: order.estanco.hora_estanco,
            horario_estanco: order.estanco.horario_estanco,
            latitud: order.estanco.latitud,
            longitud: order.estanco.longitud,
          }),
          products: order.products.map((product) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            quantity: product.order_has_products.quantity,
            orderProductPrice: product.order_has_products.price,
          })),
        };
      });
  
      console.log(
        "estas son las ordenes formateadas: " + JSON.stringify(formattedOrders)
      );
      return res.status(200).json(formattedOrders);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener las órdenes por estanco",
        error: error.message,
      });
    }
  },

  async modifyEstadoAccepted(req, res) {
    try {
      const { id, idEstate } = req.params;
      console.log(idEstate);
      const updatedOrder = await Order.modifyEstadoAccepted(id, idEstate);
      return res.status(200).json({
        success: true,
        message: "El estado de la orden se ha actualizado correctamente",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar el estado de la orden",
        error: error.message,
      });
    }
  },

  async modifyEstadoEmpresario(req, res) {
    try {
      const { id } = req.params;
      const { id_delivery } = req.body;
      console.log("estas son las id: " + id +" segunda id: " + id_delivery);
      const idEstate = 2;
      const updatedOrder = await Order.modifyEstadoAcceptedEmpresario(
        id,
        idEstate,
        id_delivery
      );

      // Crear una notificación
      const notification = {
        titulo: "Orden Solicitada",
        visto: false,
        id_user: id_delivery,
        accion: `Tu orden #${id} está en proceso de aceptación por un delivery.`,
      };
      await Notification.createNotification(notification);

      return res.status(200).json({
        success: true,
        message:
          "El estado de la orden se ha actualizado correctamente y se ha asignado un delivery.",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar el estado de la orden",
        error: error.message,
      });
    }
  },

  async modifyEstadoAgree(req, res) {
    try {
      const { id } = req.params;
      const { code, id_estate } = req.body;
      console.log(id, code, id_estate);
      const updatedOrder = await Order.modifyEstadoAgree(id, code, id_estate);
      return res.status(200).json({
        success: true,
        message: "El estado de la orden se ha actualizado correctamente",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar el estado de la orden",
        error: error.message,
      });
    }
  },

  async modifyEstadoDeliver(req, res) {
    try {
      const { id } = req.params;
      const { code, id_estate } = req.body;
      const updatedOrder = await Order.modifyEstadoDeliver(id, code, id_estate);
      return res.status(200).json({
        success: true,
        message: "El estado de la orden se ha actualizado correctamente",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al actualizar el estado de la orden",
        error: error.message,
      });
    }
  },

  async findAvailable(req, res) {
    try {
      const deliveryPersons = await Order.findAvailable();
      return res.status(200).json(deliveryPersons);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener los repartidores disponibles",
        error: error.message,
      });
    }
  },
};
