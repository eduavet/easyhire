import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ModalNewFolder from './ModalNewFolder.jsx'
import ModalUpdateFolder from './ModalUpdateFolder.jsx'
import ModalDeleteFolder from './ModalDeleteFolder.jsx'
import ModalCannotDeleteFolder from './ModalCannotDeleteFolder.jsx'
import { asyncDeleteFolder, asyncUpdateFolder, isActive, asyncGetFolderEmails, asyncRefresh } from '../../redux/reducers/emailsReducer';
import {notify} from 'react-notify-toast';

const deleteId = { value: ''};
const updateId = { value: ''};

class Sidebar extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            updateModal: false,
            deleteModal: false,
            cannotDeleteModal: false,
            updateFolderName: '',
            deleteFolderName: ''
        }
    }
    toggleUpdateModal = (evt) => {
      evt.stopPropagation();
      updateId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({updateModal: !this.state.updateModal, updateFolderName: evt.target.dataset.name});
    };
    toggleDeleteModal = (evt) => {
      evt.stopPropagation();
      deleteId.value = evt.target.dataset ? evt.target.dataset.id : '';
      this.setState({ deleteModal: !this.state.deleteModal, deleteFolderName: evt.target.dataset.name });
    };
    toggleCannotDeleteModal = (evt) => {
      evt.stopPropagation();
      this.setState({ cannotDeleteModal: !this.state.cannotDeleteModal, cannotDeleteFolderName: evt.target.dataset.name });
    };
    updateFolder = (folderName) => {
      this.props.updateFolder({id: updateId.value, folderName: folderName.value});
      this.setState({updateModal: false, updateFolderName: ''});
      notify.show('Folder name updated!', 'success', 1500);
    };
    deleteFolder = (folder) => {
      this.props.deleteFolder(deleteId.value);
      this.setState({deleteModal: false, deleteFolderName: ''});
      notify.show('Folder deleted!', 'success', 1500);
    };
    folderToggler = (folder) => {
        this.props.isActive(folder)
    };
    openFolder = (folderId)=>{
        this.props.getFolderEmails(folderId)
    };
    render() {
        return (
            <div className="col-2 mt-4">
                <ul className="list-group folders">
                    { this.props.folders.map((folder) =>
                      <Folder key = {folder._id} folder = { folder } folderToggler={this.folderToggler}  getEmails={this.props.getEmails} openFolder={this.openFolder} toggleUpdateModal={this.toggleUpdateModal} toggleDeleteModal={this.toggleDeleteModal} toggleCannotDeleteModal={this.toggleCannotDeleteModal} />
                    )}
                    <ModalNewFolder/>
                </ul>
                <ModalUpdateFolder isOpenUpdate={this.state.updateModal} toggleUpdateModal={this.toggleUpdateModal} updateFolder={this.updateFolder} updateFolderName={this.state.updateFolderName}/>
                <ModalDeleteFolder isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}  deleteFolder={this.deleteFolder} deleteFolderName={this.state.deleteFolderName}/>
                <ModalCannotDeleteFolder isOpenCannotDelete={this.state.cannotDeleteModal} toggleCannotDeleteModal={this.toggleCannotDeleteModal} cannotDeleteFolderName={this.state.cannotDeleteFolderName}/>
            </div>
        )
    }
}

function Folder (props) {

  const isActive = props.folder.isActive ? 'active-folder' : '';
  const icon = props.folder.icon;
  const isDeletable = props.folder.user_id;
  return (
    <li className={ "list-group-item list-group-item-action " +  isActive } onClick={()=>{
        props.folderToggler(props.folder);
        if(props.folder._id=='allEmails'){
            props.getEmails();
        }
        else{props.openFolder(props.folder._id);}
    }}>
        <i className={ "fa " + icon} aria-hidden="true"></i>
        &nbsp; {props.folder.name}
        &nbsp;({props.folder.count})
        <div className="d-inline float-right">
            {isDeletable ?
                <i className="fa fa-pencil-alt folder-actions" aria-hidden="true" data-id={props.folder._id} data-name={props.folder.name} onClick={props.toggleUpdateModal}></i>
                :
                ''
            }
            {isDeletable ?
                <i className="fa fa-trash folder-actions" aria-hidden="true" data-id={props.folder._id} data-name={props.folder.name} onClick={props.folder.count ? props.toggleCannotDeleteModal : props.toggleDeleteModal} ></i>
                :
                ''
            }
        </div>
    </li>
  )
}

function mapStateToProps(state) {
  return {
    folders: state.folders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFolder: (param) => dispatch(asyncDeleteFolder(param)),
    updateFolder: (param) => dispatch(asyncUpdateFolder(param)),
      isActive: (item) => dispatch(isActive(item)),
      getFolderEmails: (folderId) => dispatch(asyncGetFolderEmails(folderId)),
      getEmails: ()=>dispatch(asyncRefresh()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
