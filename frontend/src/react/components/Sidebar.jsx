import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ModalNewFolder from './ModalNewFolder.jsx'
import ModalUpdateFolder from './ModalUpdateFolder.jsx'
import ModalDeleteFolder from './ModalDeleteFolder.jsx'
import { asyncDeleteFolder } from '../../redux/reducers/emailsReducer';

const deleteId = { value: ''};
class Sidebar extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            editModal: false,
            deleteModal: false,
        }
    }
    toggleUpdateModal = () => {
        console.log('toggleUpdateModal')
        this.setState({editModal: !this.state.editModal});
    };
    toggleDeleteModal = (evt) => {
        deleteId.value = evt.target.dataset ? evt.target.dataset.id : '';
        this.setState({ deleteModal: !this.state.deleteModal });
    };
    updateFolder = (evt) => {
        evt.preventDefault();
        console.log('updateFolder')
        this.setState({editModal: false});
    };
    deleteFolder = () => {
        this.props.deleteFolder(deleteId.value);
        this.setState({deleteModal: false});
    };
    render() {
        return (
            <div className="col-2 mt-4">
                <ul className="list-group folders">
                    { this.props.folders.map((folder, i) => <Folder key = {folder.id} folder = { folder } toggleUpdateModal={this.toggleUpdateModal} toggleDeleteModal={this.toggleDeleteModal} />)}
                    <ModalNewFolder createFolder={this.props.createFolder} inputFolderNameRef={ this.props.inputFolderNameRef} updateFolder={this.updateFolder}/>
                </ul>
                <ModalUpdateFolder isOpenUpdate={this.state.editModal} toggleUpdateModal={this.toggleUpdateModal} updateFolder={this.updateFolder} />
                <ModalDeleteFolder isOpenDelete={this.state.deleteModal} toggleDeleteModal={this.toggleDeleteModal}  deleteFolder={this.deleteFolder}/>
            </div>
        )
    }

}

function Folder (props) {
  const isActive = props.folder.isActive ? 'active-folder' : '';
  const icon = props.folder.icon;
  return (
    <li className={ "list-group-item list-group-item-action " +  isActive }>
      <a href="#" >
        <i className={ "fa " + icon} aria-hidden="true"></i>
        &nbsp; {props.folder.name}
        &nbsp;({props.folder.count})
      </a>
        <i className="fa fa-trash float-right folder-actions" data-id={props.folder.id} aria-hidden="true" onClick={props.toggleDeleteModal}></i>
        <i className="fa fa-pencil-alt float-right folder-actions" aria-hidden="true" onClick={props.toggleUpdateModal}></i>
    </li>
  )

}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    deleteFolder: (param) => dispatch(asyncDeleteFolder(param))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
