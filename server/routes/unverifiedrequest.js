const express = require('express');
const router = express.Router();
const passport = require('passport');
const unverifiedrequestService = require('../services/unverifiedrequest.service');

// All notify group
router.get('/unverified/allrequest/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await unverifiedrequestService.allUnverifiedRequests(req, res, next);
});

// Search By Name
router.get('/unverified/userunacted/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await unverifiedrequestService.getUserUnactedAPI(req, res, next);
});

// Add CISS Profile
router.post('/unverified', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await unverifiedrequestService.postUnverifiedRequest(req, res, next);
});

// heroes

module.exports = router;
