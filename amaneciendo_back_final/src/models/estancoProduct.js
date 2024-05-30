const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");
const Estanco = require("./estancoModel");
const Product = require("./product");

const EstancoProduct = sequelize.define("estanco_products", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  id_estanco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estanco,
      key: "id_estanco",
    },
  },
  id_product: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
}, {
  tableName: "estanco_products",
});

EstancoProduct.belongsTo(Estanco, { foreignKey: "id_estanco" });
Estanco.hasMany(EstancoProduct, { foreignKey: "id_estanco" });

EstancoProduct.belongsTo(Product, { foreignKey: "id_product" });
Product.hasMany(EstancoProduct, { foreignKey: "id_product" });

EstancoProduct.findByCategoryAndEstanco = async (id_categoria, id_estanco) => {
  try {
    const products = await EstancoProduct.findAll({
      where: { id_estanco },
      include: [
        {
          model: Product,
          where: { id_categoria },
          attributes: ["id", "name", "description", "image"],
        },
      ],
    });
    return products;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
EstancoProduct.createProductWithEstancoAndCategory = async (product) => {
  console.log("Creating createProductWithEstancoAndCategory" + JSON.stringify(product));
  try {
    const newProduct = await EstancoProduct.create({
      id_estanco: product.estanco.id_estanco,
      id_product: product.id,
      price: product.price,
      quantity: product.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newProduct.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
EstancoProduct.delete = async (id) => {
  try {
    await EstancoProduct.destroy({ where: { id } });
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
EstancoProduct.updateData = async (product) => {
  try {
    await EstancoProduct.update(
      {
        price: product.price,
        quantity: product.image,
        updatedAt: new Date(),
      },
      { where: { id: product.id } }
    );
    return product.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
EstancoProduct.findAllByEstanco = async (id_estanco) => {
  try {
    const products = await EstancoProduct.findAll({
      where: { id_estanco },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "description", "image"],
        },
      ],
    });
    return products;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
module.exports = EstancoProduct;