import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";

interface AlgoBalanceProps {
  address: string;
}

export const AlgoBalance = ({ address }: AlgoBalanceProps) => {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['algoBalance', address],
    queryFn: async () => {
      const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
      const accountInfo = await algodClient.accountInformation(address).do();
      // Convert bigint to number before division
      return Number(accountInfo.amount) / 1000000; // Convert microAlgos to Algos
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-6 w-24 rounded" />;
  }

  return (
    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
      <span className="font-medium">{balance?.toFixed(2)}</span>
      <span className="text-sm text-muted-foreground">ALGO</span>
    </div>
  );
};