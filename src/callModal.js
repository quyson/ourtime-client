import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CallModal({ declineCall, peerId, calling }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    declineCall(peerId);
    setShow(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Calling in process</Modal.Title>
        </Modal.Header>
        <Modal.Body>...Waiting for an Answer...</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CallModal;
