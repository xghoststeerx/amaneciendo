const Address = require("../models/address");

module.exports = {
  async findByUser(req, res) {
    try {
      const userId = req.params.id_user;
      const addresses = await Address.findByUser(userId);
      return res.status(200).json(addresses);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al tratar de obtener las direcciones",
        error: error.message,
      });
    }
  },
  async create(req, res) {
    try {
      const address = req.body;
      console.log("adress en el controlador: " + JSON.stringify(address));
      const newAddressId = await Address.createAdress(address);

      return res.status(201).json({
        success: true,
        message: "La dirección se creó correctamente",
        data: newAddressId,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro de la dirección",
        error: error.message,
      });
    }
  },
  async delete(req, res) {
    try {
      const addressId = req.params.id;
      await Address.deleteAddress(addressId);
      return res.status(200).json({ success: true, message: "La dirección se eliminó correctamente" });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al tratar de eliminar la dirección",
        error: error.message,
      });
    }
  },
  
  async update(req, res) {
    try {
      const addressId = req.params.id;
      const updatedAddress = req.body;
      await Address.updateAddress(addressId, updatedAddress);
      return res.status(200).json({ success: true, message: "La dirección se actualizó correctamente" });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al tratar de actualizar la dirección",
        error: error.message,
      });
    }
  },
};
