const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const Notification = require('../models/notification');

// Configurar Firebase Admin SDK
const serviceAccount = require('../../notificationstests-daa71-firebase-adminsdk-pnb08-2c4863e40a.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Endpoint para enviar notificaciones
router.post('/send-notification', async (req, res) => {
  const { title, body, token } = req.body;

  const message = {
    notification: {
      title,
      body
    },
    token
  };

  // Guardar notificación en la base de datos
  try {
    // Guardar notificación en la base de datos
    const notification = new Notification({ title, body, token });
    await notification.save();

    // Enviar notificación a través de FCM
    const response = await admin.messaging().send(message);
    res.status(200).send('Mensaje enviado exitosamente');
  } catch (error) {
    res.status(500).send('Error al enviar el mensaje: ' + error);
  }
});

// Endpoint para recuperar notificaciones pendientes
router.get('/pending-notifications/:token', async (req, res) => {
  const token = req.params.token;
  console.log("token: ", token)

  try {
    const notifications = await Notification.find({ token });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
