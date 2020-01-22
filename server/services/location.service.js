const util = require('util');
const Location = require('../models/location.model');
const sms = require('./sms.service');

const allLocations = async (req, res, next) => {
  try {
    const result = await
      Location
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .locationsPaginated(req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const getLocationByName = async (req, res, next) => {
  try {
    const result = await
      Location
        .locationSearchByName(req.query.name, req.query.page, req.query.limit, req.query.newestfirst);
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const postLocation = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _location = req.body;

  try {

    // create the profile record
    const saved_location = await Location.Location.create(_location);

    const location = await Location.Location.findById({ _id: saved_location._id });

    return await res.json(location);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

module.exports = {
  postLocation,
  allLocations,
  getLocationByName
};
