import { useContext } from "react";
import GlobalStoreContext from "../store";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

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

export default function MUIRemoveSongModal() {
  const { store } = useContext(GlobalStoreContext);

  function handleConfirmRemoveSong() {
    store.addRemoveSongTransaction();
  }

  function handleCancelRemoveSong() {
    store.hideModals();
  }

  let modalClass = "modal";
  if (store.isRemoveSongModalOpen()) {
    modalClass += " is-visible";
  }
  let songTitle = "";
  if (store.currentSong) {
    songTitle = store.currentSong.title;
  }

  return (
    <Modal open={store.deleteSong !== null}>
      <Box sx={style}>
        <div className="modal-dialog" data-animation="slideInOutLeft">
          <header className="dialog-header">
            Delete {store.deleteSong.title} from the playlist?
          </header>
          <div id="confirm-cancel-container">
            <Button
              id="dialog-yes-button"
              className="modal-button"
              onClick={handleConfirmRemoveSong}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
            <Button
              id="dialog-no-button"
              className="modal-button"
              onClick={handleCancelRemoveSong}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
