import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function Email(props) {
  return (
    <div className="col-10 mt-4">
      <div className="d-flex justify-content-between text-center wrap-words">
        <h4 className="w-20"><small>Sender: </small><br />{props.email.sender}</h4>
        <h3 className="w-20"><small>Subject: </small><br />{props.email.subject}</h3>
        <p className="w-20"><small>Status: </small><br />Approved</p>
        <p className="w-20"><small>Date: </small><br />{props.email.date}</p>
      </div>
      <hr />
      <p dangerouslySetInnerHTML={{ __html: props.email.htmlBody }}></p>
      {/*<iframe dangerouslySetInnerHTML={{ __html: props.email.htmlBody }} title="Email Content"></iframe>*/}
    </div>
  );
}
Email.propTypes = {
  email: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    email: state.email.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
