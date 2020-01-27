const express = require('express');
const router = express.Router();
const passport = require('passport');
const notifygroupService = require('../services/notifygroup.service');

// All notify group
router.get('/notifygroup/allnotifgrp/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notifygroupService.allNotifyGroups(req, res, next);
});

// Search By Name
router.get('/notifygroup/bytypedist/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notifygroupService.getNotifyGroupByTypeDistAPI(req, res, next);
});

// Add CISS Profile
router.post('/notifygroup', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await notifygroupService.postNotifyGroup(req, res, next);
});

// heroes

module.exports = router;
