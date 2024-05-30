const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Estanco = require("./estancoModel");

const BankAccount = sequelize.define("bank_accounts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  estanco_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Estanco,
      key: "id_estanco",
    },
  },
  account_holder_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  routing_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verify: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
BankAccount.belongsTo(Estanco, { foreignKey: "estancoId" });
Estanco.hasMany(BankAccount, { foreignKey: "estancoId" });

BankAccount.findBankWithId = async (id) => {
  try {
    const bankAccount = await BankAccount.findOne({
      where: { estanco_id: id },
      attributes: [
        "id",
        "estanco_id",
        "account_holder_name",
        "bank_name",
        "account_number",
        "routing_number",
        "created_at",
        "updated_at",
        "verify",
        "account_type",
      ],
    });
    return bankAccount;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
BankAccount.createAccount = async (bankAccountData) => {
  try {
    const { estanco_id, account_holder_name, bank_name, account_number, routing_number, account_type, verify } = bankAccountData;

    const newBankAccount = await BankAccount.create({
      estancoId: estanco_id,
      accountHolderName: account_holder_name,
      bankName: bank_name,
      accountNumber: account_number,
      routingNumber: routing_number,
      accountType: account_type,
      verify,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newBankAccount.id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};
BankAccount.update = async (id, bankAccountData) => {
  try {
    await BankAccount.update(
      {
        ...bankAccountData,
        updatedAt: new Date(),
      },
      { where: { id } }
    );
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

BankAccount.delete = async (id) => {
  try {
    await BankAccount.destroy({ where: { id } });
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

BankAccount.verify = async (id) => {
  try {
    await BankAccount.update(
      { verify: true, updatedAt: new Date() },
      { where: { id } }
    );
    return id;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

module.exports = BankAccount;