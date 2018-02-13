import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ModalDeleteEmails extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleDeleteModal}>Delete {this.props.count} Email(s)
          </ModalHeader>
          <ModalBody>
            Are you sure you want to delete <b>{this.props.count}</b> email(s)?
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-danger" onClick={this.props.deleteEmail}>Delete</Button>
            <Button color="secondary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ModalDeleteEmails.propTypes = {
  isOpenDelete: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  deleteEmail: PropTypes.func.isRequired,
};
