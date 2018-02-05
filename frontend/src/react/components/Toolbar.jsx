import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Input } from 'reactstrap';
import { notify } from 'react-notify-toast';
import { selectAll, selectNone, asyncMoveEmails, asyncDeleteEmails, asyncMark, asyncGetStatusEmails } from '../../redux/reducers/emailsReducer';
import ModalDeleteEmails from './ModalDeleteEmails.jsx';
import { isActive } from '../../redux/reducers/statusReducer';


class Toolbar extends Component {
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

  toggleSelect=() => {
    this.setState({
      selectOpen: !this.state.selectOpen,
    });
  };

  toggleMove=() => {
    this.setState({
      moveOpen: !this.state.moveOpen,
    });
  };

  toggleMark=() => {
    this.setState({
      markOpen: !this.state.markOpen,
    });
  };
  toggleFilter=() => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    });
  };
  moveToFolder=(id) => {
    const emailsToMove = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailID);
    this.props.postEmailsToFolder(emailsToMove, id);
    notify.show('Emails(s) moved!', 'success', 1500);
  };

  mark = (isRead) => {
    const emailsToMark = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailID);
    this.props.asyncMark(emailsToMark, isRead);
    notify.show('Email(s) updated!', 'success', 1500);
  };

  deleteEmail=() => {
    const emailsToDelete = this.props.emails.filter(email =>
      email.isChecked).map(email => email.emailID);
    this.props.deleteEmails(emailsToDelete);
    this.setState({ deleteModal: !this.state.deleteModal, deleteCount: 0 });
    notify.show('Email(s) deleted!', 'success', 1500);
  };

  toggleDeleteModal = () => {
    if (this.props.emails.filter(email => email.isChecked).length) {
      this.setState({
        deleteModal: !this.state.deleteModal,
        deleteCount: this.props.emails.filter(email => email.isChecked).length,
      });
    }
  };

  filterBy = (statusId) => {
    this.props.getStatusEmails(statusId);
  };

  statusToggler = (status) => {
    this.props.isActive(status);
  };

  render() {
    return (
      <div className="col-10">
        <Nav pills className="toolbar">
          <Dropdown nav isOpen={this.state.selectOpen} toggle={this.toggleSelect}>
            <DropdownToggle className="selectbtn" nav caret >
              Select
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <div onClick={() => this.props.selectAll(this.props.emails)}>Select All</div>
              </DropdownItem>
              <DropdownItem>
                <div onClick={() => this.props.selectNone(this.props.emails)}> Select none</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav isOpen={this.state.moveOpen} toggle={this.toggleMove}>
            <DropdownToggle className="actionbtn" nav caret>
              Move to
            </DropdownToggle>
            <DropdownMenu>
              {
                this.props.folders.map((folder) => {
                  if (folder.name !== 'Inbox') {
                    return (
                      <DropdownItem key={folder._id}>
                        <div onClick={() => this.moveToFolder(folder._id)}>{folder.name}</div>
                      </DropdownItem>);
                  }
                })
              }
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav isOpen={this.state.markOpen} toggle={this.toggleMark}>
            <DropdownToggle className="selectbtn" nav caret >
              Mark as
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <div onClick={() => this.mark(true)}>Read</div>
              </DropdownItem>
              <DropdownItem>
                <div onClick={() => this.mark(false)}>Unread</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav isOpen={this.state.filterOpen} toggle={this.toggleFilter}>
            <DropdownToggle className="actionbtn" nav caret>
              Filter By Status
            </DropdownToggle>
            <DropdownMenu>
              {
                this.props.statuses.map(status => (
                  <DropdownItem key={status._id}>
                    <div onClick={() => {
                      this.statusToggler(status);
                      this.filterBy(status._id);
                    }}
                    >{status.name}
                    </div>
                  </DropdownItem>))
              }
            </DropdownMenu>
          </Dropdown>
          <NavItem>
            <NavLink href="#" onClick={() => this.toggleDeleteModal()}>
              <i className="fas fa-trash-alt" />
            </NavLink>
          </NavItem>
          <NavItem className="searchContainer">
            <form className="my-2 my-lg-0">
              <div className="inner-addon left-addon">
                <i className="fa fa-search search-icon" />
                <Input
                  className="form-control mr-lg-2" type="search"
                  placeholder="Search" aria-label="Search"
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

Toolbar.propTypes = {
  emails: PropTypes.array.isRequired,
  postEmailsToFolder: PropTypes.func.isRequired,
  asyncMark: PropTypes.func.isRequired,
  deleteEmails: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  isActive: PropTypes.func.isRequired,
  getStatusEmails: PropTypes.func.isRequired,
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
    postEmailsToFolder: (emailIds, folderId) =>
      dispatch(asyncMoveEmails(emailIds, folderId)),
    deleteEmails: emailIds => dispatch(asyncDeleteEmails(emailIds)),
    getStatusEmails: statusId => dispatch(asyncGetStatusEmails(statusId)),
    isActive: item => dispatch(isActive(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toolbar);
