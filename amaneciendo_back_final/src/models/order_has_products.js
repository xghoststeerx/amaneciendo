const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./order");
const Product = require("./product");

const OrderHasProducts = sequelize.define("order_has_products", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_order",
    references: {
      model: Order,
      key: "id",
    },
  },
  productId: {
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
});

OrderHasProducts.belongsTo(Order, { foreignKey: "orderId" });
OrderHasProducts.belongsTo(Product, { foreignKey: "productId" });
Order.belongsToMany(Product, { through: OrderHasProducts, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderHasProducts, foreignKey: "productId" });

OrderHasProducts.create = async (orderId, productId, quantity) => {
  try {
    const newOrderHasProducts = await OrderHasProducts.create({
      orderId,
      productId,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newOrderHasProducts.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = OrderHasProducts;