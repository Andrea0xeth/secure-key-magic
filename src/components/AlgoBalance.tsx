import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

interface AlgoBalanceProps {
  address: string;
}

// Define the full account info type based on the API response
interface AlgorandAccount {
  address: string;
  amount: number;
  "amount-without-pending-rewards": number;
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
        const accountInfo = (await algodClient.accountInformation(address).do()) as unknown as AlgorandAccount;
        console.log("Account info received:", accountInfo);
        
        // Ensure we have the amount-without-pending-rewards value
        if (typeof accountInfo["amount-without-pending-rewards"] !== 'number') {
          console.error("Invalid amount received:", accountInfo["amount-without-pending-rewards"]);
          return 0;
        }
        
        // Convert microAlgos to Algos (divide by 1,000,000)
        const algoBalance = accountInfo["amount-without-pending-rewards"] / 1_000_000;
        console.log("Calculated ALGO balance:", algoBalance);
        return algoBalance;
      } catch (error) {
        console.error("Error fetching account info:", error);
        return 0;
      }
    },
    refetchInterval: 10000, // Refresh every 10 seconds
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