import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ContainerList.less'

export default class ContainerList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ContainerList
        </Card>
      </PageHeaderLayout>
    );
  }
}
