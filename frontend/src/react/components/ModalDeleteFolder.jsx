import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { asyncDeleteFolder } from '../../redux/reducers/emailsReducer';

export default class ModalDeleteFolder extends Component {
  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenDelete} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleDeleteModal}>Delete Folder</ModalHeader>
          <ModalBody>
            Are you sure you want to delete folder <b>{this.props.deleteFolderName}</b>?
          </ModalBody>
          <ModalFooter>
            <button className={"btn btn-danger"} onClick={this.props.deleteFolder}>Delete</button>
            <Button color="secondary" onClick={this.props.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

// function mapStateToProps(state) {
//   return {};
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     // deleteFolder: (param) => dispatch(asyncDeleteFolder(param))
//   };
// }
//
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ModalDeleteFolder);
