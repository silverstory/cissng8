const util = require('util');
const Approvaltemplate = require('../models/approvaltemplate.model');

const getApprovaltemplateByUserDist = async (req, res, next) => {

  const dummytemplate = {
    _id: '0',
    step: 100,
    distinction: 'NODISTINCTION',
    usertype: this.usertype,
    userisapprovalstage: 'No',
    tosaveonprofilesnextstep: 0,
    activesteptext: 'notext',
    completedsteptext: 'notext',
    dialogbuttontext: 'notext'
  };

  try {
    const _approvaltemplate = req.body;
    let approvaltemplate = null;
    const cursor = await Approvaltemplate.Approvaltemplate.find({ distinction: _approvaltemplate.distinction, usertype: _approvaltemplate.usertype }, { _id: 0 }).limit(1).cursor();
    approvaltemplate = await cursor.next();
    if (approvaltemplate != null) {
      return await res.json(approvaltemplate);
    } else {
      return await res.json(dummytemplate);
    }
  } catch (error) {
    console.log("Error: " + error);
    return await res.json(null);
  }
}

// find user by step distinction
const getApprovaltemplateByStepDist = async (req, res, next) => {
  try {
    const measure = req.body;
    let approvaltemplate = null;
    const cursor = await Approvaltemplate.Approvaltemplate
      .find({
        step: measure.step,
        distinction: measure.distinction,
        showonstepper: 'Yes'
      }, { _id: 0 }).limit(1).cursor();
    approvaltemplate = await cursor.next();
    if (approvaltemplate != null) {
      return await res.json(approvaltemplate);
    } else {
      return await res.json(null);
    }
  } catch (error) {
    console.log("Error: " + error);
    return await res.json(null);
  }
}
// end find user

const findTemplatesByDistinction = async (req, res, next) => {
  try {
    const result = await
      Approvaltemplate
        .findTemplatesByDistinction(req.query.distinction, req.query.page, req.query.limit);
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

module.exports = {
  getApprovaltemplateByUserDist,
  getApprovaltemplateByStepDist,
  findTemplatesByDistinction
};
