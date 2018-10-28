require("dotenv").config({path: "./keys.env"});

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");
var dateFormat = require("dateformat");

var fs = require("fs");

var log_file = "log.txt"

var ran_file = "random.txt";


var api_string = "";
var ran_string = "";

var help1 = "\nThe concert-this command searches dates which a band entered have up coming.\nYou will enter the following command on the command line. \n$ node liri.js concert-this [band name (this can be in quotes or not)].";

var help2 = "\nThe spotify-this-song command searches for song and albums by artists on Spotify.\nYou will enter the following command on the command line. \n$ node liri.js spotify-this-song [song name (this can be in quotes or not)]";

var help3 = "\nThe movie-this command searches for movie information based on the movie title entered.\nYou will enter the following command on the command line.\n$ node liri.js movie-this [movie title (this can be entered in quotes or not)]."

var help4 = "\nThe do-what-it-says command looks up the command stored in a text file and performs that action from a previous command performed.\nYou will enter the following command on the command line.\n$ node liri.js do-what-it-says";

var help5 = "\nThe Bands in town search is the same as the concert-this command.\nYou will be prompted to enter a bands name that will be used in the search for events for the band entered.";

var help6 = "\nThe Spotify Artist, Album, Song Search will search Spotify to find songs like the command.\nYou will be prompted to enter a song that will be searched.";

var help7 = "\nThe OMDB Movie Search will look up mvoie information like the command version.\nYou will be prompted to enter a movie title when selecting this option.";

var help8 = "\nThe Do as I say option will run the command and argument from a text file from previous selections."

if(process.argv[2] == "concert-this")
{
    remove_spaces(1,process.argv);
    band_town();
}
else if(process.argv[2] == "spotify-this-song")
{
    remove_spaces(1,process.argv);
    spotify_api();
}
else if(process.argv[2] == "movie-this")
{
    remove_spaces(1,process.argv);
    omdb_api();
}
else if(process.argv[2] == "do-what-it-says")
{
   do_what_i_say();
}
else
{
    console.log("inquirer menu will appear");
    
   inq_menu();
}

function remove_spaces(cmdmnu,process_arry){
    if(cmdmnu == 1)
    {
        if (process_arry.length < 5)
        {
            var arg_arry = process_arry[3].split(" ");
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
        else
        {
            for(var i = 3; i < process_arry.length; i++)
            {
                if(i == 3)
                {
                    api_string = process_arry[i];
                }
                else
                {
                    api_string += "+" + process_arry[i];
                }
            }
        }
    }
    else if (cmdmnu == 2)
    {
        var arg_arry = process_arry.split(" ");
        for (var i = 0; i < arg_arry.length; i++)
        {
            if (i == 0 )
            {
                api_string = arg_arry[i];
            }
            else
            {
                api_string += "+" + arg_arry[i];
            }
        }

    }
}

function remove_pluses(api_string){
    var api_array = api_string.split("+");
    for (var i = 0; i < api_array.length; i++)
    {
        if (i == 0)
        {
            ran_string = api_array[i];
        }
        else
        {
            ran_string += " " + api_array[i];
        }
    }
}

function spotify_api(){
    
    
    var spotify_keys = keys.spotify;

    var spotify = new Spotify(keys.spotify);
    
    spotify.search({
        type: 'track',
        query: api_string},
        function(err,data) {
            if(err)
            {
                console.log("Error occurred: " + err);
                api_string = "The+Sign";
                spotify_api()
                return;
            }    
        for (var i = 0; i < data.tracks.items.length; i++)
        {
            var artist_api = data.tracks.items[i].artists[0].name;
            var album_api = data.tracks.items[i].album.name;
            var song_api = data.tracks.items[i].name;
            var song_url_api = data.tracks.items[i].artists[0].external_urls.spotify;
            
            console.log("\nArtist(s): " + artist_api + "\nSong Name: " + song_api + "\nSpotify preview link: " + song_url_api + "\nAlbum: " + album_api);

            remove_pluses(api_string);

            var ran_info_string = "spotify-this-song,'" + ran_string + "'";

            fs.writeFile(ran_file,ran_info_string,function(err){
                if(err){
                    return console.log(err);
                }
            });
        }
        
    });
    
}

function band_town(){
    // remove_spaces(process.argv);

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

function omdb_api(){
    // remove_spaces(process.argv);

    var movie_api_url = "http://www.omdbapi.com/?t=" + api_string + "&y=&plot=short&apikey=trilogy";

    request(movie_api_url,function(error,response,body) {
        if(!error && response.statusCode === 200)
        {
            var movie_title = JSON.parse(body).title;
            var movie_year = JSON.parse(body).year;
            var imdb_rating = JSON.parse(body).imdbRating;
            for (var i = 0; i < JSON.parse(body).Ratings.length; i++)
            {
                if (JSON.parse(body).Ratings[i].Source == "Rotten Tomatoes")
                {
                    var rottom_rating = JSON.parse(body).Ratings[i].Value;
                }
            }

            var movie_coo = JSON.parse(body).Country;
            var movie_lang = JSON.parse(body).Language;
            var movie_plot = JSON.parse(body).Plot;
            var movie_actors = JSON.parse(body).Actors;

            console.log("\nMovie Title: " + movie_title + "\nMovie Release Year: " + movie_year + "\nIMDB Rating: " + imdb_rating + "\nRotten Tomatoes Rating: " + rottom_rating + "\nMovie Production Country: " + movie_coo + "\nMovie Language: " + movie_lang + "\nMovie Plot: " + movie_plot + "\nActors in the Movie: " + movie_actors);

        }
    });
}

function do_what_i_say(){
    fs.readFile(ran_file,"utf8",function(error,data){
        if (error){
            return console.log(error);
        }
        var ranData = data.split(",");

        api_string = ranData[1].replace(/["']/g, "");

        spotify_api();
    });
}

function help_info(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select a main help topic:",
            choices: ["liri command line","liri menu options"],
            name: "main_help_menu"
        }
    ]).then(function(MainHelp){
        switch(MainHelp.main_help_menu)
        {
            case "liri command line":
                liri_cmd_hlp();
                break;
            case "liri menu options":
                liri_mnu_help();
                break;
        }
    });
}

function liri_cmd_hlp(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select a liri command you would like to see help on",
            choices: ["concert-this","spotify-this-song","movie-this","do-what-it-says","All"],
            name: "cmd_help"
        }
    ]).then(function(CmdHelp){
        switch(CmdHelp.cmd_help)
        {
            case "concert-this":
                console.log(help1);
                rtn_mnu();  
                break;
            case "spotify-this-song":
                console.log(help2);
                rtn_mnu();
                break;
            case "movie-this":
                console.log(help3);
                rtn_mnu();
                break;
            case "do-what-it-says":
                console.log(help4);
                rtn_mnu();
                break;
            default:
                console.log(help1 + "\n" + help2 + "\n" + help3 + "\n" + help4);
                rtn_mnu();
                break;
        }
    });
}

function liri_mnu_help(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select a liri menu option you would like to see help on.",
            choices: ["Bands in town search","Spotify Artist, Album, Song Search","OMDB Movie Search","Do as I say"],
            name: "mnuHelp"
        }
    ]).then(function(MnuHelp){
        switch(MnuHelp.mnuHelp)
        {
            case "Bands in town search":
                console.log(help5);
                rtn_mnu();
                break;
            case "Spotify Artist, Album, Song Search":
                console.log(help6);
                rtn_mnu();
                break;
            case "OMDB Movie Search":
                console.log(help7);
                rtn_mnu();
                break;
            case "Do as I say":
                console.log(help8);
                rtn_mnu();
                break;
        }
    });
}

function rtn_mnu(){
    inquirer.prompt([
        {
            type: "confirm",
            message: "Do you want to go back to the main menu?",
            name: "rtn_menu",
            default: true
        }
    ]).then(function(Rtn_menu){
        if (Rtn_menu.rtn_menu)
        {
            inq_menu();
        }
    })
}

function inq_menu(){
    inquirer.prompt([
        {
            type: "list",
            message: "Select one of the Liribot function to perform: ",
            choices: ["Bands in town search","Spotify Artist, Album, Song Search","OMDB Movie Search","Do as I say option","Help"],
            name: "main_menu_choices"
        }

    ]).then(function(MainMenuResponse){
        switch(MainMenuResponse.main_menu_choices)
        {
            case "Bands in town search":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter the band you would like concert information on: ",
                        name: "band"
                    }
                ]).then(function(BandsOption){
                    remove_spaces(2,BandsOption.band);
                    band_town();
                });
                break;
            case "Spotify Artist, Album, Song Search":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter a song, album, or band to search on Spotify.",
                        name: "spotify"
                    }
                ]).then(function(SpotifyOption){
                    remove_spaces(2,SpotifyOption.spotify);
                    spotify_api();
                });
                break;
            case "OMDB Movie Search":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "Enter a movie title to find information on.",
                        name: "OMDB"
                    }
                ]).then(function(MovieOption){
                    remove_spaces(2,MovieOption.OMDB);
                    omdb_api();
                });
                break;
            case "Do as I say option":
                do_what_i_say();
                break;
            default:
                help_info();
                break;
        }
    });
}