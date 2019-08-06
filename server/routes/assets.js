const express = require('express');
const router = express.Router();
const passport = require('passport');
const assetsService = require('../services/assets.service');

// GET PHOTO BASE URL
router.get('/pbu', async (req, res, next) => {
  assetsService.getPhotoBaseUrl(req, res, next);
});

module.exports = router;
