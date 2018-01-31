import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalDeleteEmails extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleDeleteModal}>Delete {this.props.count} Emails</ModalHeader>
          <ModalBody>
            Are you sure you want to delete <b>{this.props.count}</b> emails?
          </ModalBody>
          <ModalFooter>
            <Button className={"btn btn-danger"} onClick={this.props.deleteEmail}>Delete</Button>
            <Button color="secondary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
