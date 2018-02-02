import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncRefresh } from '../../redux/reducers/emailsReducer';
import { asyncRefreshFolders } from '../../redux/reducers/folderReducer';

function Refresh(props) {
  return (
    <div className="col-2">
      <button className="btn sync-btn" onClick={() => { props.refresh(); props.asyncRefreshFolders(); }}>
        <i className="fa fa-sync-alt" />
        Refresh
      </button>
    </div>
  );
}

Refresh.propTypes = {
  refresh: PropTypes.func,
  asyncRefreshFolders: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    refresh: () => dispatch(asyncRefresh()),
    asyncRefreshFolders: () => dispatch(asyncRefreshFolders()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Refresh);
