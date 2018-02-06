import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncSendNote, asyncGetAttachmentFromGapi } from '../../redux/reducers/emailReducer';


class Email extends Component {
  componentWillMount() {
    const emailId = this.props.email.emailId;
    this.props.getEmailFromGapi(emailId);
  }
  componentDidUpdate() {
    const emailId = this.props.email.emailId;
    const attachments = this.props.email.attachments;
    console.log('componentWillMount', attachments);
    this.props.getAttachmentFromGapi(emailId, attachments);
  }
  // componentWillReceiveProps(nextProps) {
  //
  // }
  sendNoteInfo = { time: 0 };
  changeStatus = (evt) => {
    const statusId = evt.target.value;
    const emailId = this.props.email.emailId;
    this.props.changeEmaulStatus(emailId, statusId);
  };
  typeNote = (evt) => {
    clearTimeout(this.sendNoteInfo.time);
    const emailId = this.props.email.emailId;
    const note = evt.target.value;
    const noteId = evt.target.dataset.id;
    console.log('typeNote noteId', noteId);
    this.sendNoteInfo.time = setTimeout(this.props.sendNote, 3000, emailId, note, noteId);
    // this.props.sendNote(note);
  }
  checkNoteId = (evt) => {
    console.log('start of checkNoteId evt.target.dataset.id', evt.target.dataset.id)
    const note = evt.target.value;
    evt.target.dataset.id = note === '' ? '' : this.props.lastUpdatedNoteId;
    console.log('end of checkNoteId evt.target.dataset.id', evt.target.dataset.id)
  }
  render() {
    return (
      <div className="col-10 mt-4">
        <div className="d-flex justify-content-between text-center wrap-words">
          <h4 className="w-20"><small>Sender: </small><br />{this.props.email.sender}</h4>
          <h3 className="w-20"><small>Subject: </small><br />{this.props.email.subject}</h3>
          <div className="w-20">
            <label htmlFor="selectStatus">Change Status</label>
            <select className="form-control" id="selectStatus" onChange={this.changeStatus} value={this.props.email.status}>
              {this.props.statuses
                .map(status => <option key={status._id} value={status._id}>{status.name}</option>)}
            </select>
          </div>
          <p className="w-20"><small>Date: </small><br />{this.props.email.date}</p>
        </div>
        <hr />
        <div className="btn-group" role="group">
          <button type="button" className="btn bg-light-blue rounded tooltip-toggle" data-tooltip="Email will be sent in this thread">Reply</button>
          <button type="button" className="btn btn-success rounded ml-2 tooltip-toggle" data-tooltip="This will send new email">Send Email</button>
        </div>
        {this.props.email.isPlainText ?
          <pre dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />
          :
          <div dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />}
        <div className="col-6 email-border-top">
          <label htmlFor="addNoteTextarea">Add note</label>
          <div className="notes">
            <textarea data-id={this.props.lastUpdatedNoteId} className="form-control" id="addNoteTextarea" rows="3" placeholder="Type.Note will be saved Automaticly" onChange={this.typeNote} onFocus={this.checkNoteId}></textarea>
            <span className={this.props.noteStatus}>Saved!</span>
          </div>
        </div>
        {/* <iframe dangerouslySetInnerHTML={{ __html: props.email.htmlBody }} title="Email Content"></iframe> */}
      </div>
    );
  }
}
Email.propTypes = {
  email: PropTypes.object.isRequired,
  statuses: PropTypes.array.isRequired,
  changeEmaulStatus: PropTypes.func.isRequired,
  getEmailFromGapi: PropTypes.func.isRequired,
  sendNote: PropTypes.func.isRequired,
  lastUpdatedNoteId: PropTypes.string,
  noteStatus: PropTypes.string,
  getAttachmentFromGapi: PropTypes.func,
};
Email.defaultProps = {
  lastUpdatedNoteId: '',
  noteStatus: '',
};
function mapStateToProps(state) {
  return {
    email: state.email.email,
    lastUpdatedNoteId: state.email.lastUpdatedNoteId,
    statuses: state.statuses.statuses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmailFromGapi: emailId => dispatch(asyncGetEmailFromGapi(emailId)),
    changeEmaulStatus: (emailId, statusId) => dispatch(asyncChangeEmailStatus(emailId, statusId)),
    sendNote: (emailId, note, noteId) => dispatch(asyncSendNote(emailId, note, noteId)),
    getAttachmentFromGapi: (emailId, attachments) => dispatch(asyncGetAttachmentFromGapi(emailId, attachments)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
