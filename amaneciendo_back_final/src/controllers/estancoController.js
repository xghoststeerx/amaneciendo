const Estanco = require("../models/estancoModel");
const storage = require("../utils/cloud_storage");
const asyncForEach = require("../utils/async_foreach");
const Address = require("../models/address");

module.exports = {
  async create(req, res) {
    try {
      const estanco  = req.body;
      const addressData = estanco.address;
      const address = {
        address: addressData.address,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        lat: addressData.lat,
        lng: addressData.lng,
        post_code: addressData.post_code,
        id_user: estanco.id_usuario,
        created_at: new Date(),
        updated_at: new Date()
      };
      // Crear el registro en la tabla address
      const newAddress = await Address.createAdress(address);
  
      // Asignar el id de la dirección creada al estanco
      estanco.id_address = newAddress;
  
      // Crear el registro en la tabla estanco
      const data = await Estanco.createEstanco(estanco);
  
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del estanco",
        error: error.message,
      });
    }
  },

  async createWithImage(req, res) {
    try {
      const estanco = JSON.parse(req.body.estanco);
      const files = req.files;

      if (files.length > 0) {
        const path = `imagen_estanco_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url != undefined && url != null) {
          estanco.image = url;
        }
      }

      const id_estanco = await Estanco.create(estanco);
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: `${id_estanco}`,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del estanco",
        error: error.message,
      });
    }
  },

  async findByEstanco(req, res) {
    try {
      const id_zona = req.params.id_zona;
      const data = await Estanco.findByEstanco(id_zona);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar los estancos por zonas",
        error: error.message,
      });
    }
  },

  async findEstancoByUser(req, res) {
    try {

      const id_usuario = req.params.id_usuario;
      const data = await Estanco.findEstancoByUser(id_usuario);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar los estancos por usuario",
        error: error.message,
      });
    }
  },

  async listarEstanco(req, res) {
    try {
      const data = await Estanco.listarEstanco();
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar los estancos",
        error: error.message,
      });
    }
  },

  async findByZona(req, res) {
    try {
      const id_zona = req.params.id_zona;
      const data = await Estanco.findByEstancozona(id_zona);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar los estancos",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const estanco = req.body;
      const id_estanco = await Estanco.update(estanco);
      return res.status(200).json({
        success: true,
        message: "El estanco se actualizó correctamente",
        data: `${id_estanco}`,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del estanco",
        error: error.message,
      });
    }
  },

  async updateWithImage(req, res) {
    try {
      const estanco = JSON.parse(req.body.estanco);
      const files = req.files;

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url != undefined && url != null) {
          estanco.imagen_estanco = url;
        }
      }

      const data = await Estanco.update(estanco);
      return res.status(200).json({
        success: true,
        message: "El estanco se actualizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del estanco",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const id_estanco = req.params.id_estanco;
      await Estanco.delete(id_estanco);
      return res.status(200).json({
        success: true,
        message: "El estanco se eliminó correctamente",
        data: `${id_estanco}`,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de eliminar el estanco",
        error: error.message,
      });
    }
  },
};
