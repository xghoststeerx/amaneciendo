const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Estate = sequelize.define("estate", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},
{
  tableName: "estate",
});

// Métodos estáticos para obtener, crear, actualizar y eliminar estados
Estate.getAll = async () => {
  try {
    const estates = await Estate.findAll();
    return estates;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estate.getById = async (id) => {
  try {
    const estate = await Estate.findByPk(id);
    return estate;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estate.create = async (estateName) => {
  try {
    const newEstate = await Estate.create({
      state: estateName,
    });
    return newEstate.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estate.update = async (estate) => {
  try {
    await Estate.update(
      {
        state: estate.name,
      },
      {
        where: { id: estate.id },
      }
    );
    return estate.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estate.delete = async (id) => {
  try {
    await Estate.destroy({
      where: { id },
    });
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Estate;