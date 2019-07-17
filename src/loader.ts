import { IOption } from './index';
import helpers from './helpers';

export default function loader(source: string) {
  const opts: IOption = {
    // default opts
    wrapper: 'section',
    anchor: ['h1', 'h2', 'h3'],
  };

  if (this) {
    if (typeof this.cacheable === 'function') {
      this.cacheable();
    }

    Object.assign(opts, require('loader-utils').getOptions(this));
  }

  const { anchor, wrapper, className, style, ...options } = opts;
  const rawHtml = helpers(source, {
    markdown: options,
    anchor,
    wrapper,
    className,
    style,
  });

  const component = `import React from 'react';
  export default function() {
    return (${rawHtml});
  }`;

  return require('@babel/core').transformSync(component, {
    plugins: ['@babel/plugin-transform-react-jsx'],
    babelrc: false,
    configFile: false,
  }).code;
}
