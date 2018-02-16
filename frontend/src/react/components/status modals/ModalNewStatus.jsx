import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { asyncCreateStatus } from '../../../redux/reducers/statusReducer';

class ModalNewStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      input: '',
    };
  }
  // Toggle new status modal
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  // Dispatch create status action, display success message
  createStatus = (e) => {
    e.preventDefault();
    const newStatus = { statusName: this.refs.createStatus.value };
    this.setState({ modal: false, input: '' });
    this.props.createStatus(newStatus);
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    return (
      <li className="list-group-item list-group-item-action " onClick={this.toggle}>
        <i className="fa fa-plus-circle" aria-hidden="true" />
          &nbsp; New Status
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create New Status</ModalHeader>
          <ModalBody>
            <form onSubmit={this.createStatus}>
              <div className="form-group">
                <label htmlFor="statusName">Status Name</label>
                <input
                  type="text"
                  ref="createStatus"
                  className="form-control"
                  id="statusName"
                  placeholder="Enter status name"
                  onChange={this.handleChange}
                />
              </div>
              <hr className="mt-4" />
              <div className="form-group">
                <Button color="secondary float-right" onClick={this.toggle}>Cancel</Button>
                <Button
                  className="btn bg-light-blue float-right mr-2"
                  onClick={this.createStatus}
                  disabled={!this.state.input}
                >
                  Create
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </li>
    );
  }
}

ModalNewStatus.propTypes = {
  createStatus: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createStatus: newStatus => dispatch(asyncCreateStatus(newStatus)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalNewStatus);
