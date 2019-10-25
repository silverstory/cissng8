const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create ninja schema & model
const DistinctionSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Id is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    index: true
  },
  alias: {
    type: String,
    required: [true, 'Alias is required'],
    index: true
  },
  chipcolor: {
    type: String,
    default: 'primary'
  },
  default_color: {
    type: String,
    default: 'primary'
  },
  badge: {
    type: Number,
    default: 0
  },
  badgehidden: {
    type: Boolean,
    default: true
  },
  badgecolor: {
    type: String,
    default: 'accent'
  },
  badgesize: {
    type: String,
    default: 'medium',
  },
  canreceivesms: {
    type: String,
    default: 'Yes',
  },
  datecreated: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'distinctions',
  read: 'nearest'
});
DistinctionSchema.index({
  id: 1,
  name: 1,
  alias: 1,
  _id: 1
});

DistinctionSchema.plugin(mongoosePaginate);

const Distinction = mongoose.model('Distinction', DistinctionSchema);

findAllDistinction = async () => {
  const query = {};
  const sortOrder = 1;
  const page = 1;
  const limit = 100;
  const options = {
    sort:       { id: sortOrder },
    lean:       true,
    leanWithId: true,
    page:       parseInt(page),
    limit:      parseInt(limit)
  };

  let result = await Distinction.paginate(query, options);
  return result;
}

module.exports = {
  Distinction,
  findAllDistinction
}
