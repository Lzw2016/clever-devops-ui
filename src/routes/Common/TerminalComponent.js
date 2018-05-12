import React, { PureComponent, Fragment } from 'react';
// import { Card } from 'antd';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
import styles from './TerminalComponent.less'

export default class TerminalComponent extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className={styles.terminal} id="terminal" style={{ height: 600 }} />
      </Fragment>
    );
  }
}
