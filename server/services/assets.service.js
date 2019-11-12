const config = require('../config/config');

const photo_base_url = config.PHOTO_BASE_URL;
const socket_ip = config.SOCKET_IP;

const getSocketIP = async (req, res, next) => {
    try {
        return await res.json( { socket_ip: socket_ip } );
    } catch (error) {
        console.log("Error: " + error);
        return await res.send( "Error: " + error );
    }
}

const getPhotoBaseUrl = async (req, res, next) => {
    try {
        return await res.json( { image_source: photo_base_url } );
    } catch (error) {
        console.log("Error: " + error);
        return await res.send( "Error: " + error );
    }
}

module.exports = {
    getSocketIP,
    getPhotoBaseUrl
};
