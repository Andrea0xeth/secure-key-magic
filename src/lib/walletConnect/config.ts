export const WALLET_CONNECT_CONFIG = {
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: 'Algorand Passkeys',
    description: 'Secure Algorand authentication using passkeys',
    url: window.location.host,
    icons: ['https://algorand.com/favicon.ico']
  },
  relayUrl: 'wss://relay.walletconnect.com',
  logger: 'error'
};