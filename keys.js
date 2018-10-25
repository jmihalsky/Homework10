console.log("this is loaded");

module.exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

module.exports.band_town = {
    api_key: process.env.BANDS_IN_TOWN_KEY
};