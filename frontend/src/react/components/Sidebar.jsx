import React, { Component } from 'react';
import { connect } from 'react-redux';
import { notify } from 'react-notify-toast';
import PropTypes from 'prop-types';
import ModalNewFolder from './folder modals/ModalNewFolder.jsx';
import ModalUpdateFolder from './folder modals/ModalUpdateFolder.jsx';
import ModalDeleteFolder from './folder modals/ModalDeleteFolder.jsx';
import ModalCannotDeleteFolder from './folder modals/ModalCannotDeleteFolder.jsx';
import { asyncGetFolderEmails, asyncRefresh } from '../../redux/reducers/emailsReducer';
import { asyncDeleteFolder, asyncUpdateFolder, isActive } from '../../redux/reducers/folderReducer';

const deleteId = { value: '' };
const updateId = { value: '' };

class Sidebar extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      updateModal: false,
      deleteModal: false,
      cannotDeleteModal: false,
      updateFolderName: '',
      deleteFolderName: '',
    };
  }
    toggleUpdateModal = (evt) => {
      evt.stopPropagation();
      updateId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({
        updateModal: !this.state.updateModal,
        updateFolderName: evt.target.dataset.name,
      });
    };
    toggleDeleteModal = (evt) => {
      evt.stopPropagation();
      deleteId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({
        deleteModal: !this.state.deleteModal,
        deleteFolderName: evt.target.dataset.name,
      });
    };
    toggleCannotDeleteModal = (evt) => {
      evt.stopPropagation();
      this.setState({
        cannotDeleteModal: !this.state.cannotDeleteModal,
        cannotDeleteFolderName: evt.target.dataset.name,
      });
    };
    updateFolder = (folderName) => {
      this.props.updateFolder({ id: updateId.value, folderName: folderName.value });
      this.setState({ updateModal: false, updateFolderName: '' });
      notify.show('Folder name updated!', 'success', 1500);
    };
    deleteFolder = () => {
      this.props.deleteFolder(deleteId.value);
      this.setState({ deleteModal: false, deleteFolderName: '' });
      notify.show('Folder deleted!', 'success', 1500);
    };
    // Make folder active to highlight it
    folderToggler = (folder) => {
      this.props.isActive(folder);
    };
    // Handle folder click on non-inbox folders
    openFolder = (folderId) => {
      this.props.getFolderEmails(folderId);
    };
    render() {
      return (
        <div className="col-2 mt-4">
          <ul className="list-group folders">
            { this.props.folders.map(folder =>
              (<Folder
                key={folder._id} folder={folder} folderToggler={this.folderToggler}
                getEmails={this.props.getEmails} openFolder={this.openFolder}
                toggleUpdateModal={this.toggleUpdateModal}
                toggleDeleteModal={this.toggleDeleteModal}
                toggleCannotDeleteModal={this.toggleCannotDeleteModal}
              />))}
            <ModalNewFolder />
          </ul>
          <ModalUpdateFolder
            isOpenUpdate={this.state.updateModal}
            toggleUpdateModal={this.toggleUpdateModal} updateFolder={this.updateFolder}
            updateFolderName={this.state.updateFolderName}
          />
          <ModalDeleteFolder
            isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}
            deleteFolder={this.deleteFolder} deleteFolderName={this.state.deleteFolderName}
          />
          <ModalCannotDeleteFolder
            isOpenCannotDelete={this.state.cannotDeleteModal}
            toggleCannotDeleteModal={this.toggleCannotDeleteModal}
            cannotDeleteFolderName={this.state.cannotDeleteFolderName}
          />
        </div>
      );
    }
}

function Folder(props) {
  const folderIsActive = props.folder.isActive ? 'active-folder' : '';
  const { icon } = props.folder;
  const isDeletable = props.folder.userId;
  return (
    <li
      className={`list-group-item list-group-item-action ${folderIsActive}`}
      onClick={() => {
        props.folderToggler(props.folder);
        if (props.folder._id === 'allEmails') {
            props.openFolder('allEmails');
        } else { props.openFolder(props.folder._id); }
    }}
    >
      <i className={`fa ${icon}`} aria-hidden="true" />
      &nbsp;{props.folder.name}
      &nbsp;({props.folder.count})
      <div className="d-inline float-right">
        {
          isDeletable ?
            <i
              className="fa fa-pencil-alt folder-actions" aria-hidden="true"
              data-id={props.folder._id} data-name={props.folder.name}
              onClick={props.toggleUpdateModal}
            />
                  :
                  ''
        }
        {
          isDeletable ?
            <i
              className="fa fa-trash folder-actions" aria-hidden="true"
              data-id={props.folder._id} data-name={props.folder.name}
              onClick={props.folder.count ? props.toggleCannotDeleteModal : props.toggleDeleteModal}
            />
                  :
                  ''
        }
      </div>
    </li>
  );
}

Sidebar.propTypes = {
  updateFolder: PropTypes.func.isRequired,
  deleteFolder: PropTypes.func.isRequired,
  isActive: PropTypes.func.isRequired,
  getFolderEmails: PropTypes.func.isRequired,
  folders: PropTypes.array.isRequired,
  getEmails: PropTypes.func.isRequired,
};

Folder.propTypes = {
  folder: PropTypes.object.isRequired,
  folderToggler: PropTypes.func.isRequired,
  openFolder: PropTypes.func.isRequired,
  toggleUpdateModal: PropTypes.func.isRequired,
  toggleCannotDeleteModal: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  getEmails: PropTypes.func.isRequired,

};

function mapStateToProps(state) {
  return {
    folders: state.folders.folders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFolder: param => dispatch(asyncDeleteFolder(param)),
    updateFolder: param => dispatch(asyncUpdateFolder(param)),
    isActive: item => dispatch(isActive(item)),
    getFolderEmails: folderId => dispatch(asyncGetFolderEmails(folderId)),
    getEmails: () => dispatch(asyncRefresh()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
