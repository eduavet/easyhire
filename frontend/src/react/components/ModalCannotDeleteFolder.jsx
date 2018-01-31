import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class ModalCannotDeleteFolder extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenCannotDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleCannotDeleteModal}>Cannot delete folder</ModalHeader>
          <ModalBody>
            Folder <b>{this.props.cannotDeleteFolderName}</b> contains emails so it cannot be deleted.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggleCannotDeleteModal}>Okay</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
