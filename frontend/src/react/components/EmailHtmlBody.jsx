import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from 'react-notify-toast';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import { asyncChangeEmailStatus, asyncGetEmailFromGapi, asyncGetAttachmentFromGapi, asyncSendNewEmail, asyncGetNote, asyncSendNote, changeNoteStatus, asyncReply, asyncGetTemplate, changeComposeWindowHeaderText, toggleButtonName } from '../../redux/reducers/emailReducer';

const Loader = require('react-loader');

export default class EmailHtmlBody extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      iFrameHeight: '0px',
    };
  }
  componentDidMount() {
    console.log('this.props.emailHtmlBody', this.props.emailHtmlBody);
    // const obj = this.iframeRef;
    // console.log('obj', obj);
    // this.setState({
    //   iFrameHeight: `${obj.contentWindow.document.body.scrollHeight}px`,
    // });
  }
  render() {
    return (
      <iframe
        sandbox="allow-scripts"
        ref={f => this.iframeRef = f}
        srcDoc={<div id="emailContentContainer">${this.props.emailHtmlBody}</div>} title="Email Content"
        onLoad={() => {
          console.log('onload')
          console.log('onload this.props.emailHtmlBody', this.props.emailHtmlBody);
          const obj = ReactDOM.findDOMNode(this);
          this.setState({
            "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
          });

        }}
        width="100%"
        height={this.state.iFrameHeight}
        scrolling="no"
        frameBorder="0"
      />
    );
  }
}
EmailHtmlBody.propTypes = {
  emailHtmlBody: PropTypes.string.isRequired,
};
