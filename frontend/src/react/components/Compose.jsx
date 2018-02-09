import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import { toggleComposeWindow, asyncSendNewEmail, asyncReply } from '../../redux/reducers/emailReducer';

class Compose extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      minimize: false,
      maximize: false,
    };
  }
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
};

function mapStateToProps(state) {
  return {
    composeWindowClassName: state.email.composeWindowClassName,
    composeWindowHeaderText: state.email.composeWindowHeaderText,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleComposeWindow: param => dispatch(toggleComposeWindow(param)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Compose);
