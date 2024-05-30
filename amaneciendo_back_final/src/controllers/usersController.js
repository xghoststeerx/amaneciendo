const User = require("../models/user");
const Rol = require("../models/rol");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const storage = require("../utils/cloud_storage");
require("dotenv").config();
const {
  generateVerificationCode,
  sendVerificationEmail,
} = require("../utils/verificationUtils");
module.exports = {
  async findDeliveryMen(req, res) {
    try {
      const deliveryMen = await User.findDeliveryMen();
      return res.status(200).json(deliveryMen);
    } catch (error) {
      console.error("Error al listar los repartidores:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al listar los repartidores",
        error: error.message,
      });
    }
  },

  //login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "El email no fue encontrado",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "La contraseña es incorrecta",
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
        {}
      );

      const roles = await user.getRoles();
      console.log(token);
      const data = {
        id: `${user.id}`,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        image: user.image,
        rol: user.rol,
        session_token: `JWT ${token}`,
        roles: roles.map((role) => ({
          id: role.id,
          name: role.name,
          image: role.image,
          route: role.route,
        })),
      };

      return res.status(200).json({
        success: true,
        message: "El usuario fue autenticado",
        data: data,
      });
    } catch (error) {
      console.error("Error con el Login del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el Login del usuario",
        error: error.message,
      });
    }
  },

  async register(req, res) {
    try {
      const user = req.body;
      const data = await User.create(user);
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRÓ
      });
    } catch (error) {
      console.error("Error con el registro del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del usuario",
        error: error.message,
      });
    }
  },

  async registerWithImage(req, res) {
    try {
      const user = JSON.parse(req.body.user);
      const files = req.files;
      console.log(user);
      const existingUser = await User.findByEmail(user.email);
      if (existingUser) {
        return res.status(404).json({
          success: false,
          message: "El email ya se encuentra en uso",
        });
      }
      // Verificar si el número telefónico ya está registrado
      const existingPhone = await User.findByPhone(user.phone);
      if (existingPhone) {
        return res.status(404).json({
          success: false,
          message: "El número telefónico ya se encuentra registrado",
        });
      }

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url) {
          user.image = url;
        }
      }

      const data = await User.createUser(user);
      user.id = data;
      const token = jwt.sign(
        { id: user.id, email: user.email },
        keys.secretOrKey,
        {}
      );
      user.session_token = `JWT ${token}`;
      await Rol.createUserRol(parseInt(user.id), user.rol);

      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: user,
      });
    } catch (error) {
      console.error("Error con el registro del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con el registro del usuario",
        error: error.message,
      });
    }
  },

  async updateWithImage(req, res) {
    try {
      const user = JSON.parse(req.body.user);
      const files = req.files;

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);
        if (url) {
          user.image = url;
        }
      }

      await User.updateUser(user);

      return res.status(200).json({
        success: true,
        message: "El usuario se actualizó correctamente",
        data: user,
      });
    } catch (error) {
      console.error("Error con la actualización del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del usuario",
        error: error.message,
      });
    }
  },

  async updateWithoutImage(req, res) {
    try {
      const user = req.body;
      await User.updateWithoutImage(user);
      return res.status(200).json({
        success: true,
        message: "El usuario se actualizó correctamente",
        data: user,
      });
    } catch (error) {
      console.error("Error con la actualización del usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del usuario",
        error: error.message,
      });
    }
  },

  async updateNotificationToken(req, res) {
    try {
      const { id, token } = req.body;
      await User.updateNotificationToken(id, token);
      return res.status(200).json({
        success: true,
        message: "El token de notificación se actualizó correctamente",
        data: id,
      });
    } catch (error) {
      console.error(
        "Error con la actualización del token de notificación:",
        error
      );
      return res.status(500).json({
        success: false,
        message: "Hubo un error con la actualización del token de notificación",
        error: error.message,
      });
    }
  },

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Por favor, proporciona la contraseña actual y la nueva contraseña",
        });
      }
      const userJson = await User.findById(userId);
      const user = JSON.parse(userJson);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "La contraseña actual es incorrecta",
        });
      }
      console.log(user.id);
      const verificationCode = generateVerificationCode();
      await sendVerificationEmail(user.email, verificationCode);
      await User.storeVerificationCode(user.id, verificationCode);

      return res.status(200).json({
        success: true,
        message:
          "Se ha enviado un código de verificación a tu correo electrónico",
      });
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  },

  async verifyCode(req, res) {
    try {
      const { verificationCode, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      const isCodeValid = await User.verifyCode(userId, verificationCode);
      if (!isCodeValid) {
        return res.status(400).json({
          success: false,
          message: "El código de verificación es inválido o ha caducado",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(userId, hashedPassword);

      return res.status(200).json({
        success: true,
        message: "La contraseña se ha actualizado correctamente",
      });
    } catch (error) {
      console.error(
        "Error al verificar el código y actualizar la contraseña:",
        error
      );
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  },
};
