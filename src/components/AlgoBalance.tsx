import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

interface AlgoBalanceProps {
  address: string;
}

interface AccountInfo {
  "amount-without-pending-rewards": number;
}

export const AlgoBalance = ({ address }: AlgoBalanceProps) => {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['algoBalance', address],
    queryFn: async () => {
      console.log("Fetching balance for address:", address);
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      const accountInfo = await algodClient.accountInformation(address).do() as AccountInfo;
      console.log("Account info received:", accountInfo);
      // Convert microAlgos to Algos (divide by 1,000,000)
      return Number(accountInfo["amount-without-pending-rewards"]) / 1_000_000;
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