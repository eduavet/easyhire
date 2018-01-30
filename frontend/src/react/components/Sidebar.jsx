import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ModalNewFolder from './ModalNewFolder.jsx'
import ModalUpdateFolder from './ModalUpdateFolder.jsx'
import ModalDeleteFolder from './ModalDeleteFolder.jsx'

export default function Sidebar(props) {
  return (
    <div className="col-2 mt-4">
      <ul className="list-group folders">
        { props.folders.map((folder, i) => <Folder key = {i} folder = { folder } />)}
        <ModalNewFolder/>
      </ul>
    </div>
  )
}

function Folder (props) {
  const isActive = props.folder.isActive ? 'active-folder' : '';
  const icon = props.folder.icon;
  return (
    <li className={ "list-group-item list-group-item-action " +  isActive }>
      <a href="#" >
        <i className={ "fa " + icon} aria-hidden="true"></i>
        &nbsp; {props.folder.name}
        &nbsp;({props.folder.count})
      </a>
      <ModalDeleteFolder name={props.folder.name}/>
      <ModalUpdateFolder />
    </li>
  )
}
