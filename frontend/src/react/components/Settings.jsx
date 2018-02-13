import React from 'react';
import { Route } from 'react-router-dom';
import Templates from './Templates.jsx';
import Statuses from './Statuses.jsx';

export default function Settings() {
  return (
    <div className="container-fluid mt-4">
      <Route exact path="/settings/templates" component={Templates} />
      <Route path="/settings/statuses" component={Statuses} />
    </div>
  );
}
