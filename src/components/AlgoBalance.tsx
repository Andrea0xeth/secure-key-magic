import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

interface AlgoBalanceProps {
  address: string;
}

interface AlgorandAccount {
  address: string;
  amount: number;
  "amount-without-pending-rewards": number;
  "min-balance": number;
  "pending-rewards": number;
  "reward-base": number;
  rewards: number;
  round: number;
  status: string;
}

export const AlgoBalance = ({ address }: AlgoBalanceProps) => {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['algoBalance', address],
    queryFn: async () => {
      console.log("Fetching balance for address:", address);
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      
      try {
        const accountInfo = await algodClient.accountInformation(address).do() as AlgorandAccount;
        console.log("Account info received:", accountInfo);
        
        // Check if amount-without-pending-rewards exists and is a valid number
        if (typeof accountInfo["amount-without-pending-rewards"] === 'undefined' || accountInfo["amount-without-pending-rewards"] === null) {
          console.error("Invalid amount-without-pending-rewards in account info:", accountInfo);
          return 0;
        }
        
        // Convert microAlgos to Algos
        const algoBalance = Number(accountInfo["amount-without-pending-rewards"]) / 1_000_000;
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
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded transition-colors duration-300" />;
  }

  return (
    <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors duration-300">
      <span className="font-medium dark:text-white">{balance?.toFixed(6) || '0.000000'}</span>
      <span className="text-sm text-gray-600 dark:text-gray-300">ALGO</span>
    </div>
  );
};