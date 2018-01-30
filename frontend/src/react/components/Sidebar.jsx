import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';



export default function Sidebar(props) {
    return (
        <div className="col-2 mt-4">
            <ul className="list-group folders">
                { props.folders.map((folder, i) => <Folder key = {folder.id} folder = { folder } />)}
                <NewFolderModal createFolder={props.createFolder} inputFolderNameRef={ props.inputFolderNameRef} />
            </ul>
        </div>
    )
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
            <DeleteFolderModal name={props.folder.name}/>
            <EditFolderModal />
        </li>
    )
}

class NewFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

    }
    toggle=()=> {
        this.setState({ modal: !this.state.modal });
    };
    continue=(evt)=>{
        evt.preventDefault();
        this.props.createFolder(evt);
        this.setState({ modal: false });
    };
    render() {
        return (
            <li className={ "list-group-item list-group-item-action " }>
                <a href="#" onClick={this.toggle}>
                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    &nbsp; New Folder
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} id={"mod"}>
                    <ModalHeader toggle={this.toggle}>Create New Folder</ModalHeader>
                    <ModalBody>
                        <form action={"http://localhost:3000/api/folders"} method={"post"}>
                            <div className="form-group">
                                <label htmlFor="folderName">Folder Name</label>
                                <input type="text" ref={ this.props.inputFolderNameRef} className="form-control" id="folderName"  placeholder="Enter folder name" />
                            </div>
                            <hr className={"mt-4"}/>
                            <div className="form-group">
                                <Button color="secondary float-right" onClick={this.toggle}>Cancel</Button>
                                <button className="btn bg-light-blue float-right mr-2" onClick={this.continue}>Save!</button>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            </li>
        )
    }
}
class EditFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }
    toggle=()=> {
        this.setState({modal: !this.state.modal});
    };
    continue=()=>{
    };
    render() {
        return (
            <div className="d-inline">
                <i className="fa fa-pencil-alt float-right folder-actions" aria-hidden="true" onClick={this.toggle}></i>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit folder name</ModalHeader>
                    <ModalBody>
                        <form>
                            <div className="form-group">
                                <label htmlFor="folderName">Folder Name</label>
                                <input type="text" className="form-control" id="folderName"  placeholder="Enter folder name" value=""/>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-light-blue" onClick={this.continue}>Save</button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>)
    }
}
class DeleteFolderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

    }
    toggle=()=> {
        this.setState({modal: !this.state.modal});
    };
    continue=()=>{
    };
    render() {
        return (
            <div className="d-inline">
                <i className="fa fa-trash float-right folder-actions" aria-hidden="true" onClick={this.toggle}></i>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Delete Folder</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this folder?{this.props.name}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn bg-light-blue" onClick={this.continue}>I'm sure!</button>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>)
    }
}
