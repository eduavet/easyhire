import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Editor } from '@tinymce/tinymce-react';
import { toggleComposeWindow, asyncSendNewEmail, asyncReply } from '../../redux/reducers/emailReducer';

class Compose extends Component {
  componentWillReceiveProps(nextProps) {
    this._receiver.value = this.props.receiver;
    if (nextProps.template !== this.props.template) {
      this._editor.editor.setContent(decodeURIComponent(nextProps.template));
    }
    if (nextProps.btnName === 'reply') {
      this._subject.value = this.props.subject;
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

  closeCompose = () => {
    this.props.toggleComposeWindow('compose');
  };
  render() {
    return (
      <div className={this.props.composeWindowClassName}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.closeCompose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title">Compose</h4>
          </div>
          <form>
            <div className="modal-body">
              <div className="form-group">
                <input type="text" className="form-control" id="compose-to" ref={(to) => { this._receiver = to; }} placeholder="To" required />
              </div>

              <div className="form-group">
                <input type="text" className="form-control" id="compose-subject" ref={(sub) => { this._subject = sub; }} placeholder="Subject" required />
              </div>

              <div className="form-group">
                <Editor
                  ref={(editor) => { this._editor = editor; }}
                  initialValue=""
                  content={this.props.template}
                  init={{
                    plugins: 'link image code',
                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" id="send-button" onClick={this.onClickSend} className="btn bg-light-blue">Send</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Compose.propTypes = {
  toggleComposeWindow: PropTypes.func.isRequired,
  composeWindowClassName: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  sendNewEmail: PropTypes.func,
  btnName: PropTypes.string,
  emailId: PropTypes.string,
  reply: PropTypes.func,
  receiver: PropTypes.string,
  subject: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    composeWindowClassName: state.email.composeWindowClassName,
    template: state.email.template,
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
    reply: emailId => dispatch(asyncReply(emailId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compose);
