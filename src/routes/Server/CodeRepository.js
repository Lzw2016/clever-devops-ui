import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './CodeRepository.less'

export default class CodeRepository extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          CodeRepository
        </Card>
      </PageHeaderLayout>
    );
  }
}
