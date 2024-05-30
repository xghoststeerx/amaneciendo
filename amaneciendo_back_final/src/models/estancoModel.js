const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Zona = require("./zonaModel");
const Franquicia = require("./franqModel");
const Usuario = require("./user");
const Address = require("./address");

const Estanco = sequelize.define(
  "estanco",
  {
    id_estanco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_estanco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono_estanco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_zona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Zona,
        key: "id_zona",
      },
    },
    id_franquicia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Franquicia,
        key: "id_franquicia",
      },
    },
    imagen_estanco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo_estanco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hora_estanco: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    horario_estanco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id_usuario",
      },
    },
    id_address: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Address,
        key: "id",
      },
    },
  },
  {
    tableName: "estanco",
    timestamps: false,
  }
);
Estanco.belongsTo(Zona, { foreignKey: "id_zona" });
Zona.hasMany(Estanco, { foreignKey: "id_zona" });

Estanco.belongsTo(Franquicia, { foreignKey: "id_franquicia" });
Franquicia.hasMany(Estanco, { foreignKey: "id_franquicia" });

Estanco.belongsTo(Usuario, { foreignKey: "id_usuario" });
Usuario.hasMany(Estanco, { foreignKey: "id_usuario" });

Estanco.belongsTo(Address, { foreignKey: "id_address" });
Address.hasOne(Estanco, { foreignKey: "id_address" });

Estanco.findByEstanco = async (id_zona) => {
  try {
    const estanco = await Estanco.findAll({
      where: { id_zona },
      attributes: ["id_estanco", "nombre_estanco", "telefono_estanco", "id_zona", "id_franquicia", "imagen_estanco", "logo_estanco", "logo_estanco", "descripcion", "hora_estanco", "horario_estanco"],
      include: [
        {
          model: Zona,
          attributes: ["id_zona"],
        },
        {
          model: Address,
          attributes: ["address", "neighborhood", "city", "lat", "lng", "postCode"],
        },
        
      ],
    });
    return estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.findEstancoByUser = async (id_usuario) => {
  try {
    const estanco = await Estanco.findAll({
      where: { id_usuario },
      include: [
        {
          model: Address,
          attributes: ["address", "neighborhood", "city", "lat", "lng", "postCode"],
        },
      ],
    });
    return estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.listarEstanco = async () => {
  try {
    const estanco = await Estanco.findAll({
      include: [
        {
          model: Address,
          attributes: ["address", "neighborhood", "city", "lat", "lng", "postCode"],
        },
      ],
    });
    return estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.findByEstancozona = async (id_estanco) => {
  try {
    const estanco = await Estanco.findOne({
      where: { id_estanco },
      include: [
        {
          model: Address,
          attributes: ["address", "neighborhood", "city", "lat", "lng", "postCode"],
        },
      ],
    });
    return estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.createEstanco = async (estanco) => {
  try {
    const newEstanco = await Estanco.create({
      nombre_estanco: estanco.nombre_estanco,
      telefono_estanco: estanco.telefono_estanco,
      id_zona: estanco.id_zona,
      id_franquicia: estanco.id_franquicia,
      imagen_estanco: estanco.imagen_estanco,
      logo_estanco: estanco.logo_estanco,
      descripcion: estanco.descripcion,
      hora_estanco: estanco.hora_estanco,
      horario_estanco: estanco.horario_estanco,
      id_usuario: estanco.id_usuario,
      id_address: estanco.id_address,
    });
    return newEstanco.id_estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.update = async (estanco) => {
  try {
    await Estanco.update(
      {
        nombre_estanco: estanco.nombre_estanco,
        direccion_estanco: estanco.direccion_estanco,
        barrio: estanco.barrio,
        telefono_estanco: estanco.telefono_estanco,
        id_zona: estanco.id_zona,
        id_franquicia: estanco.id_franquicia,
        imagen_estanco: estanco.imagen_estanco,
        logo_estanco: estanco.logo_estanco,
        descripcion: estanco.descripcion,
        hora_estanco: estanco.hora_estanco,
        horario_estanco: estanco.horario_estanco,
        longitud: estanco.longitud,
        latitud: estanco.latitud,
        id_usuario: estanco.id_usuario,
      },
      { where: { id_estanco: estanco.id_estanco } }
    );
    return estanco.id_estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Estanco.delete = async (id_estanco) => {
  try {
    await Estanco.destroy({ where: { id_estanco } });
    return id_estanco;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Estanco;
