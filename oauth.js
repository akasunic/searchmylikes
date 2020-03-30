// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


//*************LOOK INTO turning all this into background.js-- like, not the search bar part, but loading the videos. oh or like, not background.js actually-- need to load once a day and store. easier to just keep as is. background.js would still need to be loaded multiple times a day
'use strict';
var pageToken = '';
var test = 0;


// Probably not with a button. Probably it just happens when you click the extension icon. And then a search bar appears. Which would mean you'd want this as a pop up.
// maybe brwoser_action is already considered a pop-up, I dunno
window.onload = function() {
//   document.querySelector('button').addEventListener('click', fetchResults(pageToken));

  fetchResults(pageToken);

}

var videoArray = [];
var links;


var fetchResults = function(pageToken){


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
      test += 1;


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
        console.log(pageToken);
        console.log('outOfPages');
        console.log(videoArray.length);
        document.querySelector('#myLoadMessage').innerHTML = "Videos loaded. Search away!";
        //add Search functionality to search button now
        //searching for each word, by channel or title only
        document.querySelector('#mySearchButton').addEventListener('click', function(){
          var searchCriteria = document.querySelector('#mySearchBar').value.toUpperCase().split(" ");
          console.log("searchCriteria length: ", searchCriteria.length);

          for (i=0; i<videoArray.length; i++){
            var wordCount = 0;
            var currentLink = videoArray[i];
            console.log(currentLink);
            var x; var word;
            for (x = 0; x<searchCriteria.length; x++){
              word = searchCriteria[x];
              console.log(currentLink);
              if (currentLink.title.toUpperCase().indexOf(word)>-1 || currentLink.channel.toUpperCase().indexOf(word)>-1){
                wordCount += 1;
                console.log("word: ", word);
                console.log(currentLink.title);
              }

            }
            console.log('exited word for loop');
            if (wordCount === searchCriteria.length){
              //display the link if all search criteria met
              //could change options for search if desired, but let's start with this
              //first let's just make page of links
              //then maybe add thumbnails and channel
              var div = document.createElement('div');
              var match = document.createElement('a');
              match.href = currentLink.link;
              match.innerHTML = currentLink.title;
              div.appendChild(match);
              document.querySelector('#mySearchResults').appendChild(div);
            }
          }//ends outer for loop (videoArray loop)
          


        });//ends search button functionality code
        // ADD FUNCTIONALITY TO BUTTON HERE (COULD ALSO CHANGE COLOR OF BUTTON OR SOMETHING)
        //WILL ALSO WANT A MESSAGE FOR ERROR IF VIDEOS NOT PROPERLY LOADING

        //LOOP through all array items (video titles + links) and find out if text matches that of title
        //possibly look into: fuzzymatching algorithms, javascript

      }
      else{
        fetchResults(pageToken);
      }
           

        });//ends function using data
  
      //keep looging next page token until there are no more pages
        //TRYING: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
      
        

      });//ends chrome.identity statement


 }//ends fetchReults definition





