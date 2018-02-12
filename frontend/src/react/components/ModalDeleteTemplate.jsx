import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';


export default class ModalDeleteTemplate extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleDeleteModal}>Delete Template</ModalHeader>
          <ModalBody>
            Are you sure you want to delete template <b>{this.props.deleteTemplateName}</b>?
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-danger" onClick={this.props.deleteTemplate}>Delete</Button>
            <Button color="secondary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
ModalDeleteTemplate.propTypes = {
  isOpenDelete: PropTypes.bool.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  deleteTemplateName: PropTypes.string,
};
ModalDeleteTemplate.defaultProps = {
  deleteTemplateName: '',
};
