const nodemailer = require('nodemailer');
require('dotenv').config();

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.CREDENTIAL_MAIL
      }
    });

    // Configura el contenido HTML del correo electrónico de verificación normal
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: 'Código de verificación',
      html: `
        <div style="text-align: center;">
          <img src="https://tu-empresa.com/logo.png" alt="Logo de la empresa" style="max-width: 50%;">
          <div style="margin: 20px 0;">
            <h2>Código de verificación</h2>
            <p>Gracias por registrarte en nuestro servicio. Aquí está tu código de verificación:</p>
            <p style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px; display: inline-block; border-radius: 5px;">${verificationCode}</p>
            <p>No compartas este código con nadie por seguridad.</p>
          </div>
          <div style="margin-top: 30px; font-size: 14px;">
            <p>Síguenos en nuestras redes sociales:</p>
            <p>
              <a href="https://facebook.com/tu-empresa">Facebook</a> |
              <a href="https://twitter.com/tu-empresa">Twitter</a> |
              <a href="https://instagram.com/tu-empresa">Instagram</a>
            </p>
            <p>Todos los derechos reservados &copy; ${new Date().getFullYear()} Amaneciendo</p>
          </div>
        </div>
      `
    };

    // Envía el correo electrónico de verificación normal
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico de verificación enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo electrónico de verificación:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.CREDENTIAL_MAIL
      }
    });

    // Configura el contenido HTML del correo electrónico de recuperación de contraseña
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <div style="text-align: center;">
          <img src="https://tu-empresa.com/logo.png" alt="Logo de la empresa" style="max-width: 50%;">
          <div style="margin: 20px 0;">
            <h2>Recuperación de contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para continuar con el proceso:</p>
            <p style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px; display: inline-block; border-radius: 5px;">${resetCode}</p>
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
          </div>
          <div style="margin-top: 30px; font-size: 14px;">
            <p>Síguenos en nuestras redes sociales:</p>
            <p>
              <a href="https://facebook.com/tu-empresa">Facebook</a> |
              <a href="https://twitter.com/tu-empresa">Twitter</a> |
              <a href="https://instagram.com/tu-empresa">Instagram</a>
            </p>
            <p>Todos los derechos reservados &copy; ${new Date().getFullYear()} Tu Empresa</p>
          </div>
        </div>
      `
    };

    // Envía el correo electrónico de recuperación de contraseña
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico de recuperación de contraseña enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo electrónico de recuperación de contraseña:', error);
    throw error;
  }
};

const storeVerificationCode = async (userId, verificationCode) => {
  try {
    await new Promise((resolve, reject) => {
      User.storeVerificationCode(userId, verificationCode, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    console.log('Código de verificación almacenado para el usuario:', userId);
  } catch (error) {
    console.error('Error al almacenar el código de verificación:', error);
    throw error;
  }
};
const sendOrderNotificationEmail = async (email, orders) => {
  try {
    console.log("estas son las ordenes" + JSON.stringify(orders))
    const transporter = nodemailer.createTransport({
      host: process.env.HOST_MAIL,
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.CREDENTIAL_MAIL
      }
    });

    // Configura el contenido HTML del correo electrónico de notificación de orden
    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: 'AMANECIENDO: Orden generada',
      html: `
        <div style="text-align: center;">
          <img src="https://tu-empresa.com/logo.png" alt="Logo de la empresa" style="max-width: 50%;">
          <div style="margin: 20px 0;">
            <h2>Notificación de orden generada</h2>
            <p>Se ha generado una nueva orden con los siguientes detalles:</p>
            ${orders.map((order, index) => `
              <h3>Orden #${index + 1} - ID: ${order.order_id || 'N/A'}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Estanco</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Precio Unitario</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.productos.map(product => `
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.name || 'N/A'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${order.estanco.nombre_estanco || 'N/A'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity || 'N/A'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px;">${product.price || 'N/A'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <p style="font-weight: bold;">Precio Total: ${order.total_price || 'N/A'}</p>
            `).join('')}
          </div>
          <div style="margin-top: 30px; font-size: 14px;">
            <p>Síguenos en nuestras redes sociales:</p>
            <p>
              <a href="https://facebook.com/tu-empresa">Facebook</a> |
              <a href="https://twitter.com/tu-empresa">Twitter</a> |
              <a href="https://instagram.com/tu-empresa">Instagram</a>
            </p>
            <p>Todos los derechos reservados &copy; ${new Date().getFullYear()} Amaneciendo</p>
          </div>
        </div>
      `
    };

    // Envía el correo electrónico de notificación de orden
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico de notificación de orden enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo electrónico de notificación de orden:', error);
    throw error;
  }
};


module.exports = {
  generateVerificationCode,
  sendVerificationEmail,
  sendPasswordResetEmail,
  storeVerificationCode,
  sendOrderNotificationEmail
};