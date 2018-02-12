import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import ModalNewStatus from './ModalNewStatus.jsx';
import ModalUpdateStatus from './ModalUpdateStatus.jsx';
import ModalDeleteStatus from './ModalDeleteStatus.jsx';
import ModalCannotDeleteStatus from './ModalCannotDeleteStatus.jsx';
import { asyncGetFolderEmails, asyncRefresh } from '../../redux/reducers/emailsReducer';
import { asyncDeleteFolder, asyncUpdateFolder, isActive } from '../../redux/reducers/folderReducer';
import { asyncGetStatuses, asyncDeleteStatus, asyncUpdateStatus } from '../../redux/reducers/statusReducer';

const deleteId = { value: '' };
const updateId = { value: '' };

class Statuses extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      updateModal: false,
      deleteModal: false,
      cannotDeleteModal: false,
      updateStatusName: '',
      deleteStatusName: '',
    };
    // this.props.getStatuses()
  }
    toggleUpdateModal = (evt) => {
      evt.stopPropagation();
      updateId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({
        updateModal: !this.state.updateModal,
        updateStatusName: evt.target.dataset.name,
      });
    };
    toggleDeleteModal = (evt) => {
      evt.stopPropagation();
      deleteId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({
        deleteModal: !this.state.deleteModal,
        deleteStatusName: evt.target.dataset.name,
      });
    };
    toggleCannotDeleteModal = (evt) => {
      evt.stopPropagation();
      this.setState({
        cannotDeleteModal: !this.state.cannotDeleteModal,
        cannotDeleteStatusName: evt.target.dataset.name,
      });
    };
    updateStatus = (statusName) => {
      this.props.updateStatus({ id: updateId.value, statusName: statusName.value });
      this.setState({ updateModal: false, updateStatusName: '' });
      notify.show('Status name updated!', 'success', 1500);
    };
    deleteStatus = () => {
      this.props.deleteStatus(deleteId.value);
      this.setState({ deleteModal: false, deleteStatusName: '' });
      notify.show('Status deleted!', 'success', 1500);
    };
    // Make folder active to highlight it
    statusToggler = (status) => {
      // this.props.isActive(status);
    };
    // Handle folder click on non-inbox folders
    openStatus = (statusId) => {
      this.props.getStatusEmails(folderId);
    };
    render() {
      return (
        <div className="col-4 mt-4">
          <ul className="list-group folders">
            { this.props.statuses ? this.props.statuses.map(status =>
              (<Status
                key={status._id} status={status} statusToggler={this.statusToggler}
                openStatus={this.openStatus}
                toggleUpdateModal={this.toggleUpdateModal}
                toggleDeleteModal={this.toggleDeleteModal}
                toggleCannotDeleteModal={this.toggleCannotDeleteModal}
              />)) : ''}
            <ModalNewStatus />
          </ul>
          <ModalUpdateStatus
            isOpenUpdate={this.state.updateModal}
            toggleUpdateModal={this.toggleUpdateModal} updateStatus={this.updateStatus}
            updateStatusName={this.state.updateStatusName}
          />
        <ModalDeleteStatus
            isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}
            deleteStatus={this.deleteStatus} deleteStatusName={this.state.deleteStatusName}
          />
        <ModalCannotDeleteStatus
            isOpenCannotDelete={this.state.cannotDeleteModal}
            toggleCannotDeleteModal={this.toggleCannotDeleteModal}
            cannotDeleteStatusName={this.state.cannotDeleteStatusName}
          />
        </div>
      );
    }
}

function Status(props) {
  const isDeletable = props.status.userId;
  return (
    <li
      className={`list-group-item list-group-item-action`}
    >
      <i className={'fa fa-address-card'} aria-hidden="true" />
      &nbsp;{props.status.name}
      &nbsp;({props.status.count})
      <div className="d-inline float-right">
        {
          isDeletable ?
            <i
              className="fa fa-pencil-alt folder-actions" aria-hidden="true"
              data-id={props.status._id} data-name={props.status.name}
              onClick={props.toggleUpdateModal}
            />
                  :
                  ''
        }
        {
          isDeletable ?
            <i
              className="fa fa-trash folder-actions" aria-hidden="true"
              data-id={props.status._id} data-name={props.status.name}
              onClick={props.status.count ? props.toggleCannotDeleteModal : props.toggleDeleteModal}
            />
                  :
                  ''
        }
      </div>
    </li>
  );
}

Statuses.propTypes = {
  // updateStatus: PropTypes.func.isRequired,
  // deleteFolder: PropTypes.func.isRequired,
  // isActive: PropTypes.func.isRequired,
  // getFolderEmails: PropTypes.func.isRequired,
  // folders: PropTypes.array.isRequired,
  // getEmails: PropTypes.func.isRequired,
};

Statuses.propTypes = {
  // folder: PropTypes.object.isRequired,
  // folderToggler: PropTypes.func.isRequired,
  // openFolder: PropTypes.func.isRequired,
  // toggleUpdateModal: PropTypes.func.isRequired,
  // toggleCannotDeleteModal: PropTypes.func.isRequired,
  // toggleDeleteModal: PropTypes.func.isRequired,
  // getEmails: PropTypes.func.isRequired,

};

function mapStateToProps(state) {
  return {
    folders: state.folders.folders,
    statuses: state.statuses.statuses
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteStatus: statusId => dispatch(asyncDeleteStatus(statusId)),
    updateStatus: statusId => dispatch(asyncUpdateStatus(statusId)),
    isActive: item => dispatch(isActive(item)),
    getFolderEmails: folderId => dispatch(asyncGetFolderEmails(folderId)),
    getEmails: () => dispatch(asyncRefresh()),
    getStatuses: () => dispatch(asyncGetStatuses()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Statuses);
