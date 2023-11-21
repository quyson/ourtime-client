import React from "react";

const CallModal = () => {
  return (
    <div
      class="modal fade"
      id="callModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="callModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {"Calling..."}
            </h5>
          </div>
          <div class="modal-body">...</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">
              End
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
