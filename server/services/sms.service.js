const config = require("../config/config");
const fetch = require('node-fetch');

// Twilio Credentials
// You must implement this in a secret
const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

const createTwilioSMS = async (number, sms) => {
  try {
    const message = await client.messages
    .create({
      to: number,
      from: config.TWILIO_FROM_NUMBER,
      body: sms,
    });
    // console.log(message.sid);
    return message.sid;

  } catch (err) {
    console.log(err)
    return null;
  }
}

const createSMS = async (number, sms) => {
  try {
    const base_url = 'http://210.213.193.148:3000/api/sms?';
    const token = await `token=${config.CISS_SMS_TOKEN}`;
    number = await number.replace('+63', '0');
    const toNumber = `&number=${number}`;
    const message = `&message=${sms}`;
    const url = `${base_url}${token}${toNumber}${message}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports.sendSMS = async (number, sms) => {
  try {
    const messageid = await createSMS(number, sms);
    return messageid;
  } catch (error) {
    console.log(err)
    return null;
  }
}
