// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function() {
  document.querySelector('button').addEventListener('click', function() {
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
      fetch(

        // The sample request below retrieves a list of videos to which the current user gave a like rating. The request must be authorized using OAuth 2.0.
        // https://www.googleapis.com/youtube/v3/youtube.videos.list?part=snippet&myRating=like
          // 'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=<API_Key_Here>',
          // 'https://www.googleapis.com/youtube/v3/youtube.videos.list?part=snippet&myRating=like',
          // 'https://www.googleapis.com/youtube/v3/youtube.videos?&part=snippet',
          // 'https://www.googleapis.com/youtube/v3/youtube.channels.list?part=snippet&mine=true',
          'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', 
          //THE ABOVE CODE WORKED!! line just above. And returns my channel. So see what is happening. Wokring for channels but not channels.list
          init)
          //could be because I made private? can test this
          .then((response) => response.json())
          .then(function(data){
            console.log(data.items);
          
          // .then(function(data) {
          //   // let photoDiv = document.querySelector('#friendDiv');
          //   // let returnedContacts = data.memberResourceNames;
          //   // for (var i = 0; i < returnedContacts.length; i++) {
          //   //   fetch(
          //   //       'https://people.googleapis.com/v1/' + returnedContacts[i] +
          //   //           '?personFields=photos&key=<API_Key_Here>',
          //   //       init)
          //   //       .then((response) => response.json())
          //   //       .then(function(data) {
          //   //         let profileImg = document.createElement('img');
          //   //         profileImg.src = data.photos[0].url;
          //   //         photoDiv.appendChild(profileImg);
          //   //       });
          //   // };
          });
    });
  });
};
