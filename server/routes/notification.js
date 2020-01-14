const express = require('express');
const router = express.Router();
const passport = require('passport');
const notificationService = require('../services/notification.service');

// Today's list
router.get('/notification/allnotif/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notificationService.allNotifications(req, res, next);
});

// Search By Name
router.get('/notification/byusertype/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notificationService.getNotificationByUserType(req, res, next);
});

// Add CISS Profile
router.post('/notification', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notificationService.postNotification(req, res, next);
});

// heroes

module.exports = router;
