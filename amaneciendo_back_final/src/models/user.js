const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
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
}, {
  tableName: "users",
});

const Role = sequelize.define("roles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  route: {
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
}, {
  tableName: "roles",
});

const UserRole = sequelize.define("user_has_roles", {
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: 'id'
    }
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
  tableName: "user_has_roles",
});

User.belongsToMany(Role, { through: UserRole, foreignKey: "id_user" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "id_rol" });

const VerificationCode = sequelize.define("codigo_verificacion", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: "userId",
    references: {
      model: User,
      key: 'id'
    }
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at",
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: "codigo_verificacion",
  timestamps: false,
});

User.hasOne(VerificationCode, { foreignKey: "userId" });
VerificationCode.belongsTo(User, { foreignKey: "userId" });

async function formatDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
User.findById = async (id) => {
  try {
    const user = await User.findOne({
      where: { id },
      attributes: ["id", "email", "name", "lastname", "image", "phone", "password", "rol"],
      include: [
        {
          model: Role,
          attributes: ["id", "name", "image", "route"],
          through: { attributes: [] },
        },
      ],
    });
    return JSON.stringify(user);
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
User.findByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          attributes: ["id", "name", "image", "route"],
          through: { attributes: [] },
        },
      ],
    });
    return user;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
User.findByPhone = async (phone) => {
  try {
    const user = await User.findOne({
      where: { phone },
      include: [
        {
          model: Role,
          attributes: ["id", "name", "image", "route"],
          through: { attributes: [] },
        },
      ],
    });
    return user;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.findDeliveryMen = async () => {
  try {
    const deliveryMen = await User.findAll({
      attributes: ["id", "email", "name", "lastname", "image", "phone", "rol"],
      include: [
        {
          model: Role,
          where: { id: 2 },
          attributes: [],
        },
      ],
    });
    return deliveryMen;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.createUser = async (user) => {
  try {
    const hash = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      image: user.image,
      password: hash,
      rol: user.rol,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return newUser.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.updateUser = async (user) => {
  try {
    await User.update(
      {
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        image: user.image,
        updated_at: new Date(),
      },
      { where: { id: user.id } }
    );
    return user.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.updateWithoutImage = async (user) => {
  try {
    await User.update(
      {
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        updated_at: new Date(),
      },
      { where: { id: user.id } }
    );
    return user.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.updateNotificationToken = async (id, token) => {

  try {
    await User.update(
      {
        notificationToken: token,
        updated_at: new Date(),
      },
      { where: { id } }
    );
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.storeVerificationCode = async (userId, verificationCode) => {
  try {
    await VerificationCode.upsert({
      userId,
      code: verificationCode,
      updated_at: new Date(),
    });
    return userId;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.verifyCode = async (userId, verificationCode) => {
  console.log("codigo de verificacion: " + verificationCode);
  console.log("id Usuarios: " + userId);
  try {
    const storedCode = await VerificationCode.findOne({
      where: { userId },
      order: [["updatedAt", "DESC"]],
    });

    if (!storedCode) {
      return false;
    }

    const currentDate = await formatDate(new Date());
    const updatedAt = await formatDate(storedCode.updatedAt);
    const timeDifference = new Date(currentDate) - new Date(updatedAt);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (
      storedCode.code.toString() === verificationCode.toString() &&
      !isNaN(minutesDifference) &&
      minutesDifference < 30
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

User.updatePassword = async (userId, newPassword) => {
  try {
    await User.update(
      {
        password: newPassword,
        updated_at: new Date(),
      },
      { where: { id: userId } }
    );
    return userId;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = User;