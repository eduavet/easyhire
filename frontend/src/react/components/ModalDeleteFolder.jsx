import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { asyncCreateFolder } from '../../redux/reducers/emailsReducer';

class ModalDeleteFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }

  toggle = () => {
    this.setState({modal: !this.state.modal});
  };

  delete = () => {
  };

  render() {
    return (
      <div className="d-inline">
        <i className="fa fa-trash float-right folder-actions" aria-hidden="true" onClick={this.toggle}></i>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Delete Folder</ModalHeader>
          <ModalBody>
            Are you sure you want to delete folder <b>{this.props.name}</b> ?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.delete}>Delete</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
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
)(ModalDeleteFolder);
