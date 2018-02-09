import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncGetAttachmentFromGapi, asyncSendNewEmail, asyncGetNote, asyncSendNote, changeNoteStatus, asyncReply, asyncGetTemplate, changeComposeWindowHeaderText, toggleButtonName } from '../../redux/reducers/emailReducer';

const Loader = require('react-loader');

class Email extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      noteContent: '',
      replyPopoverOpen: false,
      newPopoverOpen: false,
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
  newEmail = () => {
    this.props.sendNewEmail(this.props.email.emailId, 'pdf-test.pdf', 'hello naira!');
    notify.show('Message Sent', 'success', 1500);
  };
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
  };
  handleReplyPopover = () => {
    this.setState({ replyPopoverOpen: !this.state.replyPopoverOpen });
    this.props.toggleButtonName('reply');
  };
  handleNewPopover = () => {
    this.setState({ newPopoverOpen: !this.state.newPopoverOpen });
    this.props.toggleButtonName('send new');
  };
  selectedReplyTemplate = (e) => {
    const selection = e.target.value;
    let templateId = '';
    if (selection === 'Accepted'){
     templateId = '5a7d58fd0029d71b30301261';
    } else {
      templateId = '5a7d58fd0029d71b30301265';
    }
    this.props.getTemplate(templateId);
    this.setState({ replyPopoverOpen: false, newPopoverOpen: false });
  };
  selectedNewTemplate = (e) => {
    const selection = e.target.value;
    let templateId = '';
    if (selection === 'Accepted'){
      templateId = '5a7d58fd0029d71b30301261';
    } else {
      templateId = '5a7d58fd0029d71b30301265';
    }
    this.props.getTemplate(templateId);
    this.setState({ replyPopoverOpen: false, newPopoverOpen: false });
  };
  handleEditorChange = () => {}
  render() {
    return (
      <Loader loaded={this.props.loaded}>
      <div className="col-10 mt-4">
          <div style={{ float: 'right' }}>
            <label htmlFor="selectStatus"><b>Change Status</b></label>
            <select className="form-control" id="selectStatus" onChange={this.changeStatus} value={this.props.email.status}>
              {this.props.statuses
                .map(status => <option key={status._id} value={status._id}>{status.name}</option>)}
            </select>
          </div>
          <p><b>Sender:</b> {this.props.email.sender}</p>
          <p><b>Subject:</b> {this.props.email.subject}</p>
          <p><b>Date:</b> {this.props.email.date}</p>
        </div>
        <hr />
        <div>
          {
            this.props.email.attachments ?
            this.props.email.attachments.map((attachment, index) => (
              <a
                key={attachment.attachmentId} href={this.props.url[index]}
                download={attachment.attachmentName}
              >{attachment.attachmentName}
              </a>)) : ''
          }
        </div>
        {
          this.props.email.isPlainText ?
            <pre dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />
          :
            <div dangerouslySetInnerHTML={{ __html: this.props.email.htmlBody }} />
        }

        <hr />
        <div className="btn-group" role="group">
          <Button id="replyButton" onClick={this.handleReplyPopover} className="btn bg-light-blue rounded">
            Reply
          </Button>
          <Popover placement="bottom" isOpen={this.state.replyPopoverOpen} target="replyButton" toggle={this.handleReplyPopover}>
            <PopoverHeader>Select Template</PopoverHeader>
            <PopoverBody>
              <select className="form-control" onChange={this.selectedReplyTemplate} defaultValue="_default">
                <option disabled value="_default"> -- select an option -- </option>
                <option value="">No template</option>
                <option value="Received your email">Received your email</option>
                <option value="Interview appointment">Interview appointment</option>
                <option value="Accepted">Accepted</option>
                <option value="Denied">Denied</option>
              </select>
            </PopoverBody>
          </Popover>

          <Button id="newEmailButton" onClick={this.handleNewPopover} className="btn btn-success rounded">
            Send New Email
          </Button>
          <Popover placement="bottom" isOpen={this.state.newPopoverOpen} target="newEmailButton" toggle={this.handleNewPopover}>
            <PopoverHeader>Select Template</PopoverHeader>
            <PopoverBody>
              <select className="form-control" onChange={this.selectedNewTemplate} defaultValue="_default">
                <option disabled value="_default"> -- select an option -- </option>
                <option value="">No template</option>
                <option value="Received your email">Received your email</option>
                <option value="Interview appointment">Interview appointment</option>
                <option value="Accepted">Accepted</option>
                <option value="Denied">Denied</option>
              </select>
            </PopoverBody>
          </Popover>

        </div>
        <br /><br />
        <div className="col-8 email-border-top">
          <label htmlFor="addNoteTextarea">Notes about applicant</label>
          <div className="notes">
            <textarea data-id={this.props.note ? this.props.note._id : ''} className="form-control" id="addNoteTextarea" rows="7" placeholder="Start typing, note will auto save." onChange={this.typeNote} ref={el => this.noteTextareaRef = el} value={this.state.noteContent} />
            <span className={this.props.noteStatus}>Saved!</span>
          </div>
        {/* <iframe dangerouslySetInnerHTML={{ __html: props.email.htmlBody }} title="Email Content"></iframe> */}
      </div>
    </Loader>
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
  changeComposeWindowHeaderText: PropTypes.func.isRequired,
  note: PropTypes.object,
  getNote: PropTypes.func.isRequired,
  getTemplate: PropTypes.func.isRequired,
  sendNote: PropTypes.func.isRequired,
  noteStatus: PropTypes.string,
  url: PropTypes.array,
  changeNoteStatus: PropTypes.func.isRequired,
  sendNewEmail: PropTypes.func,
  template: PropTypes.string,
  toggleButtonName: PropTypes.func,
  loaded: PropTypes.bool,
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
    template: state.email.template,
    loaded: state.email.loaded
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
    sendNewEmail: (emailId, subject, messageBody) =>
      dispatch(asyncSendNewEmail(emailId, subject, messageBody)),
    getTemplate: templateId => dispatch(asyncGetTemplate(templateId)),
    changeComposeWindowHeaderText: text => dispatch(changeComposeWindowHeaderText(text)),
    toggleButtonName: btnName => dispatch(toggleButtonName(btnName)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
