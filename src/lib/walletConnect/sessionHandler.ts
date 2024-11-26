import SignClient from '@walletconnect/sign-client';
import type { SessionProposalEvent } from './types';

export async function handleSessionProposal(
  client: SignClient,
  proposal: SessionProposalEvent,
  address: string
): Promise<void> {
  try {
    const { id, params } = proposal;

    await client.approve({
      id,
      namespaces: {
        algorand: {
          accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
          methods: ['algo_signTxn'],
          events: ['accountsChanged'],
          chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
        }
      }
    });

    console.log("Session proposal approved successfully");
  } catch (error) {
    console.error("Error handling session proposal:", error);
    throw error;
  }
}