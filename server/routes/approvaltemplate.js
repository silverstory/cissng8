const express = require('express');
const router = express.Router();
const passport = require('passport');
const approvaltemplateService = require('../services/approvaltemplate.service');

// POST by Distinction, Usertype
router.post('/approvaltemplate', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  approvaltemplateService.getApprovaltemplateByUserDist(req, res, next);
});

// GET by Distinction
router.get('/findapprovaltemplates', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  approvaltemplateService.findTemplatesByDistinction(req, res, next);
});

// GET by Distinction No Auth Needed
router.get('/findapprovaltemplatesnoauth', async (req, res, next) => {
  approvaltemplateService.findTemplatesByDistinction(req, res, next);
});

module.exports = router;
