var express = require('express');
var router = express.Router();
const twilio = require('twilio');
var basicAuth = require("../middleware/basicAuth");

const accountSidSMS = process.env.TWILIO_ACCOUNT_SID_SMS;
const authTokenSMS = process.env.TWILIO_AUTH_TOKEN_SMS;
const accountSidWhatsapp = process.env.TWILIO_ACCOUNT_SID_WHATSAPP;
const authTokenWhatsapp = process.env.TWILIO_AUTH_TOKEN_WHATSAPP;
const clientSMS = new twilio(accountSidSMS, authTokenSMS);
const clientWhatsapp = new twilio(accountSidWhatsapp, authTokenWhatsapp);

/* GET home page. */
router.post('/send-sms', basicAuth, async (req, res) => {
  const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).send('Phone number and message body are required');
    }

    try {
        const sms = await clientSMS.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        res.status(200).send(`Message sent: ${sms.sid}`);
    } catch (error) {
        res.status(500).send(`Error sending message: ${error.message}`);
    }
});

router.post('/send-whatsapp', basicAuth, async (req, res) => {
  const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).send('Phone number and message body are required');
    }

    try {
        const whatsappMessage = await clientWhatsapp.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${to}`
        });

        res.status(200).send(`WhatsApp message sent: ${whatsappMessage.sid}`);
    } catch (error) {
        res.status(500).send(`Error sending WhatsApp message: ${error.message}`);
    }
});


module.exports = router;
