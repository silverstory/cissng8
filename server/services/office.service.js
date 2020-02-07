const util = require('util');
const Office = require('../models/office.model');

const allOffices = async (req, res, next) => {
  try {
    const result = await
      Office
        // with paginatedfield and sort ascending
        // .paginateFirst(req.query.findtext, req.query.limit, req.query.paginatedfield);
        .officesPaginated(req.query.page, req.query.limit, req.query.newestfirst);
    // res.setHeader("Content-Type", "application/json");
    return await res.json(result);
  } catch (error) {
    console.log("Error: " + error);
    return res.send("Error: " + error);
  }
}

const postOffice = async (req, res, next) => {

  // determine the base_url to be used based from
  // `distinction` and save it to a const [base_url]
  const _office = req.body;

  try {

    // create the profile record
    const saved_office = await Office.Office.create(_office);

    const office = await Office.Office.findById({ _id: saved_office._id });

    return await res.json(office);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

const putOffice = async (req, res, next) => {
  const _office = req.body;
  try {
    // simply update the record
    const updated_office = await Office.Office.findByIdAndUpdate({
      _id: req.params.id
    }, _office, {
      new: true
    });
    const office = await Office.Office.findById({
      _id: updated_office._id
    });
    return await res.json(office);
  }
  // don't forget to include error handling and
  // if error, send an error response as well
  catch (error) {
    console.log("Error: " + error);
    return await res.send("Error: " + error);
  }
}

////////shjdfudisfyhudis

const findOfficeByCode = async (req, res, next) => {
  try {
    //
    let office = null;
    const cursor = await Office.Office.find({
      code: req.params.code
    }).limit(1).cursor();
    office = await cursor.next();
    if (office != null) {
      return await res.json( office );
    } else {
      return await res.send(null);
    }

  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const findOffice = async (req, res, next) => {
  try {
    const cursor = await
    Office.Office
    .find( { $text: { $search : req.params.text } },
      { score : { $meta: "textScore" } } )
    .sort( {
      score: { $meta : 'textScore' }
    } )
    .limit(1)
    .cursor();
    let office = null;
    office = await cursor.next();
    return await res.json( office );
  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

const deleteOfficeById = async (req, res, next) => {
  try {
      const deleted = await Office.Office.findByIdAndRemove({_id: req.params.id});
      return await res.json( { success: true } );
  } catch (error) {
    console.log("Error: " + error);
    return await res.send( "Error: " + error );
  }
}

module.exports = {
  allOffices,
  postOffice,
  putOffice,
  findOfficeByCode,
  findOffice,
  deleteOfficeById
};
