const Franquicia = require('../models/franqModel');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');

module.exports = {
    getAll(req, res) {
        Franquicia.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las zonas',
                    error: err
                });
            }
            return res.status(201).json(data);
        }
        );
    },


    create(req, res) {

        const franquicia = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        Franquicia.create(franquicia, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });

        });

    },

    update(req, res) {
        const franquicia = req.body;

        Franquicia.update(franquicia, (err, id_franquicia) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la actualizacion del estanco',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El estanco se actualizo correctamente',
                data: `${id_franquicia}`
            });
        })
    },

    async delete(req, res) {
        const id_franquicia = req.params.id_franquicia;

        Franquicia.delete(id_franquicia, (err, id_franquicia) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de eliminar el estanco',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El estanco se elimino correctamente',
                data: `${id_franquicia}`
            });
        });
    },
}

// exports.getById = (req, res) => {
//     franquicia.getById(req.params.id, (error, result) => {
//         if (error) throw error;
//         res.json(result);
//     });
// };

// exports.create = (req, res) => {
//     const newfranq = {
//         nombre_franquicia: req.body.nombre_franquicia
//     };
//     Franquicia.create(newfranq, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'Franquicia creada exitosamente', id_franquicia: result.insertId });
//     });
// };

// exports.update = (req, res) => {
//     const updatedfranq = {
//         id_franquicia: req.body.id_franquicia,
//         nombre_franquicia: req.body.nombre_franquicia
//     };
//     Franquicia.update(req.params.id, updatedfranq, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'franquicia actualizada exitosamente', rowsAffected: result.affectedRows });
//     });
// };

// exports.delete = (req, res) => {
//     Franquicia.delete(req.params.id, (error, result) => {
//         if (error) throw error;
//         res.json({ message: 'franquicia eliminada exitosamente', rowsAffected: result.affectedRows });
//     });
// };