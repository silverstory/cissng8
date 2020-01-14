const util = require('util');
const Notification = require('../models/notification.model');
const sms = require('./sms.service');

const allNotifications = async (req, res, next) => {
  try {
    const result = await
      Notification
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .notificationsPaginated(req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const getNotificationByUserType = async (req, res, next) => {
  try {
    const result = await
      Notification
        .notificationSearchByUserType(req.query.usertype, req.query.page, req.query.limit, req.query.newestfirst);
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const postNotification = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _notification = req.body;

  try {

    // create the profile record
    const saved_notification = await Notification.Notification.create(_notification);

    const notification = await Notification.Notification.findById({ _id: saved_notification._id });

    return await res.json(notification);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

module.exports = {
  postNotification,
  allNotifications,
  getNotificationByUserType
};
