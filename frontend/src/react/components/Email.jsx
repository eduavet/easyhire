import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncGetThreadFromGapi, asyncGetAttachmentFromGapi, asyncGetNote, asyncSendNote, changeNoteStatus, asyncGetTemplate, changeComposeWindowHeaderText, toggleButtonName, refreshSetEmailId, refreshSetThreadId, asyncGetEmailFromDb, asyncGetThreadFromDb } from '../../redux/reducers/emailReducer';
import { asyncGetSignature } from '../../redux/reducers/emailsReducer';
import { asyncGetTemplates } from '../../redux/reducers/settingsReducer';

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
  componentWillMount() {
    const urlString = window.location.href;
    const urlParts = window.location.pathname.split('/');
    const url = new URL(urlString);
    const emailId = urlParts[urlParts.length - 1];
    const threadId = url.searchParams.get('threadId');
    this.props.refreshSetEmailId(emailId);
    this.props.refreshSetThreadId(threadId);
    this.props.getEmailFromDb(emailId);
    this.props.getThreadFromDb(threadId);
  }
  componentDidMount() {
    const urlString = window.location.href;
    const url = new URL(urlString);
    const threadIdFromUrl = url.searchParams.get('threadId');
    const threadId = this.props.threadId ? this.props.threadId : threadIdFromUrl;
    this.props.getThreadFromGapi(threadId);
    this.props.getTemplates();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps === this.props) {
      return;
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
    if (nextProps.threadId !== this.props.threadId) {
      const threadId = nextProps.threadId;
      this.props.getEmailFromGapi(threadId);
    }

    if (nextProps.note !== null && nextProps.note !== this.props.note) {
      const oldContent = this.props.note ? this.props.note.content : '';
      const newContent = nextProps.note ? nextProps.note.content : '';
      if (newContent !== oldContent) {
        this.setState({ noteContent: nextProps.note.content });
      }
    }
    const watchProps = _.pick(this.props, ['thread']);
    const nextWatchProps = _.pick(nextProps, ['thread']);

    if (!_.isEqual(watchProps, nextWatchProps)) {
      nextProps.thread.forEach((email) => {
        if (email.attachments && email.attachments.length > 0) {
          email.attachments.forEach(attachment => this.props.getAttachmentFromGapi(email.emailId, attachment));
        }
      });
    }
  }
  sendNoteInfo = { time: 0 };
  changeStatus = (evt) => {
    const statusId = evt.target.value;
    const emailId = evt.target.dataset.id;
    this.props.changeEmailStatus(emailId, statusId);
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

  handleReplyPopover = () => {
    this.props.getSignature();
    this.setState({ replyPopoverOpen: !this.state.replyPopoverOpen });
  };

  handleNewPopover = () => {
    this.props.getSignature();
    this.setState({ newPopoverOpen: !this.state.newPopoverOpen });
  };

  selectedReplyTemplate = (e) => {
    const templateId = e.target.value;
    this.props.toggleButtonName('reply');
    this.props.getTemplate(templateId);
    this.setState({ replyPopoverOpen: false, newPopoverOpen: false });
  };

  selectedNewTemplate = (e) => {
    const templateId = e.target.value;
    this.props.toggleButtonName('send new');
    this.props.getTemplate(templateId);
    this.setState({ replyPopoverOpen: false, newPopoverOpen: false });
  };

  handleEditorChange = () => {}

  render() {
    return (
      <div className="col-10 mt-2">
        <Loader loaded={this.props.loaded}>
          {this.props.thread.map((email, index) => {
            return <div key={email.emailId}>
              <div className="d-flex justify-content-between">
                <div>
                  <p><b>Sender:</b> {email.sender}</p>
                  {index ? '' : <p><b>Subject:</b> {email.subject}</p>}
                  <p><b>Date:</b> {email.date}</p>
                </div>
                <div >
                  {email.status ?(
                      <div>
                        <label htmlFor="selectStatus"><b>Change Status</b></label>
                        <select className="form-control" id="selectStatus" onChange={this.changeStatus} data-id={email.emailId}  value={email.status}>
                          {this.props.statuses.map(status =>
                            <option key={status._id} value={status._id}>{status.name}</option>)}
                        </select>
                      </div>) : ''
                  }
                </div>
              </div>
              <hr />
              <div>
                {
                  email.attachments ?
                  email.attachments.map((attachment, index) => (
                    <a
                      key={attachment.attachmentId} href={this.props.url[index]}
                      download={attachment.attachmentName}
                    >{attachment.attachmentName}<i className="fa fa-download" />
                    </a>)) : ''
                }
              </div>
              {
                email.isPlainText ?
                  <pre>{email.htmlBody}</pre>
                  :
                  <iframe
                    sandbox="allow-scripts"
                    ref={(el) => {
                      this.iframeRef = el;
                    }}
                    srcDoc={email.htmlBody} title="Email Content"
                    width="100%"
                    height="320px"
                    frameBorder="0"
                  />
              }
              <hr />
            </div>
          })}
          <hr />
          <div className="btn-group" role="group">
            <Button id="replyButton" onClick={this.handleReplyPopover} className="btn bg-light-blue rounded shineBtn">
            Reply
            </Button>
            <Popover placement="bottom" isOpen={this.state.replyPopoverOpen} target="replyButton" toggle={this.handleReplyPopover}>
              <PopoverHeader>Select Template</PopoverHeader>
              <PopoverBody>
                <select className="form-control" onChange={this.selectedReplyTemplate} defaultValue="_default">
                  <option disabled value="_default"> -- select an option -- </option>
                  <option value="noTemplate">No template</option>
                  {this.props.templates.map(template =>
                    <option key={template._id} value={template._id}>{template.name}</option>)}}
                </select>
              </PopoverBody>
            </Popover>

            <Button id="newEmailButton" onClick={this.handleNewPopover} className="btn btn-success rounded shineBtn">
            New Email
            </Button>
            <Popover placement="bottom" isOpen={this.state.newPopoverOpen} target="newEmailButton" toggle={this.handleNewPopover}>
              <PopoverHeader>Select Template</PopoverHeader>
              <PopoverBody>
                <select className="form-control" onChange={this.selectedNewTemplate} defaultValue="_default">
                  <option disabled value="_default"> -- select an option -- </option>
                  <option value="noTemplate">No template</option>
                  {this.props.templates.map(template =>
                    <option key={template._id} value={template._id}>{template.name}</option>)}}
                </select>
              </PopoverBody>
            </Popover>

          </div>
          <br /><br />
          <div className="col-8 email-border-top">
            <label htmlFor="addNoteTextarea">Notes about applicant</label>
            <div className="notes">
              <textarea
                data-id={this.props.note ? this.props.note._id : ''}
                className="form-control"
                id="addNoteTextarea"
                rows="7"
                placeholder="Start typing, note will auto save."
                onChange={this.typeNote}
                ref={(el) => { this.noteTextareaRef = el; }}
                value={this.state.noteContent}
              />
              <span className={this.props.noteStatus}>Saved!</span>
            </div>
          </div>
        </Loader>
      </div>
    );
  }
}

Email.propTypes = {
  email: PropTypes.object.isRequired,
  thread: PropTypes.array.isRequired,
  getEmailFromGapi: PropTypes.func.isRequired,
  getAttachmentFromGapi: PropTypes.func,
  statuses: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  changeEmailStatus: PropTypes.func.isRequired,
  changeComposeWindowHeaderText: PropTypes.func.isRequired,
  refreshSetEmailId: PropTypes.func.isRequired,
  refreshSetThreadId: PropTypes.func.isRequired,
  getEmailFromDb: PropTypes.func.isRequired,
  getThreadFromDb: PropTypes.func.isRequired,
  getTemplates: PropTypes.func.isRequired,
  note: PropTypes.object,
  getNote: PropTypes.func.isRequired,
  getTemplate: PropTypes.func.isRequired,
  sendNote: PropTypes.func.isRequired,
  noteStatus: PropTypes.string,
  url: PropTypes.array,
  changeNoteStatus: PropTypes.func.isRequired,
  toggleButtonName: PropTypes.func,
  loaded: PropTypes.bool,
  getSignature: PropTypes.func,
  getThreadFromGapi: PropTypes.func,
  threadId: PropTypes.string,
};

Email.defaultProps = {
  noteStatus: 'noteSaveStatus',
  note: { content: '' },
};

function mapStateToProps(state) {
  return {
    email: state.email.email,
    thread: state.email.thread,
    statuses: state.statuses.statuses,
    note: state.email.note,
    noteStatus: state.email.noteStatus,
    url: state.email.url,
    template: state.email.template,
    loaded: state.email.loaded,
    templates: state.settings.templates,
    threadId: state.email.threadId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmailFromGapi: emailId => dispatch(asyncGetEmailFromGapi(emailId)),
    getThreadFromGapi: threadId => dispatch(asyncGetThreadFromGapi(threadId)),
    changeEmailStatus: (emailId, statusId) => dispatch(asyncChangeEmailStatus(emailId, statusId)),
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
    getTemplate: templateId => dispatch(asyncGetTemplate(templateId)),
    changeComposeWindowHeaderText: text => dispatch(changeComposeWindowHeaderText(text)),
    toggleButtonName: btnName => dispatch(toggleButtonName(btnName)),
    getSignature: () => dispatch(asyncGetSignature()),
    getTemplates: () => dispatch(asyncGetTemplates()),
    refreshSetEmailId: emailId => dispatch(refreshSetEmailId(emailId)),
    getEmailFromDb: emailId => dispatch(asyncGetEmailFromDb(emailId)),
    refreshSetThreadId: threadId => dispatch(refreshSetThreadId(threadId)),
    getThreadFromDb: threadId => dispatch(asyncGetThreadFromDb(threadId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
