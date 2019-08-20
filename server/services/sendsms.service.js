const util = require('util');
const sms = require('./sms.service');

// send sms
const sendSMS = async (req, res, next) => {
  try {

    // get mobile number
    let mobile = await req.query.mobile;
    // get message
    let message = await req.query.message;

    // send SMS
    const messageid = await sms.sendSMS(mobile, message);

    if (messageid === null) {
      console.log("error sending");
      return await res.json( { success: false, message: `Sending failed` } );
    } else {
      // console.log(messageid);
      return await res.json( { success: true, message: `Message sent to ${mobile}` } );
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

module.exports = {
  sendSMS
};
