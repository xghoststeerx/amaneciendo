const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Address = sequelize.define("address", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  postCode: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "post_code",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "id_user",
    references: {
      model: User,
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
},
{
  tableName: "address",
});

Address.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Address, { foreignKey: "userId" });

Address.findByUser = async (userId) => {
  try {
    const addresses = await Address.findAll({
      where: { userId },
      attributes: ["id", "address", "neighborhood", "lat", "lng", "id_user", "city", "post_code", "created_at", "updated_at"],
    });
    return addresses;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Address.createAdress = async (address) => {
  try {
    console.log("adress en el modelo: " + JSON.stringify(address));
    const newAddress = await Address.create({
      address: address.address,
      neighborhood: address.neighborhood,
      city: address.city,
      lat: address.lat,
      lng: address.lng,
      postCode: address.post_code,
      userId: address.id_user,
      createdAt: address.created_at,
      updatedAt: address.updated_at,
    });
    return newAddress.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
Address.deleteAddress = async (addressId) => {
  try {
    await Address.destroy({ where: { id: addressId } });
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Address.updateAddress = async (addressId, updatedAddress) => {
  try {
    await Address.update(updatedAddress, { where: { id: addressId } });
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
module.exports = Address;