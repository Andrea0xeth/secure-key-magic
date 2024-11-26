import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

interface AlgoBalanceProps {
  address: string;
}

interface AlgorandAccount {
  address: string;
  amount: bigint;
  amountWithoutPendingRewards: bigint;
  minBalance: bigint;
  pendingRewards: bigint;
  rewardBase: bigint;
  rewards: bigint;
  round: bigint;
  status: string;
}

export const AlgoBalance = ({ address }: AlgoBalanceProps) => {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['algoBalance', address],
    queryFn: async () => {
      console.log("Fetching balance for address:", address);
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      
      try {
        const accountInfo = (await algodClient.accountInformation(address).do()) as unknown as AlgorandAccount;
        console.log("Account info received:", accountInfo);
        
        if (typeof accountInfo.amountWithoutPendingRewards === 'undefined') {
          console.error("Invalid amount received:", accountInfo.amountWithoutPendingRewards);
          return 0;
        }
        
        const algoBalance = Number(accountInfo.amountWithoutPendingRewards) / 1_000_000;
        console.log("Calculated ALGO balance:", algoBalance);
        return algoBalance;
      } catch (error) {
        console.error("Error fetching account info:", error);
        return 0;
      }
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />;
  }

  return (
    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
      <span className="font-medium">{balance?.toFixed(6)}</span>
      <span className="text-sm text-muted-foreground">ALGO</span>
    </div>
  );
};