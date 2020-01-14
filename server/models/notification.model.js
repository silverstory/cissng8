const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create ninja schema & model
const NotificationSchema = new Schema({
  distinction: {
    type: String,
    required: [true, 'Distinction is required'],
    index: true
  },
  usertype: {
    type: String,
    required: [true, 'Usertype is required'],
    index: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    index: true
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    index: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  datetimesent: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'notifications',
  read: 'nearest'
});
NotificationSchema.index({
  distinction: 'text',
  username: 'text',
  usertype: 'text',
  number: 'text'
}, {
  weights: {
    distinction: 4,
    username: 3,
    usertype: 2,
    number: 1
  }
});
NotificationSchema.index({
  distinction: 1,
  username: 1,
  usertype: 1,
  number,
  _id: 1
});

// this will add paginate function.
NotificationSchema.plugin(mongoosePaginate);

const Notification = mongoose.model('Notification', NotificationSchema);

// Pagination Options

// Performs a find() query on a passed-in Mongo collection, using criteria you specify. The results
// are ordered by the paginatedField.

// @param {MongoCollection} collection A collection object returned from the MongoDB library's
//    or the mongoist package's `db.collection(<collectionName>)` method.
// @param {Object} params
//    -query {Object} The find query.
//    -limit {Number} The page size. Must be between 1 and `config.MAX_LIMIT`.
//    -fields {Object} Fields to query in the Mongo object format, e.g. {_id: 1, timestamp :1}.
//      The default is to query all fields.
//    -paginatedField {String} The field name to query the range for. The field must be:
//        1. Orderable. We must sort by this value. If duplicate values for paginatedField field
//          exist, the results will be secondarily ordered by the _id.
//        2. Indexed. For large collections, this should be indexed for query performance.
//        3. Immutable. If the value changes between paged queries, it could appear twice.
//        4. Complete. A value must exist for all documents.
//      The default is to use the Mongo built-in '_id' field, which satisfies the above criteria.
//      The only reason to NOT use the Mongo _id field is if you chose to implement your own ids.
//    -sortAscending {Boolean} True to sort using paginatedField ascending (default is false - descending).
//    -next {String} The value to start querying the page.
//    -previous {String} The value to start querying previous page.
// @param {Function} done Node errback style function.
// exports.method = function() {};
notificationsPaginated = async (page, limit, newestFirst) => {

  let query = {};

  query = qry;
  const isTrueSet = (newestFirst === 'true');
  const sortOrder = isTrueSet === true ? -1 : 1;
  const options = {
    sort: {
      datetimesent: sortOrder
    },
    lean: true,
    leanWithId: true,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  let result = await Notification.paginate(query, options);
  return result;
}

notificationSearchByUserType = async (usertype, page, limit, newestFirst) => {
  const query = {
    usertype: usertype
  };
  const isTrueSet = (newestFirst === 'true');
  const sortOrder = isTrueSet === true ? -1 : 1;
  const options = {
    sort: {
      datetimesent: sortOrder
    },
    lean: true,
    leanWithId: true,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  let result = await Notification.paginate(query, options);
  return result;
}

// You'd need to use a case-insensitive regular expression for this one, e.g.

// db.collection.find( { "name" : { $regex : /Andrew/i } } );
// To use the regex pattern from your thename variable, construct a new RegExp object:

// var thename = "Andrew";
// db.collection.find( { "name" : { $regex : new RegExp(thename, "i") } } );
// Update: For exact match, you should use the regex "name": /^Andrew$/i. Thanks to Yannick L.

module.exports = {
  Notification,
  notificationsPaginated,
  notificationSearchByUserType
}
