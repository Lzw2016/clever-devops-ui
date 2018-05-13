import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ServerLog.less'

export default class ServerLog extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ServerLog
        </Card>
      </PageHeaderLayout>
    );
  }
}
