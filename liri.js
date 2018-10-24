require("dotenv").config({path: "./keys.env"});

var keys = require("./keys.js");
var Spotify = require("spotify");
var fs = require("fs");


var api_string = "";

if(process.argv[2] == "concert-this")
{
    console.log("Bands in Town API")
}
else if(process.argv[2] == "spotify-this-song")
{
    console.log("Spotify API");
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
        query: api_string,
        function(err,data) {
            if(err)
            {
                console.log("Error occurred: " + err);
                return;
            }
            else
            {
                console.log(data);
            }
        }
    });
    
}