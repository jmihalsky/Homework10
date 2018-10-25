require("dotenv").config({path: "./keys.env"});

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");


var api_string = "";

if(process.argv[2] == "concert-this")
{
    console.log("Bands in Town API")
    band_town();
}
else if(process.argv[2] == "spotify-this-song")
{
    spotify_api();
}
else if(process.argv[2] == "movie-this")
{
    console.log("movie API");
}
else if(process.argv[2] == "do-what-it-says")
{
    console.log("do something logic");
}
else
{
    console.log("inquirer menu will appear");
}

function remove_spaces(arg_string){
    var arg_arry = arg_string.split(" ");
    for(var i = 0; i < arg_arry.length; i++)
    {
        if(i == 0 )
        {
            api_string = arg_arry[i];
        }
        else
        {
            api_string += "+" + arg_arry[i];
        }
    }
}

function spotify_api(){
    debugger;
    remove_spaces(process.argv[3]);
    console.log(api_string);

    var spotify_keys = keys.spotify;
    console.log(spotify_keys);

    var spotify = new Spotify(keys.spotify);
    
    spotify.search({
        type: "track",
        query: api_string},
        function(err,data) {
            if(err)
            {
                console.log("Error occurred: " + err);
                return;
            }    
    
        for (var i = 0; i < data.tracks.items.length; i++)
        {
            var artist_api = data.tracks.items[i].artists[0].name;
            var album_api = data.tracks.items[i].album.name;
            var song_api = data.tracks.items[i].name;
            var song_url_api = data.tracks.items[i].artists[0].external_urls.spotify;
            
            console.log("\nArtist(s): " + artist_api + "\nSong Name: " + song_api + "\nSpotify preview link: " + song_url_api + "\nAlbum: " + album_api);
        }
        
    });
    
}

function band_town(){
    
}