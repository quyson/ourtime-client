import React from "react";

const CallModal = ({ caller }) => {
  return (
    <div
      class="modal fade"
      id="myModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="CallingModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {`${caller} is calling you!`}
            </h5>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success">
              Answer
            </button>
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
