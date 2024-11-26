import { Core } from '@walletconnect/core';

export const WALLET_CONNECT_CONFIG = {
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: 'Algorand Passkeys',
    description: 'Secure Algorand authentication using passkeys',
    url: window.location.host,
    icons: ['https://algorand.com/favicon.ico']
  },
  core: new Core({
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    relayUrl: 'wss://relay.walletconnect.org',
    name: 'Algorand Passkeys',
    logger: 'error'
  })
};