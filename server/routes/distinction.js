const express = require('express');
const router = express.Router();
const passport = require('passport');
const distinctionService = require('../services/distinction.service');

// FIND ALL DISTINCTIONS
router.get('/findalldistinctions', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  distinctionService.findAllDistinction(req, res, next);
});

// FIND fulltext
// router.get('/ipwhitelist/:text', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
//   ipwhitelistService.findIpwhitelist(req, res, next);
// });

// GET by Name
router.get('/distinction/c/:name', async (req, res, next) => {
  distinctionService.findDistinctionByName(req, res, next);
});

// GET by ID
router.get('/distinction/get/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  distinctionService.getDistinction(req, res, next);
});

// POST
router.post('/distinction', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  distinctionService.postDistinction(req, res, next);
});

// PUT
router.put('/distinction/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  distinctionService.putDistinction(req, res, next);
});

// DELETE by ID
router.delete('/distinction/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  distinctionService.deleteDistinctionById(req, res, next);
});

module.exports = router;
