import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { asyncCreateFolder } from '../../redux/reducers/emailsReducer';

class ModalNewFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      input: ''
    };
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  createFolder = (e) => {
    e.preventDefault();
    const body  = { folderName: this.refs.createFolder.value };
    this.setState({ modal: false });
    this.props.createFolder(body)
  };

  handleChange = (e) => {
    this.setState({input: e.target.value});
  }

  render() {
    return (
      <li className={ "list-group-item list-group-item-action " }>
        <a href="#" onClick={this.toggle}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
          &nbsp; New Folder
        </a>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create New Folder</ModalHeader>
          <ModalBody>
            <form action={"http://localhost:3000/api/folders"} method={"post"}>
              <div className="form-group">
                <label htmlFor="folderName">Folder Name</label>
                <input type="text" ref="createFolder" className="form-control" id="folderName" placeholder="Enter folder name" onChange={this.handleChange}/>
              </div>
              <hr className={"mt-4"}/>
              <div className="form-group">
                <Button color="secondary float-right" onClick={this.toggle}>Cancel</Button>
                <Button className="btn bg-light-blue float-right mr-2" onClick={this.createFolder} disabled={!this.state.input}>Create</Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </li>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    createFolder: (param) => dispatch(asyncCreateFolder(param))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalNewFolder);
