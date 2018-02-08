import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncGetAttachmentFromGapi, asyncGetNote, asyncSendNote, changeNoteStatus, asyncReply } from '../../redux/reducers/emailReducer';

class Email extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      noteContent: '',
    };
  }
  componentDidMount() {
    const emailId = this.props.email.emailId;
    this.props.getEmailFromGapi(emailId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
    }
    if (nextProps.email.emailId !== this.props.email.emailId) {
      const emailId = nextProps.email.emailId;
      this.props.getEmailFromGapi(emailId);
    }
    if (nextProps.email.sender !== this.props.email.sender) {
      const sender = nextProps.email.sender;
      this.props.getNote(sender);
    }
    if (nextProps.note !== null && nextProps.note !== this.props.note) {
      const oldContent = this.props.note ? this.props.note.content : '';
      const newContent = nextProps.note ? nextProps.note.content : '';
      if (newContent !== oldContent) {
        this.setState({ noteContent: nextProps.note.content });
      }
    }
    if (nextProps.email.attachments !== null &&
      nextProps.email.attachments !== this.props.email.attachments) {
      nextProps.email.attachments
        .map(attachment => this.props.getAttachmentFromGapi(nextProps.email.emailId, attachment));
    }
  }

  sendNoteInfo = { time: 0 };
  changeStatus = (evt) => {
    const statusId = evt.target.value;
    const emailId = this.props.email.emailId;
    this.props.changeEmaulStatus(emailId, statusId);
  };
  typeNote = (evt) => {
    clearTimeout(this.sendNoteInfo.time);
    const sender = this.props.email.sender;
    const emailId = this.props.email.emailId;
    const note = evt.target.value;
    const noteId = evt.target.dataset.id;
    this.props.changeNoteStatus('noteSaveStatus');
    this.setState({ noteContent: note });
    this.sendNoteInfo.time = setTimeout(this.props.sendNote, 3000, sender, emailId, note, noteId);
  };
  reply = () => {
    const emailId = this.props.email.emailId;
    this.props.reply(emailId);
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
        <div>
          {
            this.props.email.attachments ?
            this.props.email.attachments.map(attachment => (
              <a
                key={attachment.attachmentId} href={this.props.url}
                download={attachment.attachmentName}
              >{attachment.attachmentName}
              </a>)) : ''
          }
        </div>
        <div className="btn-group" role="group">
          <button type="button" className="btn bg-light-blue rounded tooltip-toggle" data-tooltip="Email will be sent in this thread" onClick={this.reply}>Reply</button>
          <button type="button" className="btn btn-success rounded ml-2 tooltip-toggle" data-tooltip="This will send new email">Send Email</button>
        </div>
        {this.props.email.isPlainText ?
          <pre dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />
          :
          <div dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />}
        <div className="col-8 email-border-top">
          <label htmlFor="addNoteTextarea">Note </label>
          <div className="notes">
            <textarea data-id={this.props.note ? this.props.note._id : ''} className="form-control" id="addNoteTextarea" rows="7" placeholder="Type.Note will be saved Automaticly" onChange={this.typeNote} ref={el => this.noteTextareaRef = el} value={this.state.noteContent} />
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
  getEmailFromGapi: PropTypes.func.isRequired,
  getAttachmentFromGapi: PropTypes.func,
  statuses: PropTypes.array.isRequired,
  changeEmaulStatus: PropTypes.func.isRequired,
  reply: PropTypes.func.isRequired,
  note: PropTypes.object,
  getNote: PropTypes.func.isRequired,
  sendNote: PropTypes.func.isRequired,
  noteStatus: PropTypes.string,
  url: PropTypes.string,
  changeNoteStatus: PropTypes.func.isRequired,

};
Email.defaultProps = {
  noteStatus: 'noteSaveStatus',
  note: { content: '' },
};
function mapStateToProps(state) {
  return {
    email: state.email.email,
    statuses: state.statuses.statuses,
    note: state.email.note,
    noteStatus: state.email.noteStatus,
    url: state.email.url,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmailFromGapi: emailId => dispatch(asyncGetEmailFromGapi(emailId)),
    changeEmaulStatus: (emailId, statusId) => dispatch(asyncChangeEmailStatus(emailId, statusId)),
    getAttachmentFromGapi: (
      emailId,
      attachment,
    ) => dispatch(asyncGetAttachmentFromGapi(emailId, attachment)),
    getNote: sender => dispatch(asyncGetNote(sender)),
    sendNote: (
      sender,
      emailId,
      note,
      noteId,
    ) => dispatch(asyncSendNote(sender, emailId, note, noteId)),
    changeNoteStatus: status => dispatch(changeNoteStatus(status)),
    reply: emailId => dispatch(asyncReply(emailId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
