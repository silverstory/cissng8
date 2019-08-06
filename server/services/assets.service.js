const config = require('../config/config');

const photo_base_url = config.PHOTO_BASE_URL;

const getPhotoBaseUrl = async (req, res, next) => {
    try {
        return await res.json( { image_source: photo_base_url } );
    } catch (error) {
        console.log("Error: " + error);
        return await res.send( "Error: " + error );
    }
}

module.exports = {
    getPhotoBaseUrl
};
