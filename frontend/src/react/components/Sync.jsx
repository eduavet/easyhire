import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default function Sidebar(props) {
    return <div className="col-2">
        <button className="btn sync-btn"><i className="fa fa-sync-alt"></i> Refresh</button>
    </div>
}
