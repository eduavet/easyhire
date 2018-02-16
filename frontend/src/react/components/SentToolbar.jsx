import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, NavItem, Input } from 'reactstrap';
import { asyncGetStatusEmails, asyncSearch } from '../../redux/reducers/emailsReducer';
import ModalDeleteEmails from './ModalDeleteEmails.jsx';

class SentToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      deleteCount: 0,
    };
  }

  search = (e) => {
    const folderId = this.props.folders.filter(item => item.isActive === true)[0]._id;
    e.persist();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const storeFunc = this.props.asyncSearch;
    this.setState({
      typingTimeout: setTimeout(() => {
        storeFunc(e.target.value, folderId, 'sent');
      }, 1000),
    });
  }

  render() {
    return (
      <div className="col-10">
        <Nav pills className="toolbar">
          <NavItem className="searchContainer">
            <form className="my-2 my-lg-0">
              <div className="inner-addon left-addon">
                <i className="fa fa-search search-icon" />
                <Input
                  className="form-control mr-lg-2" type="search"
                  placeholder="Search" aria-label="Search" ref="searchField"
                  onKeyUp={this.search}
                />
              </div>
            </form>
          </NavItem>
        </Nav>
        <ModalDeleteEmails
          isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}
          deleteEmail={this.deleteEmail} count={this.state.deleteCount}
        />
      </div>);
  }
}

SentToolbar.propTypes = {
  folders: PropTypes.array.isRequired,
  asyncSearch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    folders: state.folders.folders,
    statuses: state.statuses.statuses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStatusEmails: (statusId, folderId) => dispatch(asyncGetStatusEmails(statusId, folderId)),
    asyncSearch: (text, folderId, searchType) => dispatch(asyncSearch(text, folderId, searchType)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SentToolbar);
