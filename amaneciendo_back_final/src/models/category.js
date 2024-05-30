const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Estanco = require("./estancoModel");
const User = require("./user");

const Category = sequelize.define("categories", {
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
  image: {
    type: DataTypes.STRING,
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
  tableName: "categories",
  timestamps: false,
});

const CategoryEstanco = sequelize.define("category_estanco", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "category_id",
    references: {
      model: Category,
      key: "id",
    },
  },
  estancoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "estanco_id",
    references: {
      model: Estanco,
      key: "id_estanco",
    },
  },
}, {
  tableName: "category_estanco",
  timestamps: false,
});

Category.belongsToMany(Estanco, {
  through: CategoryEstanco,
  foreignKey: "categoryId",
  otherKey: "estancoId",
});

Estanco.belongsToMany(Category, {
  through: CategoryEstanco,
  foreignKey: "estancoId",
  otherKey: "categoryId",
});

Category.getAll = async () => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "image"],
      order: [["name", "ASC"]],
    });
    return categories;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Category.getByEstanco = async (estancoId) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Estanco,
          where: { id_estanco: estancoId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "name", "description", "image"],
    });
    return categories;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Category.createCategory = async (category) => {
  console.log("Creating category" + category)
  try {
    const newCategory = await Category.create({
      name: category.name,
      description: category.description,
      image: category.image,
      userId: category.userId, 
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newCategory.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Category.createCategoryEstanco = async (categoryId, estancoId) => {
  try {
    await sequelize.query(
      'INSERT INTO category_estanco (category_id, estanco_id) VALUES (?, ?)',
      {
        replacements: [categoryId, estancoId],
        type: sequelize.QueryTypes.INSERT,
      }
    );
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Category.update = async (category) => {
  try {
    await Category.update(
      {
        name: category.name,
        description: category.description,
        image: category.image,
        updatedAt: new Date(),
      },
      { where: { id: category.id } }
    );
    return category.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Category.delete = async (id) => {
  try {
    await Category.destroy({ where: { id } });
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Category;