import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CallingModal({ createAnswer, callerInfo, declineCall }) {
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
          <Modal.Title>{`${callerInfo.current.callerUsername} is calling`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>...Ring Ring Ring...</Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={createAnswer(
              callerInfo.current.callerId,
              callerInfo.current.offer,
              callerInfo.current.callerUsername
            )}
          >
            Accept
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CallingModal;
