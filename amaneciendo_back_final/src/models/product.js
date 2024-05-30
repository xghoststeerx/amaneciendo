const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("./category");

const Product = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: "id",
    },
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
  tableName: "products",
});

Product.belongsTo(Category, { foreignKey: "id_categoria" });
Category.hasMany(Product, { foreignKey: "id_categoria" });

Product.findByCategory = async (id_categoria) => {
  try {
    const products = await Product.findAll({
      where: { id_categoria },
      attributes: ["id", "name", "description", "price", "image"],
    });
    return products;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};


Product.createProduct = async (product) => {
  try {
    const newProduct = await Product.create({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      id_categoria: product.id_categoria,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newProduct.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Product.createProductWithEstancoAndCategory = async (product) => {
  try {
    const newProduct = await Product.create({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      id_categoria: product.id_categoria,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newProduct.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Product.update = async (product) => {
  try {
    await Product.update(
      {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
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

Product.delete = async (id) => {
  try {
    await Product.destroy({ where: { id } });
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Product;