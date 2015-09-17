$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them
  console.log('ready')
  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
  changeGoogleImage = function(url) {
  	console.log(url);
  }

  // (function(){
  //   var widgetIframe = document.getElementById('sc-widget'),
  //       widget       = SC.Widget(widgetIframe),
  //       newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';

  //   widget.bind(SC.Widget.Events.READY, function() {
  //     // load new widget
  //     widget.bind(SC.Widget.Events.FINISH, function() {
  //       widget.load(newSoundUrl, {
  //         show_artwork: false
  //       });
  //     });
  //   });
  // }());
	
  loadSoundcloudWidget = function(url) {
  	var widgetIframe = document.getElementById('sc-widget'),
        widget       = SC.Widget(widgetIframe);

     widget.load(url, {
     		show_comments: false
     });

    // widget.bind(SC.Widget.Events.READY, function() {
    //   // load new widget
    //   widget.bind(SC.Widget.Events.FINISH, function() {
    //   	console.log('loading')
    //     widget.load(newSoundUrl, {
    //       show_artwork: true
    //     });
    //   });
    // });
  }

  $('.search-soundcloud-link').click(function(e) {
  	e.preventDefault();
    // var artist = e.currentTarget.previousSibling.previousSibling.innerHTML;
    // var track = e.currentTarget.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML;
    // console.log(artist)
    // console.log(track)
    console.log(e);
  	// console.log(this.id)
    // console.log(e.prev().text())
    $.ajax({
      url: "search_track",
      data: {query: this.id}
    }).success(function(data) {
    	// window.scrollTo(0, top); 
      // loadSoundcloudWidget(data);
      console.log("Retrieved Track:" + data);
      for (i = 0; i < data.length; i++) {
        console.log(data[i]);
      }
    }).fail(function() {
      console.log("failed to get track");
    });
  })

  $('.spotify-link').click(function(e) {
    e.preventDefault();
    console.log(e.currentTarget.id);
    var tableRow = e.currentTarget.parentElement.parentElement;
    $.ajax({
      url: "https://api.spotify.com/v1/search?q=" + e.currentTarget.id +"&type=track"
    }).success(function(data) {
      // console.log(data);
      parseSpotifyTracks(data, tableRow);
    }).fail(function() {
      console.log("could not retrieve spotify");
    })
  })

  loadSoundcloudWidget('https://api.soundcloud.com/tracks/169327138');

  $(document).foundation({
    accordion: {
      callback : function (accordion) {
        console.log(accordion);
        $(accordion[0].previousSibling.previousElementSibling).css('margin-bottom',"0px");
        searchSoundcloud(accordion[0].parentNode.firstElementChild.innerText, accordion[0].id);
        console.log(accordion[0].parentNode.firstElementChild.innerText);
      }
    }
  });

});


function parseSpotifyTracks(tracks, row) {
  spotifyTracks = tracks.tracks.items;
  console.log(spotifyTracks);
  $(row).after("<tr><td>test</td><td>test2</td><td>tes3t</td></tr>");
  // for (var i = 0; i <= spotifyTracks.length; i++) {
  //   console.log(spotifyTracks[i].artists);
  //   console.log(spotifyTracks[i].name);
  // }

};

function addTrackToPlaylist() {
  // $.ajax({
  //   method: "POST",
  //   url: "https://api.spotify.com/v1/users/1228452644/playlists/6P3jJkjrwi5h0ITmNjCymn/tracks"
  // }).success(function(data) {
  //   console.log("success" + data);
  // }).fail.(function() {
  //   console.log("song could not be added")
  // })
}

function searchSoundcloud(queryText, divId) {
  $.ajax({
      url: "search_track",
      data: {query: queryText}
    }).success(function(data) {
      // window.scrollTo(0, top); 
      // loadSoundcloudWidget(data);
      // console.log("Retrieved Track:" + data);
      appendSoundcloudTracks(data, divId);
      // for (i = 0; i < data.length; i++) {
      //   console.log(data[i]);
      // }
    }).fail(function() {
      console.log("failed to get track");
    });
}

function playSoundcloud(element) {
  uri = $(element).parent()[0].nextSibling.innerText;
  window.scrollTo(0, 0); 
  loadSoundcloudWidget(uri);
  console.log(uri);
}

function appendSoundcloudTracks(trackData, divId) {
  divName = '#' + divId;
  headerDiv = "<div class='row'><div class='large-12'><h3 class='header-text'>Select a Track</h3></div></div>";
  titleDiv = "<div class='row'><div class='large-3 columns'>Image</div><div class='large-3 columns'>User</div><div class='large-3 columns'>Track Title</div><div class='large-3 columns'>Play Count</div></div>";
  $(divName).empty();
  $(divName).append(headerDiv);
  $(divName).append(titleDiv);
  for (i = 0; i < trackData.length && i < 5; i++) {
    trackUri = trackData[i].uri.replace("/", "\/");
    console.log(trackUri);
    newDiv = "<div class='row'><div class='large-2 columns'><img src='"+ trackData[i].artwork + "'></div><div class='large-2 columns'>" + trackData[i].artist + "</div><div class='large-3 columns'>" + trackData[i].title + "</div><div class='large-3 columns'>" + trackData[i].count + "</div><div class='large-2 columns'><i onclick='playSoundcloud(this)' class='fi-play'></i></div><div class='hidden-uri'>"+ trackData[i].uri + "</div></div>";
    $(divName).append(newDiv)
  }
}