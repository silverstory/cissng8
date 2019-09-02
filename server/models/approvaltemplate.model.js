const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApprovaltemplateSchema = new Schema({
  step : {
    type: Number,
    required: [true, 'Step is required'],
    index: true
  },
  distinction : {
    type: String,
    required: [true, 'Distinction is required'],
    index: true
  },
  usertype : {
    type: String,
    required: [true, 'UserType is required'],
    index: true
  },
  userisapprovalstage : {
    type: String,
    required: [true, 'UserisApprovalStage is required']
  },
  tosaveonprofilesnextstep : {
    type: Number,
    required: [true, 'toSaveonProfilesNextstep is required']
  },
  activesteptext : {
    type: String,
    required: [true, 'ActiveStepText is required']
  },
  completedsteptext : {
    type: String,
    required: [true, 'CompletedStepText is required']
  },
  dialogbuttontext : {
    type: String,
    required: [true, 'DialogButtonText is required']
  },
  showonstepper : {
    type: String,
    default: 'No',
    required: [true, 'ShowOnStepper is required']
  }
})

// ApprovaltemplateSchema.index({
//   // dateupdated: 1,
//   _id: 1
// });

ApprovaltemplateSchema.plugin(mongoosePaginate);

const Approvaltemplate = mongoose.model('Approvaltemplate', ApprovaltemplateSchema);

findTemplatesByDistinction = async (distinction, page, limit) => {
  const query = {
    distinction: distinction,
    showonstepper: "Yes"
  };
  const sortOrder = 1;
  const options = {
    sort:       { step: sortOrder },
    lean:       true,
    leanWithId: true,
    page:       parseInt(page),
    limit:      parseInt(limit)
  };

  let result = await Approvaltemplate.paginate(query, options);
  return result;
}

module.exports = {
  Approvaltemplate,
  findTemplatesByDistinction
}


