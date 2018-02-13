import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ModalUpdateStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputNotEmpty: true,
    };
  }
  // Keep track of input field and disable update button if it's empty
  handleChange = (e) => {
    this.setState({ inputNotEmpty: e.target.value });
  };

  render() {
    return (
      <div className="d-inline">
        <Modal isOpen={this.props.isOpenUpdate} toggle={this.toggle}>
          <ModalHeader toggle={this.props.toggleUpdateModal}>Update status name</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="statusName">Status Name</label>
              <input
                type="text"
                className="form-control"
                id="statusName"
                placeholder="Enter status name"
                ref="inputField"
                defaultValue={this.props.updateStatusName}
                onChange={this.handleChange}
              />
            </div>
            <hr className="mt-4" />
            <div className="form-group">
              <Button
                color="secondary float-right"
                onClick={this.props.toggleUpdateModal}>
                Cancel
              </Button>
              <Button
                className="btn bg-light-blue float-right mr-2"
                onClick={() => this.props.updateStatus(this.refs.inputField)}
                disabled={!this.state.inputNotEmpty}>
                Update
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ModalUpdateStatus.propTypes = {
  isOpenUpdate: PropTypes.bool.isRequired,
  updateStatusName: PropTypes.string,
  toggleUpdateModal: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired,
};
