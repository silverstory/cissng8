const express = require('express');
const router = express.Router();
const passport = require('passport');
const officeService = require('../services/office.service');

// Today's list
router.get('/office/all/', async (req, res, next) => {
  await officeService.allOffices(req, res, next);
});

// Add CISS Profile
router.post('/office', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await officeService.postOffice(req, res, next);
});

router.put('/office/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await officeService.putOffice(req, res, next);
});

// GET by CODE
router.get('/office/c/:code', async (req, res, next) => {
  await officeService.findOfficeByCode(req, res, next);
});

// FIND
router.get('/office/:text', async (req, res, next) => {
  await officeService.findOffice(req, res, next);
});

// DELETE by ID
router.delete('/office/:id', passport.authenticate('jwt',{session:false}), async (req, res, next) => {
  await officeService.deleteOfficeById(req, res, next);
});

// heroes

module.exports = router;
