const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Zona = sequelize.define(
  "zona",
  {
    id_zona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id_zona",
    },
    tipo_zona: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "tipo_zona",
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
    tableName: "zona",
  }
);

Zona.getAll = async () => {
  try {
    const zonas = await Zona.findAll({
      attributes: ["id_zona", "tipo_zona"],
    });
    console.log("estas son las zonas: " + JSON.stringify(zonas));
    return zonas;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Zona.findByZonas = async (idZonas) => {
  try {
    const zonas = await Zona.findAll({
      where: { id_zona: idZonas },
      attributes: ["id_zona", "tipo_zona"],
    });
    return zonas;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Zona.create = async (zona) => {
  try {
    const newZona = await Zona.create({
      tipo_zona: zona.tipo_zona,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newZona.id_zona;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Zona.update = async (zona) => {
  try {
    await Zona.update(
      {
        tipo_zona: zona.tipo_zona,
        updatedAt: new Date(),
      },
      {
        where: { id_zona: zona.id_zona },
      }
    );
    return zona.id_zona;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Zona.delete = async (id_zona) => {
  try {
    await Zona.destroy({
      where: { id_zona },
    });
    return id_zona;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Zona;
