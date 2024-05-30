const BankAccount = require('../models/bank');

// Obtener todas las cuentas bancarias
exports.getBankAccounts = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await BankAccount.findBankWithId(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json("error", error);
  }

};

// Crear una nueva cuenta bancaria
exports.createBankAccount = async (req, res) => {
  BankAccount.createAccount(req.body, (err, bankAccountId) => {
    if (err) {
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al tratar de crear la cuenta bancaria',
        error: err
      });
    }
    return res.status(201).json({
      id: bankAccountId,
      message: 'Cuenta bancaria creada exitosamente'
    });
  });
};

// Actualizar una cuenta bancaria
exports.updateBankAccount = async (req, res) => {
  const { id } = req.params;
  BankAccount.update(id, req.body, (err, updatedRows) => {
    if (err) {
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al tratar de actualizar la cuenta bancaria',
        error: err
      });
    }
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Cuenta bancaria no encontrada' });
    }
    return res.status(200).json({ message: 'Cuenta bancaria actualizada exitosamente' });
  });
};

// Eliminar una cuenta bancaria
exports.deleteBankAccount = async (req, res) => {
  const { id } = req.params;
  BankAccount.delete(id, (err, deletedRows) => {
    if (err) {
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al tratar de eliminar la cuenta bancaria',
        error: err
      });
    }
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Cuenta bancaria no encontrada' });
    }
    return res.status(200).json({ message: 'Cuenta bancaria eliminada exitosamente' });
  });
};

// Verificar una cuenta bancaria
exports.verifyBankAccount = async (req, res) => {
  const { id } = req.params;
  BankAccount.verify(id, (err, updatedRows) => {
    if (err) {
      return res.status(501).json({
        success: false,
        message: 'Hubo un error al tratar de verificar la cuenta bancaria',
        error: err
      });
    }
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Cuenta bancaria no encontrada' });
    }
    return res.status(200).json({ message: 'Cuenta bancaria verificada exitosamente' });
  });
};