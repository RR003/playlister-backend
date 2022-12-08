import { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import * as React from "react";
import Box from "@mui/material/Box";
import { Modal, Alert, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MUIPlaylistExists() {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {}, []);

  const hideModal = () => {
    store.hideModals();
  };

  return (
    <Modal open={store.currentModal === "PLAYLIST_EXISTS"}>
      <Box sx={style}>
        <Alert severity="warning">Playlist name already exists.</Alert>
        <Button
          id="dialog-yes-button"
          className="modal-button"
          onClick={hideModal}
          color="primary"
          variant="contained"
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}
