import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class EmailHtmlBody extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      iFrameHeight: '0px',
    };
  }
  componentDidMount() {
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
        ref={(f) => { this.iframeRef = f; }}
        srcDoc={<div id="emailContentContainer">${this.props.emailHtmlBody}</div>} title="Email Content"
        onLoad={() => {
          const obj = ReactDOM.findDOMNode(this);
          this.setState({
            iFrameHeight: `${obj.contentWindow.document.body.scrollHeight}px`,
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
