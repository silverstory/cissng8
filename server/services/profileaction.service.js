const util = require('util');
const ProfileAction = require('../models/profileaction.model');
const sms = require('./sms.service');

const todaysProfileActions = async (req, res, next) => {
  try {
    const result = await
      ProfileAction
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .profileActionsPaginated(req.query.distinction, req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const getProfileActionByName = async (req, res, next) => {
  try {
    const result = await
      ProfileAction
        .profileActionSearchByName(req.query.firstname, req.query.lastname, req.query.page, req.query.limit);
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const postProfileAction = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _profileaction = req.body;

  try {

    // create the profile record
    const saved_profileaction = await ProfileAction.ProfileAction.create(_profileaction);

    const profileaction = await ProfileAction.ProfileAction.findById({ _id: saved_profileaction._id });

    return await res.json(profileaction);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

module.exports = {
  postProfileAction,
  todaysProfileActions,
  getProfileActionByName
};
