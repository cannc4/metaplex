import {
  AccountsProvider,
  ConnectionProvider,
  StoreProvider,
  WalletProvider,
  MetaProvider,
} from '@oyster/common';
import { Provider } from 'mobx-react';
import React, { FC } from 'react';
import { ConfettiProvider } from './components/Confetti';
import { AppLayout } from './components/Layout';
import { LoaderProvider } from './components/Loader';
import { CoingeckoProvider } from './contexts/coingecko';
import { SPLTokenListProvider } from './contexts/tokenList';
import { useTreeState } from './stores/Root';

export const Providers: FC = ({ children }) => {
  const stores = useTreeState()
  return (
    <Provider store={stores}>
      <ConnectionProvider>
        <WalletProvider>
          <AccountsProvider>
            <SPLTokenListProvider>
              <CoingeckoProvider>
                <StoreProvider
                  ownerAddress={process.env.NEXT_PUBLIC_STORE_OWNER_ADDRESS}
                  storeAddress={process.env.NEXT_PUBLIC_STORE_ADDRESS}
                >
                  <MetaProvider>
                    <LoaderProvider>
                      <ConfettiProvider>
                        <AppLayout>{children}</AppLayout>
                      </ConfettiProvider>
                    </LoaderProvider>
                  </MetaProvider>
                </StoreProvider>
              </CoingeckoProvider>
            </SPLTokenListProvider>
          </AccountsProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Provider>
  );
};
