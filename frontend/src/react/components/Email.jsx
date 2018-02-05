import React from 'react';
import { connect } from 'react-redux';

function Email(props) {
  return (
    <div className="col-10 mt-4">
      <h1>EMAIL COMPONENT</h1>
      <p>Sender: {this.props.sender}</p>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    email: state.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
