import React from 'react';
import { connect } from 'react-redux';

function Email(props) {
  return (
    <div className="col-10 mt-4">
      <h1>EMAIL COMPONENT</h1>
    </div>
  );
}
function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Email);
