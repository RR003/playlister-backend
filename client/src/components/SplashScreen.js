import { useContext } from "react";
import Button from "@mui/material/Button";
import AuthContext from "../auth";

export default function SplashScreen() {
  const { auth } = useContext(AuthContext);
  function handleGuest() {
    auth.continueAsGuest();
  }

  return (
    <div id="splash-screen">
      <Button onClick={handleGuest}>Continue As Guest</Button>
    </div>
  );
}
