const express = require('express');
const router = express.Router();
const passport = require('passport');
const sendSmsService = require('../services/sendsms.service');

// Send SMS
// POST http://localhost/api/sms/send?mobile=09279998888&message=test
router.get('/sms/send', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  sendSmsService.sendSMS(req, res, next);
});

module.exports = router;
