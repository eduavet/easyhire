import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import ModalNewStatus from './status modals/ModalNewStatus.jsx';
import ModalUpdateStatus from './status modals/ModalUpdateStatus.jsx';
import ModalDeleteStatus from './status modals/ModalDeleteStatus.jsx';
import ModalCannotDeleteStatus from './status modals/ModalCannotDeleteStatus.jsx';
import { asyncGetFolderEmails, asyncRefresh } from '../../redux/reducers/emailsReducer';
import { isActive } from '../../redux/reducers/folderReducer';
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

    render() {
      return (
        <div className="col-4 mt-4 statuses">
          <ul className="list-group folders">
            { this.props.statuses ? this.props.statuses.map(status =>
              (<Status
                key={status._id} status={status}
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
  const status = props.status;
  return (
    <li
      className="list-group-item list-group-item-action"
      data-id={status._id}
      data-name={status.name}
      onClick={isDeletable ? props.toggleUpdateModal : null}
    >
      <i className="fa fa-address-card" aria-hidden="true" />
      &nbsp;{status.name}
      &nbsp;({status.count})
      <div className="d-inline float-right">
        {
          isDeletable ?
            <i
              className="fa fa-pencil-alt folder-actions" aria-hidden="true"
              data-id={status._id} data-name={status.name}
              onClick={props.toggleUpdateModal}
            />
          :
            ''
        }
        {
          isDeletable ?
            <i
              className="fa fa-trash folder-actions" aria-hidden="true"
              data-id={status._id} data-name={status.name}
              onClick={status.count ? props.toggleCannotDeleteModal : props.toggleDeleteModal}
            />
          :
            ''
        }
      </div>
    </li>
  );
}

Statuses.propTypes = {
  updateStatus: PropTypes.func.isRequired,
  deleteStatus: PropTypes.func.isRequired,
  statuses: PropTypes.array.isRequired,
};

Status.propTypes = {
  status: PropTypes.object.isRequired,
  toggleUpdateModal: PropTypes.func.isRequired,
  toggleCannotDeleteModal: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    folders: state.folders.folders,
    statuses: state.statuses.statuses,
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
