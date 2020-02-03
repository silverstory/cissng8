const express = require('express');
const router = express.Router();
const passport = require('passport');
const locationService = require('../services/location.service');

// Today's list
router.get('/location/all/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await locationService.allLocations(req, res, next);
});

// Search By Name
router.get('/location/byname/', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await locationService.getLocationByName(req, res, next);
});

// Add CISS Profile
router.post('/location', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await locationService.postLocation(req, res, next);
});

router.put('/location/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await locationService.putLocation(req, res, next);
});

// heroes

module.exports = router;
