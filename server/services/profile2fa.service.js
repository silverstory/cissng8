const util = require('util');
const Profile = require('../models/profile.model');
const encrypt = require('../services/encrypt');
const qrcode = require('../services/qrcode');
const twofactor = require('./twofactor.service');
const sms = require('./sms.service');

// prove identity
// json body { profileid, distinction }
const proveIdentity = async (req, res, next) => {
  try {
    //
    const _profile = req.body;
    let profile = null;
    const cursor = await Profile.Profile.find({profileid: _profile.profileid, distinction: _profile.distinction}, { _id: 0 }).limit(1).cursor();
    profile = await cursor.next();
    if ( profile != null ) {
      // get mobile number
      const mobile = await profile.mobile;
      // get secret
      const secret = await profile.two_factor_secret;
      // generate token
      const token = await twofactor.generateToken(secret);
      // create message
      const message = `Your token is : ${token}`
      // send token via SMS
      const messageid = await sms.sendSMS(mobile, message);

      if (messageid === null) {
        console.log("error sending");
        return await res.json( { success: false, message: `A text message with a 6-digit verification code was just sent to ${profile.name.first} ${profile.name.last}'s mobile number` } );
      } else {
        console.log(messageid);
        return await res.json( { success: true, message: `A text message with a 6-digit verification code was just sent to ${profile.name.first} ${profile.name.last}'s mobile number` } );
      }

    } else {
      return await res.json( { success: true, message: `something went wrong :(` } );
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

// verify token
// json body { profileid, distinction, token }
const verifyToken = async (req, res, next) => {
  try {
    //
    const _profile = req.body;
    let profile = null;
    const cursor = await Profile.Profile.find({profileid: _profile.profileid, distinction: _profile.distinction}, { _id: 0 }).limit(1).cursor();
    profile = await cursor.next();
    if ( profile != null ) {
      // get secret
      const secret = await profile.two_factor_secret;
      // get token
      const token = await _profile.token;
      // generate token
      const verified = await twofactor.verifyToken(secret, token);
      return await res.json( { success: verified } );
    } else {
      return await res.json( { success: false, message : 'profile not found' } );
    }
  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

module.exports = {
  proveIdentity,
  verifyToken
};
