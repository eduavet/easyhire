import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Editor } from '@tinymce/tinymce-react';
import { toggleComposeWindow, asyncSendNewEmail, asyncReply } from '../../redux/reducers/emailReducer';

class Compose extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      minimize: false,
      maximize: false,
      disabled: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    this._receiver.value = this.props.receiver;
    if (nextProps.template !== this.props.template) {
      this._editor.editor.setContent(decodeURIComponent(`${nextProps.template} \r\n ${nextProps.signature}`));
    }
    if (nextProps.btnName === 'reply') {
      this._subject.value = this.props.subject;
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
      this._subject.value = '';
    }
  }
  onClickSend = (evt) => {
    evt.preventDefault();
    const emailId = this.props.emailId;
    const messageBody = this._editor.editor.getContent();
    if (this.props.btnName === 'send new') {
      const subject = this._subject.value;
      this.props.sendNewEmail(emailId, subject, messageBody);
    } else if (this.props.btnName === 'reply') {
      this._subject.value = this.props.subject;
      this.props.reply(emailId, messageBody);
    }
    this.props.toggleComposeWindow('compose');
    notify.show('Mesasge sent!', 'success', 1500);
  };

  closeCompose = (evt) => {
    evt.stopPropagation();
    this.props.toggleComposeWindow('compose');
  };
  minimizeCompose = () => {
    this.setState({ minimize: !this.state.minimize });
    const composeWindowClass = this.state.minimize ? 'compose show' : 'compose minimized';
    this.props.toggleComposeWindow(composeWindowClass);
  };
  maximizeCompose = (evt) => {
    evt.stopPropagation();
    this.setState({ minimize: false });
    this.setState({ maximize: !this.state.maximize });
    const composeWindowClass = this.state.maximize ? 'compose show' : 'compose maximized';
    this.props.toggleComposeWindow(composeWindowClass);
  };
  render() {
    return (
      <div className={this.props.composeWindowClassName}>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <button type="button" className="close" onClick={this.closeCompose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <button type="button" className="close maximize" onClick={this.maximizeCompose} aria-label="Close">
                <i className="fa fa-window-maximize" />
              </button>
              <button type="button" className="close minimize" onClick={this.minimizeCompose} aria-label="Close">
                <i className="fa fa-window-minimize" />
              </button>
            </div>
            <h4 className="modal-title">{this.props.composeWindowHeaderText}</h4>
          </div>
          <form>
            <div className="modal-body">
              <div className="form-group">
                <input type="text" className="form-control" disabled={this.state.disabled} id="compose-to" ref={(to) => { this._receiver = to; }} placeholder="To" required />
              </div>

              <div className="form-group">
                <input type="text" className="form-control" disabled={this.state.disabled} id="compose-subject" ref={(sub) => { this._subject = sub; }} placeholder="Subject" required />
              </div>

              <div className="form-group">
                <Editor
                  ref={(editor) => { this._editor = editor; }}
                  initialValue=""
                  content={this.props.template}
                  init={{
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
                    height: '220',
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" id="send-button" onClick={this.onClickSend} className="btn bg-light-blue">Send</button>
            </div>
          </form>
        </div>
        <div className="modal-header rounded minimized" onClick={this.minimizeCompose}>
          <div>
            <button type="button" className="close" onClick={this.closeCompose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <button type="button" className="close maximize" onClick={this.maximizeCompose} aria-label="Close">
              <i className="fa fa-window-maximize" />
            </button>
            <button type="button" className="close minimize" onClick={this.minimizeCompose} aria-label="Close">
              <i className="fa fa-window-minimize" />
            </button>
          </div>
          <h4 className="modal-title">{this.props.composeWindowHeaderText}</h4>
        </div>
      </div>
    );
  }
}

Compose.propTypes = {
  toggleComposeWindow: PropTypes.func.isRequired,
  composeWindowClassName: PropTypes.string.isRequired,
  composeWindowHeaderText: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  sendNewEmail: PropTypes.func,
  btnName: PropTypes.string,
  emailId: PropTypes.string,
  reply: PropTypes.func,
  receiver: PropTypes.string,
  subject: PropTypes.string,
  signature: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    composeWindowClassName: state.email.composeWindowClassName,
    composeWindowHeaderText: state.email.composeWindowHeaderText,
    template: state.email.template,
    signature: state.emails.signature,
    messageSent: state.email.messageSent,
    btnName: state.email.btnName,
    emailId: state.email.email.emailId,
    receiver: state.email.email.sender,
    subject: state.email.email.subject,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleComposeWindow: param => dispatch(toggleComposeWindow(param)),
    sendNewEmail: (emailId, subject, messageBody) =>
      dispatch(asyncSendNewEmail(emailId, subject, messageBody)),
    reply: (emailId, content) => dispatch(asyncReply(emailId, content)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compose);
