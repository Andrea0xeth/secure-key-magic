import { toast } from "@/hooks/use-toast";
import SignClient from '@walletconnect/sign-client';
import type { SignClientTypes } from '@walletconnect/types';
import type { TransactionCallback } from './types';

export async function handleSessionProposal(
  client: SignClient,
  proposal: SignClientTypes.EventArguments['session_proposal'],
  transactionCallback: TransactionCallback | null
) {
  console.log("Processing session proposal:", proposal);

  try {
    const { id, params } = proposal;

    const namespaces = {
      algorand: {
        accounts: [`algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k:${params.proposer.metadata?.url || ''}`],
        methods: ['algo_signTxn'],
        events: ['accountsChanged'],
        chains: ['algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k']
      }
    };

    console.log("Approving session with namespaces:", namespaces);
    
    await client.approve({
      id,
      namespaces
    });

    toast({
      title: "Connected",
      description: "Successfully connected to dApp",
    });

    return true;
  } catch (error) {
    console.error("Error in session proposal handling:", error);
    toast({
      title: "Connection Failed",
      description: "Failed to establish connection with dApp",
      variant: "destructive",
    });
    return false;
  }
}