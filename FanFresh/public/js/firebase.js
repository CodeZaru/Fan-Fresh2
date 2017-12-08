/* global firebase moment */

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCGiMiBlS1F8j9rrmy6XmZHTHirsxKQcKg",
    authDomain: "fan-fresh.firebaseapp.com",
    databaseURL: "https://fan-fresh.firebaseio.com",
    projectId: "fan-fresh",
    storageBucket: "",
    messagingSenderId: "674216942943"
  };

  firebase.initializeApp(config);

var database = firebase.database();

var searches = {};
var searchesSorted = [];

database.ref("/search").on('value',function(snapshot) {
    searches = snapshot.val();
   
  
    if(searches){
        searchesSorted = Object.values(searches).sort(sortSearches);

    }
    
//   console.log(searchesSorted);
    
    //NEW FIREBASE FOR TOP ARTISTS
//    console.log(searchesSorted[0]);
//    console.log(searchesSorted[1]);
//    console.log(searchesSorted[2]);
//    console.log(searchesSorted[3]);
//    console.log(searchesSorted[4]);
                    
    $("#first").replaceWith(searchesSorted[0].name)
    $("#second").replaceWith(searchesSorted[1].name)
    $("#third").replaceWith(searchesSorted[2].name)
    $("#fourth").replaceWith(searchesSorted[3].name)
    $("#fifth").replaceWith(searchesSorted[4].name)
    $("#current-top-artist").replaceWith(searchesSorted[0].name)
});

 //END NEW FIREBASE FOR TOP ARTISTS
    

function addSearchClicks(whichinput, whichdiv) {
    $(whichdiv).keyup(function(event) {
        
        var clickCounter = 0;
        
        if(event.keyCode == 13) {
          var artistName = $(whichinput).val().trim().toLowerCase();
           
            if (searches && searches[artistName]){
                clickCounter = searches[artistName].click;
            }   
            clickCounter++;

            // Uploads artist data to database
             database.ref("/search/"+artistName).set({
                name: artistName,
                click: clickCounter
             });
        };
        
    });
}

addSearchClicks("#user-input-main", "#mainSearch");
addSearchClicks("#user-input-top", "#topSearch");

function sortSearches (a,b) {
    
    return b.click - a.click;
    
}

// This is the code to swap the top artists on the index page 
var counter = 0;
var htmlTextToFlip = $("#flipper");
setInterval(flipIt, 2000);

//console.log(searchesSorted[counter].name);

function flipIt() {
    // This function takes the id of flipper in our DOM and changes the inner html to the five current top artists and starts over when it gets to the fifth one.
    htmlTextToFlip.html(searchesSorted[counter].name);
    counter++;
    
    if (counter >= 5) {
        counter = 0;
    }
}

