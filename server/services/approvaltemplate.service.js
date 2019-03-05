const util = require('util');
const Approvaltemplate = require('../models/approvaltemplate.model');

const getApprovaltemplateByUserDist = async (req, res, next) => {
  try {
    //
    const _approvaltemplate = req.body;
    let approvaltemplate = null;
    const cursor = await Approvaltemplate.find({distinction: _approvaltemplate.distinction, usertype: _approvaltemplate.usertype}, { _id: 0 }).limit(1).cursor();
    approvaltemplate = await cursor.next();
    if (approvaltemplate != null) {
      return await res.json( approvaltemplate );
    } else {
      return await res.send(null);
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

module.exports = getApprovaltemplateByUserDist;
