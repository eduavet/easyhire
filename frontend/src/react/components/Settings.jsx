import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Templates from './Templates.jsx';

export default function Settings() {
  return (
    <div>
      <Route exact path="/settings/templates" component={Templates} />
    </div>
  );
}