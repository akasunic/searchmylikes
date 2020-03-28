// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var pageToken = '';
var test = 0;

// Probably not with a button. Probably it just happens when you click the extension icon. And then a search bar appears. Which would mean you'd want this as a pop up.
//maybe brwoser_action is already considered a pop-up, I dunno
window.onload = function() {
  document.querySelector('button').addEventListener('click', fetchResults(pageToken));

}

var videoArray = [];


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
            console.log(data)
            pageToken = '&pageToken=' + data.nextPageToken;
            //Then for each item listed for the page, will add the title results to an array
            console.log(test);
            console.log(pageToken);
            videoArray.push(test);
            
      if(test > 22){ //referring to my pages, in particular
      // if(pageToken == '&pageToken=undefined' || test > 22){ //referring to my pages, in particular
        console.log('outOfPages');
        console.log(videoArray);
      }
      else{
        fetchResults(pageToken);
      }
           

        });//ends function using data
      
      // console.log(pageToken);
      // fetchResults(pageToken);
  
      //keep looging next page token until there are no more pages
        //TRYING: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
      
        

      });//ends chrome.identity statement


 }//ends fetchReults definition




