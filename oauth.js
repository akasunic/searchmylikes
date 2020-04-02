// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//first step: add results to storage-- for now, leaving date out, but should probably hae that


//*************LOOK INTO turning all this into background.js-- like, not the search bar part, but loading the videos. oh or like, not background.js actually-- need to load once a day and store. easier to just keep as is. background.js would still need to be loaded multiple times a day
'use strict';
var pageToken = '';
var videoArray = [];
var links;

// Probably not with a button. Probably it just happens when you click the extension icon. And then a search bar appears. Which would mean you'd want this as a pop up.
// maybe brwoser_action is already considered a pop-up, I dunno
window.onload = function() {
//   document.querySelector('button').addEventListener('click', fetchResults(pageToken));


  chrome.storage.local.get(['videos'], function(result) {
    console.log(result.videos);
    if (result.videos == undefined){
      console.log('fetching results');
      fetchResults(pageToken);
    }
    else{
      getStoredResults();
    }
  });


  // fetchResults(pageToken);


  document.querySelector('#refresh').addEventListener('click', function(){
    videoArray = [];
    fetchResults(pageToken);
  });

  document.querySelector('#mySearchButton').addEventListener('click', function(){
    document.querySelector('#mySearchResults').innerHTML = '';
    var searchCriteria = document.querySelector('#mySearchBar').value.toUpperCase().split(" ");
    // console.log("searchCriteria length: ", searchCriteria.length);
    var i;
    for (i=0; i<videoArray.length; i++){
      var wordCount = 0;
      var currentLink = videoArray[i];
      // console.log(currentLink);
      var x; var word;
      for (x = 0; x<searchCriteria.length; x++){
        word = searchCriteria[x];
        // console.log(currentLink);
        if (currentLink.title.toUpperCase().indexOf(word)>-1 || currentLink.channel.toUpperCase().indexOf(word)>-1){
          wordCount += 1;
        }
    }
    // console.log('exited word for loop');
    if (wordCount === searchCriteria.length){
      //display the link if all search criteria met
      //could change options for search if desired, but let's start with this
      //first let's just make page of links
      //then maybe add thumbnails and channel
      var div = document.createElement('div');
      var image = document.createElement('img');
      image.src = currentLink.thumbnail;
      var match = document.createElement('a');
      match.href = currentLink.link;
      match.innerHTML = currentLink.title;
      div.appendChild(image);
      div.appendChild(match);
      document.querySelector('#mySearchResults').appendChild(div);
    }
  }//ends outer for loop (videoArray loop)



});//ends search button functionality code

}




var fetchResults = function(pageToken){
  document.querySelector('#myLoadMessage').innerHTML = "Loading your videos, this may take a moment.";
  document.querySelector("#mySearchBar").style.display = "none";
  document.querySelector("#mySearchButton").style.display = "none";


  chrome.identity.getAuthToken({interactive: true}, function(token) {
      var init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };  


      fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50' + pageToken, init)
        .then((response) => response.json())
          .then(function(data){
            // console.log(data);
            //next page token, for running fetch next time
            pageToken = '&pageToken=' + data.nextPageToken;
            //add each item to the video array for searching
            links = data.items;
            var i;
            for (i=0; i<links.length; i++){
              var link = 'https://www.youtube.com/watch?v=' + links[i]['id'];
              var snippet = links[i]['snippet'];
              var title = snippet.title;
              var channel = snippet.channelTitle;
              var thumbnail = snippet.thumbnails.default.url;
              var item = {'link': link, 'title': title, 'channel':channel, 'thumbnail': thumbnail};
              videoArray.push(item);
            }
            //WORKING PRETTY WELL BUT NEXTPAGETOKEN STOPS APPEARING AT VIDEO 989. MAY NEED A WORKAROUND!!
      // if(test > 2){ //to keep testing short
      if(pageToken == '&pageToken=undefined'){ //referring to my pages, in particular
        // console.log(pageToken);
        // console.log('outOfPages');
        // console.log(videoArray.length);
        var today = (new Date()).toJSON();
        chrome.storage.local.set({'videos': videoArray,'date': today}, function(){
          console.log(videoArray);
        });
        document.querySelector('#myLoadMessage').innerHTML = "Videos loaded. Search away!";
        document.querySelector("#mySearchBar").style.display = "block";
        document.querySelector("#mySearchButton").style.display = "block";
        //add Search functionality to search button now
        //searching for each word, by channel or title only

        // ADD FUNCTIONALITY TO BUTTON HERE (COULD ALSO CHANGE COLOR OF BUTTON OR SOMETHING)
        //WILL ALSO WANT A MESSAGE FOR ERROR IF VIDEOS NOT PROPERLY LOADING

      }
      else{
        fetchResults(pageToken);
      }
           

        });//ends function using data
  
      //keep looging next page token until there are no more pages, thanks to:::
        //TRYING: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
      
        

      });//ends chrome.identity statement


 }//ends fetchReults definition


var getStoredResults = function(){
    chrome.storage.local.get(['videos', 'date'], function(result) {
      videoArray = result.videos;
      var storedDate = new Date(result.date);
      console.log(storedDate);
      document.querySelector('#date').innerHTML = "This video list was last updated on " + storedDate + ". You can choose to update the list to include all your most recent likes. It may take a moment, depending on how many videos you've liked.";
      document.querySelector('#myLoadMessage').innerHTML = "Videos loaded. Search away!";
      document.querySelector("#mySearchBar").style.display = "block";
      document.querySelector("#mySearchButton").style.display = "block";
    });
    
};

