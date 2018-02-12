import React from 'react';

import Statuses from './Statuses.jsx';
import Templates from './Templates.jsx';
import Signature from './Signature.jsx';

export default function Settings() {
  return (
    <div>
      <Route path="/settings/statuses" component={Statuses} />
      <Route path="/settings/templates" component={Templates} />
      <Route path="/settings/signature" component={Signature} />
    </div>
  );
}
