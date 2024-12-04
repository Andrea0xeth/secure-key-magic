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
  const { data: accountInfo, isLoading } = useQuery({
    queryKey: ['algoBalance', address],
    queryFn: async () => {
      console.log("Fetching balance for address:", address);
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      
      try {
        const accountInfo = await algodClient.accountInformation(address).do() as AlgorandAccount;
        console.log("Account info received:", accountInfo);
        
        return {
          totalBalance: Number(accountInfo["amount-without-pending-rewards"]) / 1_000_000,
          minBalance: Number(accountInfo["min-balance"]) / 1_000_000,
          availableBalance: (Number(accountInfo["amount-without-pending-rewards"]) - Number(accountInfo["min-balance"])) / 1_000_000
        };
      } catch (error) {
        console.error("Error fetching account info:", error);
        return {
          totalBalance: 0,
          minBalance: 0,
          availableBalance: 0
        };
      }
    },
    refetchInterval: 10000,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 w-full rounded transition-colors duration-300" />;
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors duration-300">
        <span className="text-sm text-gray-600 dark:text-gray-300">Total Balance:</span>
        <div className="flex items-center space-x-2">
          <span className="font-medium dark:text-white">{accountInfo?.totalBalance.toFixed(6) || '0.000000'}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">ALGO</span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors duration-300">
        <span className="text-sm text-gray-600 dark:text-gray-300">Minimum Balance:</span>
        <div className="flex items-center space-x-2">
          <span className="font-medium dark:text-white">{accountInfo?.minBalance.toFixed(6) || '0.000000'}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">ALGO</span>
        </div>
      </div>

      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg transition-colors duration-300">
        <span className="text-sm text-gray-600 dark:text-gray-300">Available Balance:</span>
        <div className="flex items-center space-x-2">
          <span className="font-medium dark:text-white">{accountInfo?.availableBalance.toFixed(6) || '0.000000'}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">ALGO</span>
        </div>
      </div>
    </div>
  );
};