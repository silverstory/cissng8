const util = require('util');
const UnverifiedRequest = require('../models/unverifiedrequest.model');
const sms = require('./sms.service');

const allUnverifiedRequests = async (req, res, next) => {
  try {
    const result = await
      UnverifiedRequest
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .unverifiedRequestPaginated(req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const getUserUnacted = async (usertype) => {
  try {
    let unverifiedrequest = null;
    const cursor = await
      UnverifiedRequest
        .UnverifiedRequest
        .find({
          usertype: usertype,
          acted: 'No'
        }, {
          _id: 0
        }).limit(1).cursor();
    unverifiedrequest = await cursor.next();
    if (unverifiedrequest != null) {
      return await unverifiedrequest;
    } else {
      return await null;
    }
  } catch (error) {
    console.log("Error: " + error);
    return await null;
  }
}

const getUserUnactedAPI = async (req, res, next) => {
  try {
    let unverifiedrequest = null;
    unverifiedrequest = await
      getUserUnacted(
        req.params.usertype
      );
    if (unverifiedrequest != null) {
      return await res.json(unverifiedrequest);
    } else {
      return await res.send(null);
    }
  } catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const postUnverifiedRequest = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _unverifiedrequest = req.body;
  delete _unverifiedrequest._id;

  try {

    // create the profile record
    const saved_unverifiedrequest = await UnverifiedRequest.UnverifiedRequest.create(_unverifiedrequest);

    const unverifiedrequest = await UnverifiedRequest.UnverifiedRequest.findById({ _id: saved_unverifiedrequest._id });

    return await res.json(unverifiedrequest);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

//
const findUnactedProfile = async (
  profileid,
  distinction,
  usertype) => {
  try {
    let unverifiedrequest = null;
    const cursor = await
      UnverifiedRequest
        .UnverifiedRequest
        .find({
          profileid: profileid,
          distinction: distinction,
          usertype: usertype,
          acted: 'No'
        }, '_id') // include only _id property in result
        .limit(1).cursor();
    unverifiedrequest = await cursor.next();
    if (unverifiedrequest != null) {
      return await unverifiedrequest;
    } else {
      return await null;
    }
  } catch (error) {
    console.log("Error: " + error);
    return await null;
  }
}
//

const putUnverifiedRequest = async (req, res, next) => {
  const _unverifiedrequest = req.body;
  try {
    // find document first
    let find_unverifiedrequest = null;
    find_unverifiedrequest = await
      findUnactedProfile(
        req.params.profileid,
        req.params.distinction,
        req.params.usertype);
    if (find_unverifiedrequest != null) {
      // simply update the record
      const updated_unverifiedrequest = await UnverifiedRequest
        .UnverifiedRequest
        .findByIdAndUpdate({
          _id: find_unverifiedrequest._id
        }, _unverifiedrequest, {
          new: true
        });
      const unverifiedrequest = await UnverifiedRequest.UnverifiedRequest.findById({
        _id: updated_unverifiedrequest._id
      });
      return await res.json(unverifiedrequest);
    } else {
      return await res.send(null);
    }
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

module.exports = {
  postUnverifiedRequest,
  findUnactedProfile,
  putUnverifiedRequest,
  allUnverifiedRequests,
  getUserUnacted,
  getUserUnactedAPI
};
