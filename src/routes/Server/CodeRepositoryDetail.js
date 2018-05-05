import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './CodeRepositoryDetail.less'

export default class CodeRepositoryDetail extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          CodeRepositoryDetail
        </Card>
      </PageHeaderLayout>
    );
  }
}
