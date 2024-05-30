const SearchController = require('../controllers/searchController');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {
  app.get('/api/products/search', verifyToken, SearchController.searchProducts);
};