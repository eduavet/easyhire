import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ModalDeleteStatus extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleDeleteModal}>Delete Status</ModalHeader>
          <ModalBody>
            Are you sure you want to delete status <b>{this.props.deleteStatusName}</b>?
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-danger" onClick={this.props.deleteStatus}>Delete</Button>
            <Button color="secondary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ModalDeleteStatus.propTypes = {
  isOpenDelete: PropTypes.bool.isRequired,
  deleteStatusName: PropTypes.string.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  deleteStatus: PropTypes.func.isRequired,
};
