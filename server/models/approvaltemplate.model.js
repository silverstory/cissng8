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
  }
})

// ApprovaltemplateSchema.index({
//   // dateupdated: 1,
//   _id: 1
// });

const Approvaltemplate = mongoose.model('Approvaltemplate', ApprovaltemplateSchema);

module.exports = Approvaltemplate;


