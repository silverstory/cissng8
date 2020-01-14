const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileActionService = require('../services/profileaction.service');

// Today's list
router.get('/profileaction/todayslist/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await profileActionService.todaysProfileActions(req, res, next);
});

// Search By Name
router.get('/profileaction/namefinder/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await profileActionService.getProfileActionByName(req, res, next);
});

// Add CISS Profile
router.post('/profileaction', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await profileActionService.postProfileAction(req, res, next);
});

// heroes

module.exports = router;
