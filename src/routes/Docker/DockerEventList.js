import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './DockerEventList.less'

export default class DockerEventList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          DockerEventList
        </Card>
      </PageHeaderLayout>
    );
  }
}
