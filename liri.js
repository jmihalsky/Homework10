require("dotenv").config({path: "./keys.env"});

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var dateFormat = require("dateformat");
// var APP_ID = keys.band_town.api_key;
// var bandsintown = require("bandsintown")(APP_ID);
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
    remove_spaces(process.argv[3]);

    var band_api_url = "https://rest.bandsintown.com/artists/" + api_string + "/events?app_id=" + keys.band_town.api_key;
    console.log(band_api_url);

    request(band_api_url,function(error,response,body){
        if(!error)
        {
            for(var i = 0; i < JSON.parse(body).length; i++)
            {
                var ven_name = JSON.parse(body)[i].venue.name;
                var location = JSON.parse(body)[i].venue.city + ", " + JSON.parse(body)[i].venue.region;
                var evt_date = dateFormat(JSON.parse(body)[i].datetime,"mm/dd/yyyy");

                var lineup = "";
                for(var x=0; x < JSON.parse(body)[i].lineup.length; x++)
                {
                    if(x == 0)
                    {
                        lineup = JSON.parse(body)[i].lineup[x];
                    }
                    else
                    {
                        lineup += " ," + JSON.parse(body)[i].lineup[x];
                    }
                }
                console.log("\nVenue Name: " + ven_name + "\nLocation: " + location + "\nEvent Date: " + evt_date + "\nLineup: " + lineup);
            }
        }
    })
}