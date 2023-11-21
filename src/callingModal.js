import React from "react";

const CallingModal = React.forwardRef(({ createAnswer, callerInfo }) => {
  console.log("shit");
  return (
    <div
      class="modal fade show"
      id="callingModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="callingModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {`${callerInfo.current.callerUsername} is calling you!`}
            </h5>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              onClick={() =>
                createAnswer(
                  callerInfo.current.callerId,
                  callerInfo.current.offer,
                  callerInfo.current.callerUsername
                )
              }
            >
              Answer
            </button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CallingModal;
