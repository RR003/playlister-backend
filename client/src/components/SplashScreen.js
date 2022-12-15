import { useContext } from "react";
import Button from "@mui/material/Button";
import AuthContext from "../auth";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  function handleGuest() {
    auth.continueAsGuest();
  }

  function handleSignIn() {
    history.push("/login");
  }

  function handleSignUp() {
    history.push("/register");
  }

  return (
    <div
      id="splash-screen"
      style={{ background: "linear-gradient(#FFFFF7, #008080)" }}
    >
      <h4>Welcome to Playlister</h4>
      <p className="description">
        Playlister allows you to listen through any published playlist from
        around the world. Create a FREE account today and publish your own
        playlists, while also commenting and liking other playlists.
      </p>
      <p className="description">Created by Rahul Raja</p>
      <Grid container>
        <Grid xs={3}></Grid>
        <Grid xs={2.5}>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleGuest}
            className="login-button"
          >
            Continue As Guest
          </Button>
        </Grid>
        <Grid xs={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleSignIn}
            className="login-button"
          >
            Sign In
          </Button>
        </Grid>
        <Grid xs={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleSignUp}
            className="login-button"
          >
            Sign Up
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
