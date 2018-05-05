import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './index.less'

export default class Dashboard extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          Dashboard
        </Card>
      </PageHeaderLayout>
    );
  }
}
