const util = require('util');
const NotifyGroup = require('../models/notifygroup.model');
const sms = require('./sms.service');

const allNotifyGroups = async (req, res, next) => {
  try {
    const result = await
      NotifyGroup
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .notifygroupsPaginated(req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const getNotifyGroupByTypeDist = async (usertype, distinction) => {
  try {
    let notifygroup = null;
    const cursor = await
      NotifyGroup
        .NotifyGroup
        .find({
          usertype: usertype,
          distinction: distinction
        }, {
          _id: 0
        }).limit(1).cursor();
    notifygroup = await cursor.next();
    if (notifygroup != null) {
      return await notifygroup;
    } else {
      return await null;
    }
  } catch (error) {
    console.log("Error: " + error);
    return await null;
  }
}

const getNotifyGroupByTypeDistAPI = async (req, res, next) => {
  try {
    let notifygroup = null;
    notifygroup = await
      findNotifyGroupByTypeDist(
        req.params.usertype,
        req.params.distinction
      );
    if (notifygroup != null) {
      return await res.json(notifygroup);
    } else {
      return await res.send(null);
    }
  } catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}



const postNotifyGroup = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _notifygroup = req.body;

  try {

    // create the profile record
    const saved_notifygroup = await NotifyGroup.NotifyGroup.create(_notifygroup);

    const notifygroup = await NotifyGroup.NotifyGroup.findById({ _id: saved_notifygroup._id });

    return await res.json(notifygroup);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const putNotifyGroup = async (req, res, next) => {
  const _notifygroup = req.body;
  try {
    // simply update the record
    const updated_notifygroup = await NotifyGroup.NotifyGroup.findByIdAndUpdate({
      _id: req.params.id
    }, _notifygroup, {
      new: true
    });
    const notifygroup = await NotifyGroup.NotifyGroup.findById({
      _id: updated_notifygroup._id
    });
    return await res.json(notifygroup);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

module.exports = {
  postNotifyGroup,
  putNotifyGroup,
  allNotifyGroups,
  getNotifyGroupByTypeDist,
  getNotifyGroupByTypeDistAPI
};
