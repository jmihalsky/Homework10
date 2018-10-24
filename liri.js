var api_string = "";

if(process.argv[2] == "concert-this")
{
    console.log("Bands in Town API")
}
else if(process.argv[2] == "spotify-this-song")
{
    console.log("Spotify API");
    remove_spaces(process.argv[3]);
    console.log(api_string);

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