import YouTube from "react-youtube";
import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import StopIcon from "@mui/icons-material/Stop";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Grid from "@mui/material/Grid";

export default function YouTubePlayer() {
  const { store } = useContext(GlobalStoreContext);
  const [play, setPlay] = useState(false);

  useEffect(async () => {
    console.log(store);
  }, [store]);

  async function loadAndPlayCurrentSong(player) {
    let song = store.currentList.songs[store.currentPlayIndex].youTubeId;
    player.loadVideoById(song);
    player.playVideo();
  }

  async function incSong() {
    // setIndex((index + 1) % store.currentList.songs.length);
    await store.updatePlaySong(
      (store.currentPlayIndex + 1) % store.currentList.songs.length
    );
  }

  async function decSong() {
    if (store.currentPlayIndex - 1 == -1) {
      await store.updatePlaySong(store.currentList.songs.length - 1);
    } else {
      await store.updatePlaySong(
        (store.currentPlayIndex - 1) % store.currentList.songs.length
      );
    }
  }

  function onPlayerReady(event) {
    if (play) {
      loadAndPlayCurrentSong(event.target);
      event.target.playVideo();
    }
  }

  function stop() {
    setPlay(false);
  }

  async function resume() {
    setPlay(true);
  }

  async function onPlayerStateChange(event) {
    let playerStatus = event.data;
    let player = event.target;
    if (playerStatus === 0) {
      if (play) {
        await incSong();
        loadAndPlayCurrentSong(player);
      }
    }
  }

  const opts = {
    height: "250",
    width: "400",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    store.currentList &&
    store.currentList.songs.length > 0 && (
      <div>
        <YouTube
          videoId={
            play && store.currentList.songs[store.currentPlayIndex].youTubeId
          }
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
        <h3>Playlist: {store.currentList.name}</h3>
        <h3>Song #: {store.currentPlayIndex + 1}</h3>
        <h3>Title: {store.currentList.songs[store.currentPlayIndex].title}</h3>
        <h3>
          Artist: {store.currentList.songs[store.currentPlayIndex].artist}
        </h3>
        <Grid container>
          <Grid xs={2}></Grid>
          <Grid xs={2}>
            <SkipPreviousIcon onClick={decSong} />
          </Grid>
          <Grid xs={2}>
            <StopIcon onClick={stop} />
          </Grid>
          <Grid xs={2}>
            <PlayArrowIcon onClick={resume} />
          </Grid>
          <Grid xs={2}>
            <SkipNextIcon onClick={incSong} />
          </Grid>
        </Grid>
      </div>
    )
  );
}
