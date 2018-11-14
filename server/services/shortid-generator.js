// const shortid = require('shortid');
const randomize = require('randomatic');
const Profile = require('../models/profile.model');

module.exports.CreateShortId = async () => {
  try {
    let ShortId = '';
    let newShortId;
    let existing = true;
    let tries = 0;

    // shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

    //test if generated id is existing
    //will end if no entry found or if 100 tries is consumed and still random short id exists
    while(existing && tries <= 100) {

      //generate a random short id
      // newShortId = await shortid.generate();
      newShortId = await randomize('0', 8);
      tries++;

      const profile = await Profile.Profile.findOne({
        cisstoken: newShortId
      });

      if( profile == null ) {
        existing = false;
      }
    }

    //fail if 100 tries consumed
    if(tries == 100) {
      reject('Short Id generation failed')
    }
    else { //succeed otherwise and return new random short id
      ShortId = newShortId;
    }

    console.log(ShortId);

    return ShortId;

  } catch (error) {
    console.log(error);
  }
}
