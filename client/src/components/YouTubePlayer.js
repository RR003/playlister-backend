let player;
let PLAYER_NAME = "youtube_player";

// THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
let playlist = ["mqmxkGjow1A", "8RbXIMZmVv8", "8UbNbor3OqQ"];

let currentSong;

// DYNAMICALLY LOAD THE YOUTUBE API FOR USE
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function YouTubePlayer() {
  function onYouTubeIframeAPIReady() {
    // START OUR PLAYLIST AT THE BEGINNING
    currentSong = 0;

    // NOW MAKE OUR PLAYER WITH OUR DESIRED PROPERTIES
    if (currentSong >= 0) {
      player = new YT.Player(PLAYER_NAME, {
        height: "390",
        width: "640",
        playerVars: {
          playsinline: 1,
          origin: "https://www.youtube.com",
        },
        events: {
          // NOTE OUR EVENT HANDLER FUNCTIONS HERE
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }

  function onPlayerReady(event) {
    loadAndPlayCurrentSong();
    event.target.playVideo();
  }

  function loadAndPlayCurrentSong() {
    let song = playlist[currentSong];
    player.loadVideoById(song);
    player.playVideo();
  }

  function incSong() {
    currentSong++;
    currentSong = currentSong % playlist.length;
  }

  function onPlayerStateChange(event) {
    let playerStatus = event.data;
    let color;
    if (playerStatus == -1) {
      // VIDEO UNSTARTED
      color = "#37474F";
      console.log("-1 Video unstarted");
    } else if (playerStatus == 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      color = "#FFFF00";
      console.log("0 Video ended");
      incSong();
      loadAndPlayCurrentSong();
    } else if (playerStatus == 1) {
      // THE VIDEO IS PLAYED
      color = "#33691E";
      console.log("1 Video played");
    } else if (playerStatus == 2) {
      // THE VIDEO IS PAUSED
      color = "#DD2C00";
      console.log("2 Video paused");
    } else if (playerStatus == 3) {
      // THE VIDEO IS BUFFERING
      color = "#AA00FF";
      console.log("3 Video buffering");
    } else if (playerStatus == 5) {
      // THE VIDEO HAS BEEN CUED
      color = "#FF6DOO";
      console.log("5 Video cued");
    }
    if (color) {
      document.getElementById(PLAYER_NAME).style.borderColor = color;
    }
  }

  return <div></div>;
}
