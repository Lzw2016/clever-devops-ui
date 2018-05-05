import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ServerListDetail.less'

export default class ServerListDetail extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ServerListDetail
        </Card>
      </PageHeaderLayout>
    );
  }
}
