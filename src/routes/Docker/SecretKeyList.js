import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './SecretKeyList.less'

export default class SecretKeyList extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          SecretKeyList
        </Card>
      </PageHeaderLayout>
    );
  }
}
