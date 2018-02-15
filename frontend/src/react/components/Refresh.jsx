import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { asyncRefresh, asyncGetSentEmailsFromGapi } from '../../redux/reducers/emailsReducer';
import { asyncRefreshFolders } from '../../redux/reducers/folderReducer';

function Refresh(props) {
  return (
    <div className="col-2">
      <button className="btn sync-btn shineBtn" onClick={() => { props.refresh(); props.asyncRefreshFolders(); props.getSentEmailsFromGapi()  }}>
        <i className="fa fa-sync-alt" />
        &nbsp;Sync
      </button>
    </div>
  );
}

Refresh.propTypes = {
  refresh: PropTypes.func,
  getSentEmailsFromGapi: PropTypes.func,
  asyncRefreshFolders: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    refresh: () => dispatch(asyncRefresh()),
    getSentEmailsFromGapi: () => dispatch(asyncGetSentEmailsFromGapi()),
    asyncRefreshFolders: () => dispatch(asyncRefreshFolders()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Refresh);
