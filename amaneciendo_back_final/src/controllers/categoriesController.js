const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {
    async getAll(req, res) {
        try {
            const data = await Category.getAll();
            return res.status(200).json(data);
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de listar las categorías',
                error: error.message
            });
        }
    },

    async getByEstanco(req, res) {
        try {
            const id_estanco = req.params.id_estanco;
            const data = await Category.getByEstanco(id_estanco);
            return res.status(200).json(data);
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de listar las categorías por estanco',
                error: error.message
            });
        }
    },

    async create(req, res) {
        try {
            const category = req.body;
            const data = await Category.createCategory(category);
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente',
                data: data
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con el registro de la categoría',
                error: error.message
            });
        }
    },

    async createWithImage(req, res) {
        try {
            const category = JSON.parse(req.body.category);
            const files = req.files;

            if (files.length > 0) {
                const path = `image_${Date.now()}`;
                const url = await storage(files[0], path);

                if (url !== undefined && url !== null) {
                    category.image = url;
                }
            }

            const id = await Category.createCategory(category);
            return res.status(201).json({
                success: true,
                message: 'La categoría se creó correctamente',
                data: `${id}`
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con la creación de la categoría',
                error: error.message
            });
        }
    },
    async createCategoryEstanco(req, res) {
        try {
          const { categoryId, estancoId } = req.body;
          await Category.createCategoryEstanco(categoryId, estancoId);
          return res.status(201).json({
            success: true,
            message: 'La categoría se asoció correctamente al estanco',
          });
        } catch (error) {
          console.log('Error:', error);
          return res.status(500).json({
            success: false,
            message: 'Hubo un error al asociar la categoría con el estanco',
            error: error.message,
          });
        }
      },

    async updateWithImage(req, res) {
        try {
            const category = JSON.parse(req.body.category);
            const files = req.files;

            if (files.length > 0) {
                const path = `image_${Date.now()}`;
                const url = await storage(files[0], path);

                if (url !== undefined && url !== null) {
                    category.image = url;
                }
            }

            const id = await Category.update(category);
            return res.status(200).json({
                success: true,
                message: 'La categoría se actualizó correctamente',
                data: `${id}`
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con la actualización de la categoría',
                error: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const category = req.body;
            const id = await Category.update(category);
            return res.status(200).json({
                success: true,
                message: 'La categoría se actualizó correctamente',
                data: `${id}`
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con la actualización de la categoría',
                error: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            await Category.delete(id);
            return res.status(200).json({
                success: true,
                message: 'La categoría se eliminó correctamente',
                data: `${id}`
            });
        } catch (error) {
            console.log('Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de eliminar una categoría',
                error: error.message
            });
        }
    }
};