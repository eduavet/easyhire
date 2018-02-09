import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';

class Compose extends Component {
  render() {
    return (
      <div className="compose show">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">Compose</h4>
          </div>
          <form onSubmit="return sendEmail();">
            <div className="modal-body">
              <div className="form-group">
                <input type="email" className="form-control" id="compose-to" placeholder="To" required />
              </div>

              <div className="form-group">
                <input type="text" className="form-control" id="compose-subject" placeholder="Subject" required />
              </div>

              <div className="form-group">
                <textarea className="form-control" id="compose-message" placeholder="Message" rows="10" required></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" id="send-button" className="btn bg-light-blue">Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Compose.propTypes = {


};

Compose.defaultProps = {

};

function mapStateToProps(state) {
  return {


  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compose);
