// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var pageToken = '';
var test = 0;

window.onload = function() {
  document.querySelector('button').addEventListener('click', fetchResults(pageToken));

}

var fetchResults = function(pageToken){
  console.log(pageToken);

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



      fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50&pageToken=' + pageToken, init)
        .then((response) => response.json())
          .then(function(data){
            pageToken = data.nextPageToken;
            
            console.log(test);
            console.log(pageToken);


            // console.log(data);
            


            
            console.log(data.nextPageToken);
      if(test > 10){
        console.log('all done');
      }
      else{
        fetchResults(pageToken);
      }
           

        });//ends function using data
      
      // console.log(pageToken);
      // fetchResults(pageToken);
    
  console.log('running fetchResults');
  console.log('line10:', pageToken);
      //keep looging next page token until there are no more pages
        //TRYING: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
      
        

      });//ends chrome.identity statement


 }//ends fetchReults definition



// fetchResults(pageToken);



