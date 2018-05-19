import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ImageList.less'

export default class ImageList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ImageList
        </Card>
      </PageHeaderLayout>
    );
  }
}
