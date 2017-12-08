/////////////////////////////////////////////////////////////////
//tplEmbedUrlVideoIdAndTitle FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////
function tplEmbedUrlVideoIdAndTitle(baseTplHtmlItem,objArrayPassedIn){
  customYtVideoTpl=baseTplHtmlItem;
  console.log("TPL---Arg1 TplHtml BEFORE Replacing custom tags: " + baseTplHtmlItem);
  console.log("TPL---Arg2.length: " + objArrayPassedIn.length);
  //note regEx: a backslash causes the metacharacter to be treated as a literal character.  And (.*?) is regEx looking for a match 
  for(var n=0;n<objArrayPassedIn.length;n++){
    //Takes in the tpl item html and finds instances of pattern {{.*?}} and REPLACES the wildcard center the matching value
    //from the objArrayPassedIn.
    customYtVideoTpl=customYtVideoTpl.replace(/\{\{(.*?)\}\}/g,function(titleOrVideoIdHtmlTagMatch,titleOrVideoIdMatchKey){
    //replace instances in tpl that {{matching Title/VideoId}} with corresponding values from the Json abject array.
    console.log("titleOrVideoIdHtmlTagMatch: " + titleOrVideoIdHtmlTagMatch);
    console.log("titleOrVideoIdMatchKey: " + titleOrVideoIdMatchKey);  
    return objArrayPassedIn[n][titleOrVideoIdMatchKey] 
    
     })//JSON object so have two indecise.
   
  console.log("TPL---TplHtml AFTER Replacing custom tags: " + customYtVideoTpl);
  }
  return customYtVideoTpl
}
/////////////////////////////////////////////////////////////////
//tplEmbedUrlVideoIdAndTitle FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
//init FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////

//called from the index.html script tag for google api at bottom of body
//called automatically when javascript client library is loaded (aka: "function onClientLoad").
function init() {
  console.log("gapi.client init fct called/loaded");
  gapi.client.load("youtube", "v3", onYouTubeApiLoad);
  // yt api is ready
  console.log("youTube API interface called/loaded, which calls function onYouTubeApiLoad()");
}
/////////////////////////////////////////////////////////////////
//init FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
//onYouTubeApiLoad FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////
function onYouTubeApiLoad() {  
 
  gapi.client.setApiKey("AIzaSyDrC23NUzCmQfaisKqwmk0pTyomIJPwdbg");
  console.log("youTube API key is set");
  
 //ytVideoSearch()
  console.log("called ytVideoSearch()");
}
/////////////////////////////////////////////////////////////////
//onYouTubeApiLoad FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
//ytVideoSearch FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////
$(function ytVideoSearch() {

  console.log("entered the ytVideoSearch function");

  var ytSearchTerm;

  $("#mainSearch").keyup(function(e) {
      //e.preventDefault();
      if(e.keyCode == 13) { 

        console.log("ytSearch.js received keyup event");

       // ytSearchRequest();
       ytSearchTerm = ($("#user-input-main").val());

       console.log("#mainSearch ytSearchTerm: " + ytSearchTerm);

       ytSearchRequest(ytSearchTerm);

       lyricsSearchRequest(ytSearchTerm); 
        console.log("lyricsSearchRequest called()");

 }//end keycode == 13
});//end mainSearch keyup code block

  $("#topSearch").keyup(function(e) {
      //e.preventDefault();
      if(e.keyCode == 13) { 

        console.log("ytSearch.js received keyup event");

       // ytSearchRequest();
       ytSearchTerm = ($("#user-input-top").val());

       console.log("#topSearch ytSearchTerm: " + ytSearchTerm);

       ytSearchRequest(ytSearchTerm);

       lyricsSearchRequest(ytSearchTerm); 
        console.log("lyricsSearchRequest called()");

 }//end keycode == 13
});//end topSearch keyup code block

});
/////////////////////////////////////////////////////////////////
//ytVideoSearch FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
//ytSearchRequest FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////
function ytSearchRequest(ytSearchTerm){  
        // prepare the request
       console.log("ytSearchRequest called");
        //the search.list() is the basic API call to search youTube
       var request = gapi.client.youtube.search.list({
        //pass youTube API parameters to narrow your search: basically like a key:value pair list separated by commas (see below)

        //"part"--YouTube Data API: the "part" parameter included in the API request determines the data you get back in an API response 
        part: "snippet",
        //"type" could be video,channel,playlist, but we are restricting response to only video    
        type: "video",
        //"q" is a very useful/important parameter becasue it tells the youTube API to 
        //return only the search results that match the search term(s) that we pass in (basically the youTube site's search field).
        //encodeURIComponent takes the variable and preps it to be passed in URL by applying special codes for non ASCII charaters like spaces between words.  
        q: encodeURIComponent(ytSearchTerm).replace(/%20/g, "+"),//the replace method will replace what is between the // slashes. 
        //with what is in "". g (global variable) tells it to do all instances instead of just first one.  Non ASCII characters must be
        //URL-escaped when sent to the API. Basically replace %20 (the code for non ASCII "space" character) with "+" for all instances.       

        maxResults: 1,
        order: "viewCount"

       });//end prepare request 

        // execute the request
        //Once the API request call completes, the client library automatically calls onSearchResponse() below just noted as "function(response) {"
       request.execute(function onSearchResponse(response) {
        
        var results = response.result;

        $("#additionalContent").html("");

        /*Note: this is set up to access more than one video even though we limited our query to just one. It uses the 
          $.each(), below, which is a generic iterator function for looping over object, arrays, and array-like objects. 
          Plain objects are iterated via their named properties while arrays and array-like objects are iterated via their indices.
          $.each() is essentially a drop-in replacement of a traditional for or for-in loop. 
          The each() method specifies a function to run for each matched element. Syntax: $(selector).each(function(index,element)), note: function(index,element) Required. A function to run for each matched element.
        */
          $.each(results.items, function(index, item) {
            //
            //The $.get() method, below, loads data from the server using a HTTP GET request. Syntax: $.get(URL,data,function(data,status,xhr),dataType) URL is required
            // the optional function argument specifies a function to run if the request succeeds.. Additional parameters: data - contains the resulting data from the request
            //gets the tpl file, feeds the data to the tplEmbedUrlVideoIdAndTitle() which looks for the tagged key:value pair (and note value is JSON locations)
            //and appends the output html and embeded url into the specified container.  In this case the get passes item.html as arg to function.
            $.get("assets/tpl/item.html", function(baseTplHtmlItem) {
              $("#additionalContent").append(tplEmbedUrlVideoIdAndTitle(baseTplHtmlItem, [{"title":item.snippet.title, "videoid":item.id.videoId}]));
              console.log("the following title and videoId are elements of the Key:Value paired-Obj list to send to  tplEmbedUrlVideoIdAndTitle()");
              console.log("title:item.snippet.title: " + item.snippet.title);
              console.log("videoid:item.id.videoId: " + item.id.videoId);
              });
          });

          showResponse(results);//need to work on this to generate JSON in console..
       });//end execute request
}; //end ytSearchRequest
/////////////////////////////////////////////////////////////////
//ytSearchRequest FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
//lyricsSearchRequest FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////

function lyricsSearchRequest(ytSearchTerm) {
  setTimeout(function(){
    // Constructing a queryURL
    var artist = ytSearchTerm;
    console.log("artist for Lyrics query: " + artist);

    var song = $('#song-title').text();
    console.log("song for Lyrics query: " + song);
    var queryURL = "http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=" + artist + "&song=" + song + "&format=XML";//changes from json to xml
    
    console.log("lyricsSearchRequest queryURL: " + queryURL);
    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
    // After data comes back from the request
    .done(function(response) {
      console.log(response);
      console.log(queryURL);

    var xmlFindLyrics = $(response).find("Lyric").text();
    console.log("jQuery xml find: " + xmlFindLyrics);

      populateLyrics(xmlFindLyrics);//
    });
    }, 1000);//delay so that youTube title is returned
};



function populateLyrics(xmlFindLyrics) {
    $("#additionalContent2").html(xmlFindLyrics);
};

/////////////////////////////////////////////////////////////////
//showResponse FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
//showResponse FUNCTION STARTS STARTS STARTS STARTS STARTS//////
/////////////////////////////////////////////////////////////////

// Helper function to display JSON response of ytSearchRequest
function showResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
//    document.getElementById('response').innerHTML += responseString;
    console.log("API JSON RESPONSE from user ytSearchRequest: " + responseString);
}
/////////////////////////////////////////////////////////////////
//showResponse FUNCTION ENDS ENDS ENDS ENDS ENDS////////////
/////////////////////////////////////////////////////////////////