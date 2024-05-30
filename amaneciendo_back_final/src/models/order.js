const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Address = require("./address");
const Estanco = require("./estancoModel");
const Estate = require("./estate");
const Product = require("./product");

const Order = sequelize.define(
  "orders",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idClient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_client",
      references: {
        model: User,
        key: "id",
      },
    },
    idAddress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_address",
      references: {
        model: Address,
        key: "id",
      },
    },
    idDelivery: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "id_delivery",
      references: {
        model: User,
        key: "id",
      },
    },
    idEstanco: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_estanco",
      references: {
        model: Estanco,
        key: "id_estanco",
      },
    },
    idEstate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_estate",
      references: {
        model: Estate,
        key: "id",
      },
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "payment_method",
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "order_id",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_price",
    },
    codeDelivery: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "code_delivery",
    },
    codeClient: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "code_client",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    tableName: "orders",
  }
);

Order.belongsTo(User, { as: "Client", foreignKey: "idClient" });
Order.belongsTo(User, { as: "Delivery", foreignKey: "idDelivery" });
Order.belongsTo(Address, { foreignKey: "idAddress" });
Order.belongsTo(Estanco, { foreignKey: "idEstanco" });
Order.belongsTo(Estate, { foreignKey: "idEstate" });

const OrderProduct = sequelize.define(
  "order_has_products",
  {
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_order",
      references: {
        model: Order,
        key: "id",
      },
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_product",
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    tableName: "order_has_products",
  }
);

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: "idOrder" });
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "idProduct",
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

Order.findByStatus = async (status) => {
  try {
    const orders = await Order.findAll({
      where: { status },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Client",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Product,
          through: { attributes: ["quantity"] },
          attributes: [
            "id",
            "name",
            "description",
            "image1",
            "image2",
            "image3",
            "price",
          ],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.findByDeliveryAndStatus = async (idDelivery, status) => {
  try {
    const orders = await Order.findAll({
      where: { idDelivery, status },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Client",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Product,
          through: { attributes: ["quantity"] },
          attributes: [
            "id",
            "name",
            "description",
            "image1",
            "image2",
            "image3",
            "price",
          ],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.findByClientAndStatus = async (idClient, status) => {
  try {
    const orders = await Order.findAll({
      where: { idClient, status },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Client",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Product,
          through: { attributes: ["quantity"] },
          attributes: [
            "id",
            "name",
            "description",
            "image1",
            "image2",
            "image3",
            "price",
          ],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.createOrder = async (orders) => {
  try {
    const createdOrders = [];
    // Verificar si ya existe una orden con el mismo orderId
    const existingOrder = await Order.findOne({
      where: { orderId: orders[0].order_id },
    });
    if (existingOrder) {
      console.log(
        `La orden con orderId ${orders[0].order_id} ya ha sido ejecutada.`
      );
      // Retornar un mensaje indicando que la orden ya ha sido ejecutada
      throw new Error(
        `La orden con orderId ${orders[0].order_id} ya ha sido ejecutada.`
      );
    }
    for (const order of orders) {
      // Si no existe una orden con el mismo orderId, crear la nueva orden
      const newOrder = await Order.create({
        idClient: order.id_client,
        idAddress: order.id_address,
        idEstate: order.id_estate,
        idEstanco: order.id_estanco,
        paymentMethod: order.payment_method,
        orderId: order.order_id,
        totalPrice: order.total_price,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const products = order.productos;

      for (const product of products) {
        await OrderProduct.create({
          idOrder: newOrder.id,
          idProduct: product.id_ep,
          quantity: product.quantity,
          price: product.price,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      createdOrders.push(newOrder.id);
    }
    return createdOrders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.updateToDispatched = async (idOrder, idDelivery) => {
  try {
    await Order.update(
      {
        idDelivery,
        status: "DESPACHADO",
        updatedAt: new Date(),
      },
      { where: { id: idOrder } }
    );
    return idOrder;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.updateToOnTheWay = async (idOrder, idDelivery) => {
  try {
    await Order.update(
      {
        idDelivery,
        status: "EN CAMINO",
        updatedAt: new Date(),
      },
      { where: { id: idOrder } }
    );
    return idOrder;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.updateToDelivered = async (idOrder, idDelivery) => {
  try {
    await Order.update(
      {
        idDelivery,
        status: "ENTREGADO",
        updatedAt: new Date(),
      },
      { where: { id: idOrder } }
    );
    return idOrder;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.findByDelivery = async (idDelivery) => {
  try {
    const orders = await Order.findAll({
      where: { idDelivery },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Client",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Estanco,
          attributes: [
            "id_estanco",
            "nombre_estanco",
            "direccion_estanco",
            "barrio",
            "telefono_estanco",
            "imagen_estanco",
            "logo_estanco",
            "descripcion",
            "hora_estanco",
            "horario_estanco",
            "latitud",
            "longitud",
          ],
        },
        { model: Estate, attributes: ["id", "status"] },
        {
          model: Product,
          through: {
            model: OrderProduct,
            attributes: ["quantity", "price"],
          },
          attributes: ["id", "name", "description", "image", "price"],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Order.getOrderAddresses = async (orderId) => {
  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Estanco,
          include: [{
            model: Address,
            attributes: ['address', 'neighborhood', 'lat', 'lng', 'post_code', 'city'],
            where: {
              id_user: Sequelize.col('estanco.id_usuario')
            }
          }]
        },
        {
          model: User,
          as: 'Client',
          include: [{ model: Address, attributes: ['address', 'neighborhood', 'lat', 'lng', 'post_code', 'city'] }]
        },
        {
          model: User,
          as: 'Delivery',
          include: [{ model: Address, attributes: ['address', 'neighborhood', 'lat', 'lng', 'post_code', 'city'] }]
        }
      ]
    });

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    const estancoAddressData = order.estanco.address;
    const clientAddressData = order.Client.addresses[0];
    const deliveryAddressData = order.Delivery.addresses[0];

    return {
      clientAddress: clientAddressData,
      estancoAddress: estancoAddressData,
      deliveryAddress: deliveryAddressData
    };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Order.findByClient = async (idClient) => {
  try {
    const orders = await Order.findAll({
      where: { idClient },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Estanco,
          attributes: [
            "id_estanco",
            "nombre_estanco",
            "direccion_estanco",
            "barrio",
            "telefono_estanco",
            "imagen_estanco",
            "logo_estanco",
            "descripcion",
            "hora_estanco",
            "horario_estanco",
            "latitud",
            "longitud",
          ],
        },
        { model: Estate, attributes: ["id", "status"] },
        {
          model: Product,
          through: {
            model: OrderProduct,
            attributes: ["quantity", "price"],
          },
          attributes: ["id", "name", "description", "image", "price"],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.findByEstanco = async (idEstanco) => {
  try {
    const orders = await Order.findAll({
      where: { idEstanco },
      include: [
        {
          model: Address,
          attributes: ["id", "address", "neighborhood", "lat", "lng"],
        },
        {
          model: User,
          as: "Client",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: User,
          as: "Delivery",
          attributes: ["id", "name", "lastname", "image", "phone"],
        },
        {
          model: Estanco,
          attributes: [
            "id_estanco",
            "nombre_estanco",
            "direccion_estanco",
            "barrio",
            "telefono_estanco",
            "imagen_estanco",
            "logo_estanco",
            "descripcion",
            "hora_estanco",
            "horario_estanco",
            "latitud",
            "longitud",
          ],
        },
        { model: Estate, attributes: ["id", "status"] },
        {
          model: Product,
          through: {
            model: OrderProduct,
            attributes: ["quantity", "price"],
          },
          attributes: ["id", "name", "description", "image", "price"],
        },
      ],
    });
    return orders;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Order.modifyEstadoAccepted = async (idOrder, idEstate) => {
  try {
    const generatedCode = generateVerificationCode();
    await Order.update(
      {
        idEstate,
        updatedAt: new Date(),
        codeDelivery: generatedCode,
      },
      { where: { id: idOrder } }
    );
    return { id: idOrder, idEstate };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.modifyEstadoAcceptedEmpresario = async (
  idOrder,
  idEstate,
  idDelivery
) => {
  try {
    const codeDelivery = generateVerificationCode();
    await Order.update(
      {
        idEstate,
        updatedAt: new Date(),
        idDelivery,
        codeDelivery,
      },
      { where: { id: idOrder } }
    );
    return { id: idOrder, idEstate, idDelivery };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.modifyEstadoAgree = async (id, code, id_estate) => {
  try {
    const codeClient = generateVerificationCode();
    await Order.update(
      {
        idEstate: id_estate,
        updatedAt: new Date(),
        codeClient,
      },
      { where: { id, codeDelivery: code } }
    );
    return { id, id_estate, code };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.modifyEstadoDeliver = async (id, code, id_estate) => {
  try {
    await Order.update(
      {
        idEstate: id_estate,
        updatedAt: new Date(),
      },
      { where: { id, codeClient: code } }
    );
    return { id, id_estate, code };
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Order.findAvailable = async () => {
  try {
    const deliveryPersons = await User.findAll({
      where: { rol: "2" },
    });
    return deliveryPersons;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Order;
