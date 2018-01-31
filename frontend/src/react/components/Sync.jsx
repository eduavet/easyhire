import React, { Component } from 'react';

export default function Sidebar(props) {
    return (
      <div className="col-2">
          <button className="btn sync-btn"><i className="fa fa-sync-alt"></i> Refresh</button>
      </div>
    )
}
