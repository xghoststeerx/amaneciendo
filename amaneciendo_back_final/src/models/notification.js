const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visto: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false,
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
  tableName: "notification",
});

Notification.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Notification, { foreignKey: "userId" });

Notification.createNotification = async (newNotification) => {
  try {
    const createdNotification = await Notification.create({
      titulo: newNotification.titulo,
      visto: newNotification.visto,
      userId: newNotification.userId,
      accion: newNotification.accion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return createdNotification;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Notification.findByUser = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      attributes: ["id", "titulo", "visto", "userId", "accion"],
    });
    console.log("Notificaciones obtenidas:", notifications);
    return notifications;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

Notification.modifyEstateNotification = async (notificationId) => {
  try {
    await Notification.update(
      { visto: true },
      { where: { id: notificationId } }
    );
    console.log("Estado de la notificación modificado:", notificationId);
    return notificationId;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = Notification;