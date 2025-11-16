import React from 'react';
const ReactMarkdown = ({ children, ...rest }) => (
  <div data-testid="MockReactMarkdown" {...rest}>
    {children}
  </div>
);

export default ReactMarkdown;
