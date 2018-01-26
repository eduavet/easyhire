import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

    }
    toggle=()=> {
        this.setState({modal: !this.state.modal});
    }
    continue=()=>{
    }
    render() {
        return (
            <div>
                <Button color="link" onClick={this.toggle}><i className="fas fa-sign-out-alt logoutbtn"></i></Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Logout</ModalHeader>
                    <ModalBody>
                        Are you sure you want to log out?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.continue}>I'm sure!</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>)
    }
}