import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Templates from './Templates.jsx';
import Statuses from './Statuses.jsx';
import Signature from './Signature.jsx';

export default function Settings() {
  return (
    <div>
      <Route exact path="/settings/templates" component={Templates} />
      <Route path="/settings/statuses" component={Statuses} />
      <Route path="/settings/signature" component={Signature} />
    </div>
  );
}