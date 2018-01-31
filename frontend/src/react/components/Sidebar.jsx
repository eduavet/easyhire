import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ModalNewFolder from './ModalNewFolder.jsx'
import ModalUpdateFolder from './ModalUpdateFolder.jsx'
import ModalDeleteFolder from './ModalDeleteFolder.jsx'
import { asyncDeleteFolder, asyncUpdateFolder } from '../../redux/reducers/emailsReducer';

const deleteId = { value: ''};
const updateId = { value: ''};

class Sidebar extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            updateModal: false,
            deleteModal: false,
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
    updateFolder = (folderName) => {
      this.props.updateFolder({id: updateId.value, folderName: folderName.value});
      this.setState({updateModal: false, updateFolderName: ''});
    };
    deleteFolder = () => {
      this.props.deleteFolder(deleteId.value);
      this.setState({deleteModal: false, deleteFolderName: ''});
    };
    render() {
        return (
            <div className="col-2 mt-4">
                <ul className="list-group folders">
                    { this.props.folders.map((folder, i) => <Folder key = {folder._id} folder = { folder } toggleUpdateModal={this.toggleUpdateModal} toggleDeleteModal={this.toggleDeleteModal} />)}
                    <ModalNewFolder createFolder={this.props.createFolder} updateFolder={this.updateFolder}/>
                </ul>
                <ModalUpdateFolder isOpenUpdate={this.state.updateModal} toggleUpdateModal={this.toggleUpdateModal} updateFolder={this.updateFolder} updateFolderName={this.state.updateFolderName}/>
                <ModalDeleteFolder isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}  deleteFolder={this.deleteFolder} deleteFolderName={this.state.deleteFolderName}/>
            </div>
        )
    }

}

function Folder (props) {
  const isActive = props.folder.isActive ? 'active-folder' : '';
  const icon = props.folder.icon;
  return (
    <li className={ "list-group-item list-group-item-action " +  isActive } onClick={() => alert("opens folder")}>
        <i className={ "fa " + icon} aria-hidden="true"></i>
        &nbsp; {props.folder.name}
        &nbsp;({props.folder.count})
        <div>
          <i className="fa fa-trash float-right folder-actions" aria-hidden="true" data-id={props.folder._id} data-name={props.folder.name} onClick={props.toggleDeleteModal} ></i>
          <i className="fa fa-pencil-alt float-right folder-actions" aria-hidden="true" data-id={props.folder._id} data-name={props.folder.name} onClick={props.toggleUpdateModal}></i>
        </div>
    </li>
  )

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFolder: (param) => dispatch(asyncDeleteFolder(param)),
    updateFolder: (param) => dispatch(asyncUpdateFolder(param))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
