import { Layout } from 'antd';
import React  from 'react';
import { useStore } from '@oyster/common';
import { useMeta } from '../../contexts';
import { SalesListView } from './components/SalesList';
import { SetupView } from './setup';

export const HomeView = () => {
  const { isLoading, store } = useMeta();
  const { isConfigured } = useStore();

  const showAuctions = (store !== null && isConfigured) || !isLoading

  return (
    <Layout style={{ margin: 0, marginTop: 30, alignItems: 'center' }}>
      {showAuctions ? <SalesListView /> : <SetupView />}

    </Layout>
  );
};
