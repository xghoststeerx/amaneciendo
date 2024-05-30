const EstancoProduct = require("../models/estancoProduct");
const Product = require("../models/product");
const storage = require("../utils/cloud_storage");

module.exports = {
  async findByEstanco(req, res) {
    try {
      const id_estanco = req.params.id_estanco;
      const data = await Product.findByEstanco(id_estanco);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar los productos por estanco",
        error: error.message,
      });
    }
  },

  async findByCategory(req, res) {
    try {
      const id_categoria = req.params.id_categoria;
      const data = await Product.findByCategory(id_categoria);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message:
          "Hubo un error al momento de listar los productos por categoría",
        error: error.message,
      });
    }
  },
  async findByCategoryAndEstanco(req, res) {
    try {
      const id_categoria = req.params.id_categoria;
      const id_estanco = req.query.id_estanco;
      console.log("id_estanco: " + id_estanco);
      const data = await EstancoProduct.findByCategoryAndEstanco(
        id_categoria,
        id_estanco
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message:
          "Hubo un error al momento de listar los productos por categoría",
        error: error.message,
      });
    }
  },
  async allProductsByEstanco(req, res) {
    try {
      const id_estanco = req.query.id_estanco;
      console.log("id_estanco: " + id_estanco);
      const data = await EstancoProduct.findAllByEstanco(id_estanco);
      return res.status(200).json(data);
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de listar todos los productos del estanco",
        error: error.message,
      });
    }
  },

  async create(req, res) {
    try {
      const product = req.body;
      const data = await Product.create(product);
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del producto",
        error: error.message,
      });
    }
  },
  async createWithEstancoAndCategory(req, res) {
    try {
      const product = req.body;
      const data = await EstancoProduct.createProductWithEstancoAndCategory(
        product
      );
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del producto",
        error: error.message,
      });
    }
  },

  async createWithImage(req, res) {
    try {
      const product = JSON.parse(req.body.product);
      const files = req.files;

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url !== undefined && url !== null) {
          product.image = url;
        }
      }

      const id = await Product.createProduct(product);
      return res.status(201).json({
        success: true,
        message: "El registro del producto se realizó correctamente",
        data: `${id}`,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del producto",
        error: error.message,
      });
    }
  },

  async update(req, res) {
    try {
      const product = req.body;
      const data = await EstancoProduct.updateData(product);
      return res.status(200).json({
        success: true,
        message: "El producto se actualizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del producto",
        error: error.message,
      });
    }
  },

  async updateWithImage(req, res) {
    try {
      const product = JSON.parse(req.body.product);
      const files = req.files;

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url !== undefined && url !== null) {
          product.image = url;
        }
      }

      const data = await Product.update(product);
      return res.status(200).json({
        success: true,
        message: "El producto se actualizó correctamente",
        data: data,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del producto",
        error: error.message,
      });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      await EstancoProduct.delete(id);
      return res.status(200).json({
        success: true,
        message: "El producto se eliminó correctamente",
        data: `${id}`,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al momento de eliminar el producto",
        error: error.message,
      });
    }
  },
};
