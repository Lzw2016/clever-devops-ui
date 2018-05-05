import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ImageConfigDetail.less'

export default class ImageConfigDetail extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ImageConfigDetail
        </Card>
      </PageHeaderLayout>
    );
  }
}
