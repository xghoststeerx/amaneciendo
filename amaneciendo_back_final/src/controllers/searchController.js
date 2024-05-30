const SearchAll = require("../models/search");

module.exports = {
  async searchProducts(req, res) {
    try {
      const { query } = req.query;
      const products = await SearchAll.search(query);
      res.status(200).json(products);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      res.status(500).json({ message: "Error al buscar productos" });
    }
  },
};