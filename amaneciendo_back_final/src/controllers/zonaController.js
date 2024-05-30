const Zona = require("../models/zonaModel");

module.exports = {
    async getAll(req, res) {
      try {
        const zonas = await Zona.getAll();
        return res.status(200).json(zonas);
      } catch (error) {
        console.error('Error al obtener las zonas:', error);
        return res.status(500).json({
          success: false,
          message: 'Hubo un error al momento de listar las zonas',
          error: error.message,
        });
      }
    },
  };

// exports.getById = (req, res) => {
//     Zona.getById(req.params.id, (error, result) => {
//         if (error) throw error;
//         res.json(result);
//     });
// };

// exports.findByZonas =(req, res) => {
//     const id_zonas = req.params.id_zonas;

//     Zona.findByZonas(id_zonas, (err, data) => {
//         if (err) {
//             return res.status(501).json({
//                 success: false,
//                 message: 'Hubo un error al momento de listar las zonas',
//                 error: err
//             });
//         }

//         return res.status(201).json(data);
//     });
// },

// exports.create = (req, res) => {
//     const newZone = {
//         tipo_zona: req.body.tipo_zona
//     };
//     Zona.create(newZone, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'Zona creada exitosamente', id: result.insertId });
//     });
// };

// exports.update = (req, res) => {
//     const updatedZone = {
//         id: req.body.id,
//         tipo_zona: req.body.tipo_zona
//     };
//     Zona.update(req.params.id, updatedZone, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'Zona actualizada exitosamente', rowsAffected: result.affectedRows });
//     });
// };

// exports.delete = (req, res) => {
//     Zona.delete(req.params.id, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'Zona eliminada exitosamente', rowsAffected: result.affectedRows });
//     });
// };
