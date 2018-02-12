import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncGetAttachmentFromGapi, asyncSendNewEmail, asyncGetNote, asyncSendNote, changeNoteStatus, asyncReply, asyncGetTemplate, changeComposeWindowHeaderText, toggleButtonName } from '../../redux/reducers/emailReducer';

const Loader = require('react-loader');

class Templates extends Component {

  componentDidMount() {
    this.props.getEmailFromGapi(emailId);
  }
  render() {
    return (
      <div className="col-10 mt-4">
        <Loader loaded={this.props.loaded}>
        </Loader>
      </div>
    );
  }
}

Templates.propTypes = {
  email: PropTypes.object.isRequired,
};

Templates.defaultProps = {

};

function mapStateToProps(state) {
  return {
    email: state.email.email,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    getEmailFromGapi: emailId => dispatch(asyncGetEmailFromGapi(emailId)),

  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Templates);
