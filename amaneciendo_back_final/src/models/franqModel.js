const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Franquicia = sequelize.define("franquicia", {
  id_franquicia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_franquicia: {
    type: DataTypes.STRING,
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
  tableName: "franquicia",
});

Franquicia.getAll = async () => {
  try {
    const franquicias = await Franquicia.findAll({
      attributes: ["id_franquicia", "nombre_franquicia"],
    });
    return franquicias;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Franquicia.create = async (franquicia) => {
  try {
    const newFranquicia = await Franquicia.create({
      nombre_franquicia: franquicia.nombre_franquicia,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newFranquicia.id_franquicia;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Franquicia.update = async (franquicia) => {
  try {
    await Franquicia.update(
      {
        nombre_franquicia: franquicia.nombre_franquicia,
        updatedAt: new Date(),
      },
      { where: { id_franquicia: franquicia.id_franquicia } }
    );
    return franquicia.id_franquicia;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Franquicia.delete = async (id_franquicia) => {
  try {
    await Franquicia.destroy({ where: { id_franquicia } });
    return id_franquicia;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Franquicia;