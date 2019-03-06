const express = require('express');
const router = express.Router();
const passport = require('passport');
const approvaltemplateService = require('../services/approvaltemplate.service');

// POST by Distinction, Usertype
router.post('/approvaltemplate', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  approvaltemplateService.getApprovaltemplateByUserDist(req, res, next);
});

module.exports = router;