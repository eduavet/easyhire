import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ModalCannotDeleteFolder extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenCannotDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleCannotDeleteModal}>Cannot delete folder
          </ModalHeader>
          <ModalBody>
            Folder <b>{this.props.cannotDeleteFolderName}</b>&nbsp;
            contains emails so it cannot be deleted.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggleCannotDeleteModal}>Okay</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


ModalCannotDeleteFolder.propTypes = {
  isOpenCannotDelete: PropTypes.bool.isRequired,
  toggleCannotDeleteModal: PropTypes.func.isRequired,
  cannotDeleteFolderName: PropTypes.string,
};
