const bankController = require('../controllers/bankController');
const passport = require('passport');
const verifyToken = require('../config/verifyToken');
module.exports = (app) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    // app.get('/api/categories/getAll',  verifyToken, categoriesController.getAll);

    app.get('/api/bank/get-banks/:id',  verifyToken, bankController.getBankAccounts);
    app.post('/api/bank/create-banks',  verifyToken, bankController.createBankAccount);
    app.put('/api/bank/modify-bank/:id',  verifyToken, bankController.updateBankAccount);
    app.delete('/api/bank/delete-bank/:id',  verifyToken, bankController.deleteBankAccount);
    app.put('/api/bank/verify-bank/:id',  verifyToken, bankController.verifyBankAccount);



}