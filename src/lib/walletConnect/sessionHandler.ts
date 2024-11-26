import { toast } from "@/hooks/use-toast";
import SignClient from '@walletconnect/sign-client';
import type { SessionProposalEvent } from './types';

export async function handleSessionProposal(
  client: SignClient,
  proposal: SessionProposalEvent,
  address: string
): Promise<void> {
  console.log("Processing session proposal:", proposal);

  try {
    const { id, params } = proposal;
    
    const namespaces = {
      algorand: {
        accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${address}`],
        methods: ['algo_signTxn'],
        events: ['accountsChanged'],
        chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
      }
    };

    await client.approve({
      id,
      namespaces
    });

    toast({
      title: "Connected",
      description: "Successfully connected to dApp",
    });
  } catch (error) {
    console.error("Error in session proposal handling:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to establish connection with dApp",
      variant: "destructive",
    });
    throw error;
  }
}