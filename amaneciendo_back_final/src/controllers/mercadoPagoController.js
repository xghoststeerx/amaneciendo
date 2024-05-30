const mercadopago = require("mercadopago");
const Order = require("../models/order");
const OrderHasProducts = require("../models/order_has_products");
require('dotenv').config();
const axios = require('axios');
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});
const BASE_URL = 'https://api.mercadopago.com';
module.exports = {
  async createPayment(req, res) {
    let payment = req.body;

    console.log("PAYMENT: ", payment);

    const payment_data = {
      token: payment.token,
      issuer_id: payment.issuer_id,
      payment_method_id: payment.payment_method_id,
      transaction_amount: payment.transaction_amount,
      installments: parseInt(payment.installments),
      payer: {
        email: payment.payer.email,
        identification: {
          type: payment.payer.identification.type,
          number: payment.payer.identification.number,
        },
      },
    };

    const data = await mercadopago.payment.create(payment_data).catch((err) => {
      console.log("Error de mercado pago", err);
      return res.status(501).json({
        success: false,
        message: "Error al crear el pago",
        error: err,
      });
    });

    if (data !== undefined && data !== null) {
      console.log("Los datos del cliente son correctos", data.response);

      const order = payment.order;

      Order.create(order, async (err, id) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Hubo un error al momento de crear la orden",
            error: err,
          });
        }

        for (const product of order.products) {
          await OrderHasProducts.create(
            id,
            product.id,
            product.quantity,
            (err, id_data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message:
                    "Hubo un error con la creacion de los productos en la orden",
                  error: err,
                });
              }
            }
          );
        }

        return res.status(201).json({
          success: true,
          message: "La orden se ha creado correctamente",
          data: data.response,
        });
      });
    } else {
      return res.status(501).json({
        success: false,
        message: "Error con algun dato en la peticion",
      });
    }
  },
  async createPreference(req, res) {
    const { items, payer } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Los datos del carrito son inválidos",
      });
    }

    const preference = {
      items: items.map((item) => ({
        title: item.title,
        unit_price: 2000,
        quantity: item.quantity,
      })),
      payer: {
        email: payer.email,
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex",
          },
        ],
        excluded_payment_types: [
          {
            id: "atm",
          },
        ],
        installments: 1,
      },
      back_urls: {
        success: "exp://192.168.80.17:19000/--/payment/success",
        failure: "exp://192.168.80.17:19000/--/payment/failure",
        pending: "exp://192.168.80.17:19000/--/payment/pending",
      },
      auto_return: "approved",
      notification_url: "https://www.your-site.com/webhook",
    };

    try {
      const response = await axios.post(`${BASE_URL}/checkout/preferences`, preference, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      });

      const preferenceId = response.data.id;
      const initPoint = response.data.init_point;
      console.log("Preference ID:", preferenceId);
      console.log("Init Point:", initPoint);
      res.status(200).json({ success: true, preferenceId, initPoint });
    } catch (error) {
      console.log("Error al crear la preferencia de pago:", error.response.data);
      res.status(500).json({
        success: false,
        message: "Error al crear la preferencia de pago",
        error: error.response.data,
      });
    }
  },
};
