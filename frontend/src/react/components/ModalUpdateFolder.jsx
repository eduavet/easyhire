import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ModalUpdateFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: true,
    };
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenUpdate} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleUpdateModal}>Update folder name</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="folderName">Folder Name</label>
              <input type="text" className="form-control" id="folderName" placeholder="Enter folder name" ref="inputField" defaultValue={this.props.updateFolderName} onChange={this.handleChange} />
            </div>
            <hr className="mt-4" />
            <div className="form-group">
              <Button color="secondary float-right" onClick={this.props.toggleUpdateModal}>Cancel</Button>
              <Button className="btn bg-light-blue float-right mr-2" onClick={() => this.props.updateFolder(this.refs.inputField)} disabled={!this.state.input}>Update</Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ModalUpdateFolder.propTypes = {
  isOpenUpdate: PropTypes.bool.isRequired,
  updateFolderName: PropTypes.string.isRequired,
  toggleUpdateModal: PropTypes.func.isRequired,
  updateFolder: PropTypes.func.isRequired,
};
