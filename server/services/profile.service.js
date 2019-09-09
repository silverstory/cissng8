const util = require('util');
const Profile = require('../models/profile.model');
const encrypt = require('../services/encrypt');
const qrcode = require('../services/qrcode');
// const shortId = require('burst-short-id');
const shortId = require('./shortid-generator');
const twofactor = require('./twofactor.service');
const sms = require('./sms.service');

const getProfileByCissToken = async (req, res, next) => {
  try {
    let profile = null;
    const cursor = await Profile.Profile.find({cisstoken: req.params.token}, { _id: 0 }).limit(1).cursor();
    profile = await cursor.next();
    if ( profile != null ) {
      return await res.json( profile );
    } else {
      return await res.send("Profile not found!");
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const getAccessApprovals = async (req, res, next) => {
  try {
    const result = await
      Profile
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .profilesPaginated(req.query.findtext, req.query.distinction, req.query.nextstep, req.query.useroffice, req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json( result );
  } catch (error) {
    console.log("Error: " + error);
    return res.send( "Error: " + error );
  }
}

const getResidentByName = async (req, res, next) => {
  try {
    const result = await
      Profile
        .residentSearchByName(req.query.firstname, req.query.lastname, req.query.page, req.query.limit);
    return await res.json( result );
  } catch (error) {
    console.log("Error: " + error);
    return res.send( "Error: " + error );
  }
}

const postProfile = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _profile = req.body;
  let base_url = '';
  if ( _profile.distinction.includes('OPEMPLOYEE') ) {
    // base_url = 'https://op-proper.gov.ph/OP-ID/';
    base_url = 'http://192.168.23.8/OP-ID/';
  } else if ( _profile.distinction.includes('OPVISITOR') ) {
    // base_url = 'https://op-proper.gov.ph/OP-ID/';
    base_url = 'http://192.168.23.8/OP-ID/';
  } else if (_profile.distinction.includes('BRGYRESIDENT')) {
    // base_url = 'https://op-proper.gov.ph/OP-ID/';
    base_url = 'http://192.168.23.8/OP-ID/';
  } else if ( _profile.distinction.includes('EVENT') ) {
    // base_url = 'https://op-proper.gov.ph/OP-ID/';
    base_url = 'http://192.168.23.8/OP-ID/';
  } else {
  }

  // do not do this block of code here. do it in angular
  // try {
  //   if (_profile.accessapproval === 'Approved') {
  //       _profile.access = _profile.proviaccess;
  //   }
  // } catch (error) { }

  // if visitor, convert date field to
  // ISODate before saving document
  try {
    const time_of_appt = await ISODate(_profile.visitor.timeofappointment);
    _profile.visitor.timeofappointment = time_of_appt;
  } catch (error) { }

  try {

  _profile.dateupdated = Date.now();

  // find if record of ( profileid + distinction ) exist
  // if ( !util.isNullOrUndefined(find_profile) ) {
  let find_profile = null;
  const cursor = await Profile.Profile.find({profileid: _profile.profileid, distinction: _profile.distinction}, { _id: 1 }).limit(1).cursor();
  find_profile = await cursor.next();
  if ( find_profile != null ) {
    if (find_profile.accessapproval !== _profile.accessapproval) {
      _profile.accessdatetagged = Date.now();
    }
    // if (_profile.accessapproval === 'Provisional') {
    //   _profile.accessdatetagged = Date.now();
    // }

    // simply update the record ( no need to re-generate a token )
    // const updated_profile = await Profile.findByIdAndUpdate({_id: find_profile._id}, { name: _profile.name, email: _profile.email }, { new: true });
    const updated_profile = await Profile.Profile.findByIdAndUpdate({_id: find_profile._id}, _profile, { new: true });
    const profile = await Profile.Profile.findById({ _id: updated_profile._id });

    // make this a scheduled sending and
    // deploy it in something like cloud function

    // const mobile = await profile.mobile;
    // const qr_page = await profile.cissinqtext;
    // const access_token = await profile.cisstoken;
    // create message
    // let message = `Your request for access to Malacanang has been approved. Your 8-digit access code is : ${access_token}. You can view or download your Gate Access QR Code anytime from this url : ${qr_page}. You can use either your QR Code or 8-digit code upon entering the Malacanang compound gates.`
    // message = message.replace(/:/g, "%3A");
    // message = message.replace(/\//g, "%2F");
    // if (profile.recordstatus === 'ACTIVE' && profile.accessapproval === 'Approved' && profile.blacklisted === false) {
    //   const messageid = await sms.sendSMS(mobile, message);
    // }
    // if (messageid === null) {
    //   console.log("error sending");
    // } else {
    //   console.log(messageid);
    // }

    return await res.json( profile );

  } else {

    // create the profile record
    const saved_profile = await Profile.Profile.create(_profile);
    // take the newly created profile document
    // create a shortid from its mongo _id and save it to a const [token]
    // const token = await shortId(saved_profile._id.toString()).toUpperCase();
    const token = await shortId.CreateShortId();
    // create a HMAC from its mongo _id
    const hmac = await encrypt.generateHMAC( saved_profile._id.toString() );
    // append the HMAC to the base_url then save it to a const [url]
    const url = base_url + hmac;
    // generate two factor secret
    const secret = await twofactor.generateSecret();
    // modify the document with the new
    // code [cisscode], token [cisstoken], url [cissinqtext]
    // and two factor secret for this profile
    saved_profile.cisscode = hmac;
    saved_profile.cisstoken = token;
    saved_profile.cissinqtext = url;
    saved_profile.two_factor_secret = secret;
    // save the updated document
    const updated_profile = await Profile.Profile.findByIdAndUpdate({_id: saved_profile._id}, saved_profile, { new: true });
    const profile = await Profile.Profile.findById({ _id: updated_profile._id });

    // make this a scheduled sending and
    // deploy it in something like cloud function

    // get mobile number
    // const mobile = await profile.mobile;
    // // get url
    // const qr_page = await profile.cissinqtext;
    // // get token
    // const access_token = await profile.cisstoken;
    // // create message
    // let message = `Your request for access to Malacanang has been approved. Your 8-digit access code is : ${access_token}. You can view or download your Gate Access QR Code anytime from this url : ${qr_page}. You can use either your QR Code or 8-digit code upon entering the Malacanang compound gates.`
    // message = message.replace(/:/g, "%3A");
    // message = message.replace(/\//g, "%2F");
    // if (profile.recordstatus === 'ACTIVE' && profile.accessapproval === 'Approved' && profile.blacklisted === false) {
    //   const messageid = await sms.sendSMS(mobile, message);
    // }
    // if (messageid === null) {
    //   console.log("error sending");
    // } else {
    //   console.log(messageid);
    // }

    return await res.json( profile );
  }
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

// regex's
// colon : %3A
// \ : %5C
// / : %2F
//  /[\/]/g matches forward slashes.
//  /[\\]/g matches backward slashes.
//  /\//ig; //  Matches /

const getProfileByIdDist = async (req, res, next) => {
  try {
    //
    const _profile = req.body;
    let profile = null;
    const cursor = await Profile.Profile.find({profileid: _profile.profileid, distinction: _profile.distinction}, { _id: 0 }).limit(1).cursor();
    profile = await cursor.next();
    if ( profile != null ) {
      // add qrcode to json
      // profile.qrcode = await qrcode.createQRx64Image(profile.cissinqtext);
      const url = await qrcode.createQRx64Image(profile.cissinqtext);
      // profile.set('qrcode', url);
      return await res.json( { profile: profile, qrcode: url } );
    } else {
      return await res.send("Profile not found!");
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const getProfile = async (req, res, next) => {
  try {

    const profile = await
    Profile
    .Profile
    .findById({_id: req.params.id});
    return await res.json( profile );

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const findProfile = async (req, res, next) => {
  try {

    const cursor = await
    Profile
    .Profile
    .find( { $text: { $search : req.params.text } },
      { score : { $meta: "textScore" } } )
    .sort( {
      score: { $meta : 'textScore' }
    } )
    .limit(1)
    .cursor();

    let profile = null;
    profile = await cursor.next();
    return await res.json( profile );

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const deleteProfileByIdDist = async (req, res, next) => {
  try {
    //
    const _profile = req.body;
    let profile = null;
    const cursor = await Profile.Profile.find({profileid: _profile.profileid, distinction: _profile.distinction}, { _id: 0 }).limit(1).cursor();
    profile = await cursor.next();
    if ( profile != null ) {
      const deleted = await Profile.Profile.findByIdAndRemove({_id: profile._id});
      return await res.json( { success: true } );
    } else {
      return await res.send("Profile not found!");
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

module.exports = {
  postProfile,
  getProfileByIdDist,
  findProfile,
  getProfile,
  deleteProfileByIdDist,
  getAccessApprovals,
  getResidentByName,
  getProfileByCissToken
};
