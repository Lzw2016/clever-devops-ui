import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './NetworkList.less'

export default class NetworkList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          NetworkList
        </Card>
      </PageHeaderLayout>
    );
  }
}
