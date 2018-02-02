import React from 'react';
import { connect } from 'react-redux';
import { asyncRefresh } from '../../redux/reducers/emailsReducer';

function Refresh(props) {
  return (
    <div className="col-2">
      <button className="btn sync-btn" onClick={props.refresh}><i className="fa fa-sync-alt" /> Refresh</button>
    </div>
  );
}
function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    refresh: () => dispatch(asyncRefresh()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Refresh);
