import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Input } from 'reactstrap';
import { selectAll, selectNone, asyncMoveEmails, asyncDeleteEmails, asyncMark, asyncGetStatusEmails, asyncSearch } from '../../redux/reducers/emailsReducer';
import ModalDeleteEmails from './ModalDeleteEmails.jsx';

class SentToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpen: false,
      moveOpen: false,
      markOpen: false,
      filterOpen: false,
      deleteModal: false,
      deleteCount: 0,
    };
  }

  toggleSelect = () => {
    this.setState({
      selectOpen: !this.state.selectOpen,
    });
  };

  toggleMove = () => {
    this.setState({
      moveOpen: !this.state.moveOpen,
    });
  };

  toggleMark = () => {
    this.setState({
      markOpen: !this.state.markOpen,
    });
  };
  toggleFilter = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    });
  };
  moveToFolder = (id) => {
    const inboxActive = this.props.folders[0].isActive;
    const emailsToMove = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailId);
    this.props.postEmailsToFolder(emailsToMove, id, inboxActive);
  };

  mark = (isRead) => {
    const emailsToMark = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailId);
    this.props.asyncMark(emailsToMark, isRead);
  };

  deleteEmail = () => {
    const emailsToDelete = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailId);
    this.props.deleteEmails(emailsToDelete);
    this.setState({ deleteModal: !this.state.deleteModal, deleteCount: 0 });
  };

  toggleDeleteModal = () => {
    if (this.props.emails.filter(email => email.isChecked).length) {
      this.setState({
        deleteModal: !this.state.deleteModal,
        deleteCount: this.props.emails.filter(email => email.isChecked).length,
      });
    }
  };

  filterBy = (statusId, folderId) => {
    this.props.getStatusEmails(statusId, folderId);
  };

  search = (e) => {
    const folderId = this.props.folders.filter(item => item.isActive === true)[0]._id;
    e.persist();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    const storeFunc = this.props.asyncSearch;
    this.setState({
      typingTimeout: setTimeout(() => {
        storeFunc(e.target.value, folderId);
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
  emails: PropTypes.array.isRequired,
  postEmailsToFolder: PropTypes.func.isRequired,
  asyncMark: PropTypes.func.isRequired,
  deleteEmails: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  getStatusEmails: PropTypes.func.isRequired,
  asyncSearch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    emails: state.emails.emails,
    folders: state.folders.folders,
    statuses: state.statuses.statuses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectAll: emails => dispatch(selectAll(emails)),
    selectNone: emails => dispatch(selectNone(emails)),
    asyncMark: (emailIds, isRead) => dispatch(asyncMark(emailIds, isRead)),
    postEmailsToFolder: (emailIds, folderId, inboxActive) =>
      dispatch(asyncMoveEmails(emailIds, folderId, inboxActive)),
    deleteEmails: emailIds => dispatch(asyncDeleteEmails(emailIds)),
    getStatusEmails: (statusId, folderId) => dispatch(asyncGetStatusEmails(statusId, folderId)),
    asyncSearch: (text, folderId) => dispatch(asyncSearch(text, folderId)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SentToolbar);
