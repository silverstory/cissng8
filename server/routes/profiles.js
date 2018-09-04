const express = require('express');
const router = express.Router();
const passport = require('passport');
const profileService = require('../services/profile.service');

// Access Approval
router.get('/profile/accessapprovals/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  switch (req.query.ordinal) {
    case 'first':
      profileService.getFirstAccessApprovals(req, res, next);
    case 'next':
      profileService.getNextAccessApprovals(req, res, next);
    case 'previous':
      // profileService.getPreviousAccessApprovals(req, res, next);
    default:
      profileService.getFirstAccessApprovals(req, res, next);
  }
});

// GET http://localhost:3000/api/profile/270253d17070590077106fba4323188ea733c6aec1f2ed040c47476ef0202365
router.get('/profile/:text', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  // router.get('/profile/:text', async (req, res, next) => {
  profileService.findProfile(req, res, next);
});

// FIND Profile (No Auth)
router.get('/opid/v/:text', async (req, res, next) => {
  profileService.findProfile(req, res, next);
});

// GET http://localhost:3000/api/profile/get/5adfe17eda216211f42bd88f
router.get('/profile/get/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  // router.get('/profile/get/:id', async (req, res, next) => {
  profileService.getProfile(req, res, next);
});

// Add CISS Profile
// POST http://localhost:3000/api/profile/
router.post('/profile', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  profileService.postProfile(req, res, next);
});

// Find CISS Profile By Distinction and ProfileId
// POST http://localhost:3000/api/profile/print
router.post('/profile/view', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  profileService.getProfileByIdDist(req, res, next);
});

// POST http://localhost:3000/api/profile_old/
// Content-Type application/json
// {
//     "name": "eprel ultraman"
// }
// router.post('/profile_old', async (req, res, next) => {
//     await Profile.create(req.body)
//     .then( async (profile) => {
//       return await res.json( profile );
//     }).catch(next);
// });

// PUT http://localhost:3000/api/profile/5abe2bdf897fa433900edb61
// Content-Type application/json
// {
//     "name": "eprel super human"
// }
// router.put('/profile/:id', async (req, res, next) => {
//     await Profile.findByIdAndUpdate({_id: req.params.id}, req.body)
//     .then( async () => {
//       await Profile.findById({_id: req.params.id})
//       .then( async (profile) => {
//         return await res.json( profile );
//       });
//     });
// });

// DELETE http://localhost:3000/api/profile/5abe2bdf897fa433900edb61
router.delete('/profile', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  profileService.deleteProfileByIdDist(req, res, next);
});

// heroes

module.exports = router;
