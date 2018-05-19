import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './SwarmInfo.less'

export default class SwarmInfo extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          SwarmInfo
        </Card>
      </PageHeaderLayout>
    );
  }
}
