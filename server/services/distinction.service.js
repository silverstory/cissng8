const util = require('util');
const Distinction = require('../models/distinction.model');

const postDistinction = async (req, res, next) => {
  const _distinction = req.body;
  try {
    // find if record ip exist
    let find_distinction = null;
    const cursor = await Distinction.Distinction.find({
      name: _distinction.name
    }, {
      _id: 1
    }).limit(1).cursor();
    find_distinction = await cursor.next();
    if (find_distinction != null) {
      // record exists
      return await res.json({
        message: 'record exists',
        record: find_distinction
      });
    } else {
      // create the profile record
      const distinction = await Distinction.Distinction.create(_distinction);
      return await res.json(distinction);
    }
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const putDistinction = async (req, res, next) => {
  const _distinction = req.body;
  try {
    // simply update the record
    const updated_distinction = await Distinction.Distinction.findByIdAndUpdate({
      _id: req.params.id
    }, _distinction, {
      new: true
    });
    const distinction = await Distinction.Distinction.findById({
      _id: updated_distinction._id
    });
    return await res.json(distinction);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const getDistinction = async (req, res, next) => {
  try {
    const distinction = await
    Distinction.
    Distinction.
    findById({
      _id: req.params.id
    });
    return await res.json(distinction);

  } catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

// const findIpwhitelist = async (req, res, next) => {
//   try {
//     const cursor = await
//     Ipwhitelist
//     .find( { $text: { $search : req.params.text } },
//       { score : { $meta: "textScore" } } )
//     .sort( {
//       score: { $meta : 'textScore' }
//     } )
//     .limit(1)
//     .cursor();
//     let ipwhitelist = null;
//     ipwhitelist = await cursor.next();
//     return await res.json( ipwhitelist );
//   } catch (error) {
//     console.log("Error: " + error);
//     return await res.send( "Error: " + error );
//   }
// }

const deleteDistinctionById = async (req, res, next) => {
  try {
    const deleted = await Distinction.Distinction.findByIdAndRemove({
      _id: req.params.id
    });
    return await res.json({
      success: true
    });
  } catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const findDistinctionByName = async (req, res, next) => {
  try {
    //
    let distinction = null;
    const cursor = await Distinction.Distinction.find({
      name: req.params.name
    }, {
      _id: 0
    }).limit(1).cursor();
    distinction = await cursor.next();
    if (distinction != null) {
      return await res.json(distinction);
    } else {
      return await res.send(null);
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const findAllDistinction = async (req, res, next) => {
  try {
    const result = await
    Distinction
      .findAllDistinction();
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

module.exports = {
  postDistinction,
  putDistinction,
  getDistinction,
  deleteDistinctionById,
  findDistinctionByName,
  findAllDistinction
  // findIpwhitelist,
};
