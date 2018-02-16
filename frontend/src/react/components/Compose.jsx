import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateTime from 'react-datetime';
import { Editor } from '@tinymce/tinymce-react';
import { toggleComposeWindow, asyncSendNewEmail, asyncReply } from '../../redux/reducers/emailReducer';
import { asyncGetSignature } from '../../redux/reducers/emailsReducer';

class Compose extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      minimize: false,
      maximize: false,
      disabled: false,
      datepickerStyle: 'hideDatetimepicker',
      dateTime: '',
      dateTimeContainerClass: 'dateTimePickerClosed',
    };
  }
  changeDatepicker = (moment) => {
    const dateTime = moment.format('DD/MM/YYYY, HH:mm');
    this.setState({ dateTime });
  };
  closeDateTimepicker = () => {
    const insertValue = this.state.dateTime ? `&nbsp;${this.state.dateTime}&nbsp;` : '';
    this.setState({ datepickerStyle: 'hideDatetimepicker', dateTimeContainerClass: 'dateTimePickerClosed', dateTime: '' });
    this._editor.editor.insertContent(insertValue);
  };
  componentWillMount() {
    this.props.getSignature();
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.signature || !nextProps.templateContent) {
      return;
    }
    const receiver = this.props.email.receiver ? this.props.email.receiver
      : this.props.email.sender;
    this._receiver.value = receiver;
    const receiverName = receiver.slice(0, receiver.indexOf(' ')).replace('"', '');
    const finalTemplate = nextProps.templateContent.replace('FIRST_NAME', receiverName);
    this._editor.editor.setContent(decodeURIComponent(`${finalTemplate} \r\n ${nextProps.signature}`));
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
      const receiver = this._receiver.value;
      this.props.sendNewEmail(receiver, subject, messageBody);
    } else if (this.props.btnName === 'reply') {
      this._subject.value = this.props.subject;
      this.props.reply(emailId, messageBody);
    }
    this.props.toggleComposeWindow('compose');
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
                <input
                  type="text"
                  className="form-control"
                  disabled={this.state.disabled}
                  id="compose-to"
                  ref={(to) => { this._receiver = to; }}
                  placeholder="To"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  disabled={this.state.disabled}
                  id="compose-subject"
                  ref={(sub) => { this._subject = sub; }}
                  placeholder="Subject"
                  required
                />
              </div>

              <div className="form-group">
                <div className="editorDateTimePickerContainer">
                  <Editor
                    ref={(editor) => { this._editor = editor; }}
                    initialValue=""
                    content={this.props.templateContent}
                    init={{
                      plugins: 'link image code insertdatetime advlist autolink lists charmap print preview hr anchor pagebreak,'
                      + 'searchreplace wordcount visualblocks visualchars fullscreen,'
                      + 'media nonbreaking save table contextmenu directionality,'
                      + 'emoticons template paste textcolor colorpicker textpattern',
                      toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                      toolbar2: 'Datepicker | print preview | forecolor backcolor emoticons' +
                      ' | insertdatetime',
                      relative_urls: false,
                      remove_script_host: false,
                      image_advtab: true,
                      height: '320',
                      setup: (editor) => {
                        editor.addButton('Datepicker', {
                          text: 'DateTimepicker',
                          icon: 'insertdatetime',
                          onclick: () => {
                            const toggleClass = this.state.datepickerStyle ? '' : 'hideDatetimepicker';
                            const toggleContainerClass = this.state.datepickerStyle ? '' : 'dateTimePickerClosed';
                            const insertValue = this.state.datepickerStyle ? '' : `&nbsp;${this.state.dateTime}&nbsp;`;
                            this.setState({
                              datepickerStyle: toggleClass,
                              dateTimeContainerClass: toggleContainerClass,
                              dateTime: '',
                            });
                            this._editor.editor.insertContent(insertValue);
                          },
                        });
                      },
                    }}
                  />
                  <div className={`dateTimeContainer ${this.state.dateTimeContainerClass}`}>
                    <button type="button" className="btn btn-close-datepicker" onClick={this.closeDateTimepicker}>&times;</button>
                    <DateTime
                      className={this.state.datepickerStyle}
                      onChange={moment => this.changeDatepicker(moment)}
                      ref={(picker) => { this._datepicker = picker; }}
                      input={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                id="send-button"
                onClick={this.onClickSend}
                className="btn bg-light-blue shineBtn"
              >
              Send
              </button>
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
  getSignature: PropTypes.func.isRequired,
  composeWindowClassName: PropTypes.string.isRequired,
  composeWindowHeaderText: PropTypes.string.isRequired,
  templateContent: PropTypes.string,
  sendNewEmail: PropTypes.func,
  btnName: PropTypes.string,
  emailId: PropTypes.string,
  reply: PropTypes.func,
  email: PropTypes.object,
  subject: PropTypes.string,
  signature: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    composeWindowClassName: state.email.composeWindowClassName,
    composeWindowHeaderText: state.email.composeWindowHeaderText,
    templateContent: state.email.templateContent,
    signature: state.emails.signature,
    messageSent: state.email.messageSent,
    btnName: state.email.btnName,
    emailId: state.email.email.emailId,
    email: state.email.email,
    subject: state.email.email.subject,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleComposeWindow: param => dispatch(toggleComposeWindow(param)),
    sendNewEmail: (receiver, subject, messageBody) =>
      dispatch(asyncSendNewEmail(receiver, subject, messageBody)),
    reply: (emailId, content) => dispatch(asyncReply(emailId, content)),
    getSignature: () => dispatch(asyncGetSignature()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compose);
