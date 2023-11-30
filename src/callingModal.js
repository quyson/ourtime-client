import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const CallingModal = React.forwardRef(
  ({
    globalPeerConnection,
    temporaryIceCache,
    createAnswer,
    callerInfo,
    declineCall,
  }) => {
    const [show, setShow] = useState(true);

    const handleClose = () => {
      declineCall(callerInfo.current.callerId);
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
              onClick={() =>
                createAnswer(
                  globalPeerConnection,
                  temporaryIceCache,
                  callerInfo.current.callerId,
                  callerInfo.current.offer,
                  callerInfo.current.callerUsername
                )
              }
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
);

export default CallingModal;
