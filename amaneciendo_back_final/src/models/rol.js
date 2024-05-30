const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

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
      key: "id",
    },
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "user_has_roles",
  timestamps: false,
});

User.belongsToMany(Role, { through: UserRole, foreignKey: "id_user" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "id_rol" });

Role.createUserRol = async (userId, roleId) => {
  console.log("userId:", userId);
  console.log("roleId:", roleId);
  console.log("typeof userId:", typeof userId);
  console.log("typeof roleId:", typeof roleId);

  try {
    if (userId && roleId) {
      const userRole = await UserRole.create({
        id_user: userId,
        id_rol: roleId,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return userRole.id;
    } else {
      throw new Error("userId y roleId no pueden ser nulos");
    }
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
module.exports = Role;