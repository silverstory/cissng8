const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create ninja schema & model
const ProfileSchema = new Schema({
  profileid: {
    type: String,
    required: [true, 'Profile ID is required'],
    index: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile No. is required'],
    index: true
  },
  email: {
    type: String
  },
  name: {
    first: {
      type: String,
      required: [true, 'Firstname is required'],
      index: true
    },
    middle: {
      type: String
    },
    last: {
      type: String,
      required: [true, 'Lastname is required'],
      index: true
    }
  },
  distinction: {
    type: String,
    required: [true, 'Distinction is required']
  },
  personaccesslevel: {
    type: String,
    default: 'PASSING THROUGH',
    required: [true, 'Person Access Level is required']
  },
  recordstatus: {
    type: String,
    required: [true, 'Record Status is required']
  },
  cisscode: {
    type: String
  },
  cissinqtext: {
    type: String
  },
  cisstoken: {
    type: String,
    unique: true
  },
  rfid: {
    type: String,
    unique: true
  },
  photothumbnailurl: {
    type: String,
    default: 'http://192.168.23.8/assets/face_icon/DEFAULT_MALE.svg'
  },
  employee: {
    position: {
      type: String
    },
    office: {
      type: String
    }
  },
  resident: {
    city: {
      type: String
    },
    district: {
      type: String
    },
    barangay: {
      type: String
    }
  },
  visitor: {
    visitorid: {
      type: String
    },
    visitorcompany: {
      type: String
    },
    persontovisit: {
      type: String
    },
    visitorpurpose: {
      type: String
    },
    visitordestination: {
      type: String
    },
    timeofappointment: {
      type: Date
    },
    visitstatus: {
      type: String
    }
  },
  event: {
    eventcode: {
      type: String
    },
    guestaffiliation: {
      type: String
    },
    eventid: {
      type: String
    },
    eventname: {
      type: String
    },
    eventdetails: {
      type: String
    },
    eventcreator: {
      type: String
    },
    timeofevent: {
      type: Date
    }
  },
  datecreated: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  },
  dateupdated: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  },
  two_factor_temp_secret: {
    type: String
  },
  two_factor_secret: {
    type: String
  },
  two_factor_enabled: {
    type: Boolean,
    default: true
  },
  access: {
    one: {
      type: String,
      default: 'notSelected'
    },
    two: {
      type: String,
      default: 'notSelected'
    },
    three: {
      type: String,
      default: 'notSelected'
    },
    four: {
      type: String,
      default: 'notSelected'
    },
    colorone: {
      type: String,
      default: 'lightgray'
    },
    colortwo: {
      type: String,
      default: 'lightgray'
    },
    colorthree: {
      type: String,
      default: 'lightgray'
    },
    colorfour: {
      type: String,
      default: 'lightgray'
    },
  },
  proviaccess: {
    one: {
      type: String,
      default: 'notSelected'
    },
    two: {
      type: String,
      default: 'notSelected'
    },
    three: {
      type: String,
      default: 'notSelected'
    },
    four: {
      type: String,
      default: 'notSelected'
    },
    colorone: {
      type: String,
      default: 'lightgray'
    },
    colortwo: {
      type: String,
      default: 'lightgray'
    },
    colorthree: {
      type: String,
      default: 'lightgray'
    },
    colorfour: {
      type: String,
      default: 'lightgray'
    },
  },
  gender: {
    type: String,
    default: 'male'
  },
  nextstep: {
    type: Number,
    default: 0
  },
  accessapproval: {
    type: String,
    default: 'New Record'
  },
  accessdatetagged: {
    type: Date,
    default: Date.now
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'profiles',
  read: 'nearest'
});
ProfileSchema.index({
  rfid: 'text',
  cisscode: 'text',
  cisstoken: 'text',
  cissinqtext: 'text'
}, {
  weights: {
    rfid: 4,
    cisscode: 3,
    cisstoken: 2,
    cissinqtext: 1
  }
});
ProfileSchema.index({
  accessdatetagged: 1,
  accessapproval: 1,
  distinction: 1,
  _id: 1
});

// ProfileSchema.index( { cissinqtext: 'text', cisstoken: 'text' }, { weights: { cissinqtext: 3, cisstoken: 2, 'name.first': 1 }} );

// To create an index to support text search on, say, cissinqtext and name.first:
// ProfileSchema.index( { cissinqtext: 'text', 'name.first': 'text' } );
// Or if you want to include all string fields in the index, use the '$**' wildcard:
// schema.index({'$**': 'text'});

// this will add paginate function.
// ProfileSchema.plugin(MongoPaging.mongoosePlugin);
ProfileSchema.plugin(mongoosePaginate);

const Profile = mongoose.model('Profile', ProfileSchema);

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
profilesPaginated = async (findText, distinction, nextstep, useroffice, page, limit, newestFirst) => {
  // try {
  //   // default function is "paginate"
  //   const result = await Profile.paginate({
  //     query: {
  //       accessapproval: findText
  //     },
  //     paginatedField: 'accessdatetagged',
  //     limit: parseInt(limit),
  //     sortAscending: false
  //   });
  //   return await result;
  // } catch (error) {
  //   console.log(error);
  //   return error;
  // }

  let query = {};
  let qry = {
    accessapproval: findText,
    distinction: distinction,
    nextstep: nextstep
  };
  if (useroffice !== 'NONE') {

    if (distinction.includes('OPEMPLOYEE')) {
      qry = {
        accessapproval: findText,
        distinction: distinction,
        nextstep: nextstep,
        "employee.office": useroffice
      };
    } else if (distinction.includes('OPVISITOR')) {
      qry = {
        accessapproval: findText,
        distinction: distinction,
        nextstep: nextstep,
        "visitor.visitordestination": useroffice
      };
    } else if (distinction.includes('BRGYRESIDENT')) {
      qry = {
        accessapproval: findText,
        distinction: distinction,
        nextstep: nextstep,
        "resident.barangay": useroffice
      };
    } else if (distinction.includes('EVENT')) {

      // initialize to show NO event
      qry = {
        accessapproval: findText,
        distinction: distinction,
        nextstep: 100
      };

      const creators = ['AO', 'PO', 'OP', 'AP'];
      const eventcode = useroffice;
      const sub_useroffice = useroffice.substring(0, 2);
      const eventcreator = sub_useroffice;
      // check if useroffice is using event code format
      const regex = /^((\s)*([a-zA-Z]{2}))([0-9]{6})?$/g;
      // will match AO1234
      // const found = eventcode.match(regex);
      const found = regex.test(eventcode);
      // if useroffice is AO or PO then show events created by office
      if (creators.includes(eventcreator)) {
        // show all events that office has created
        qry = {
          accessapproval: findText,
          distinction: distinction,
          nextstep: nextstep,
          "event.eventcreator": eventcreator
        };
      }
      // if eventcreator is SA - usertype is PSG (SA for Security Administrator)
      if (eventcreator === 'SA') {
        // just show all events to PSG
        qry = {
          accessapproval: findText,
          distinction: distinction,
          nextstep: nextstep
        };
      }
      if (found === true && eventcode.length === 8 ) {
        // show specific event to user
        qry = {
          accessapproval: findText,
          distinction: distinction,
          nextstep: nextstep,
          "event.eventcode": eventcode
        };
      }
    } else {}
  } else {}

  query = qry;
  const isTrueSet = (newestFirst === 'true');
  const sortOrder = isTrueSet === true ? -1 : 1;
  const options = {
    sort: {
      accessdatetagged: sortOrder
    },
    lean: true,
    leanWithId: true,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  let result = await Profile.paginate(query, options);
  return result;
}

residentSearchByName = async (firstname, lastname, page, limit) => {
  const query = {
    "name.first": {
      $regex: new RegExp(firstname, "i")
    },
    "name.last": {
      $regex: new RegExp(lastname, "i")
    },
    distinction: 'BRGYRESIDENT'
  };
  const sortOrder = 1;
  const options = {
    sort: {
      "name.last": sortOrder,
      "name.first": sortOrder
    },
    lean: true,
    leanWithId: true,
    page: parseInt(page),
    limit: parseInt(limit)
  };

  let result = await Profile.paginate(query, options);
  return result;
}

// You'd need to use a case-insensitive regular expression for this one, e.g.

// db.collection.find( { "name" : { $regex : /Andrew/i } } );
// To use the regex pattern from your thename variable, construct a new RegExp object:

// var thename = "Andrew";
// db.collection.find( { "name" : { $regex : new RegExp(thename, "i") } } );
// Update: For exact match, you should use the regex "name": /^Andrew$/i. Thanks to Yannick L.

module.exports = {
  Profile,
  profilesPaginated,
  residentSearchByName
}
