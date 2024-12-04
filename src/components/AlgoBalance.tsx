import { useQuery } from "@tanstack/react-query";
import algosdk from "algosdk";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Lock, ArrowRight } from "lucide-react";

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
        return accountInfo;
      } catch (error) {
        console.error("Error fetching account info:", error);
        return null;
      }
    },
    refetchInterval: 10000,
  });

  const formatBalance = (microAlgos: number) => {
    return (microAlgos / 1_000_000).toFixed(6);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <Card className="bg-gray-100 dark:bg-gray-800">
              <CardContent className="h-24" />
            </Card>
          </div>
        ))}
      </div>
    );
  }

  const totalBalance = accountInfo ? accountInfo["amount-without-pending-rewards"] : 0;
  const minBalance = accountInfo ? accountInfo["min-balance"] : 0;
  const availableBalance = totalBalance - minBalance;

  const balanceCards = [
    {
      title: "Total Balance",
      value: formatBalance(totalBalance),
      icon: Wallet,
      bgClass: "bg-artence-purple/10",
      iconClass: "text-artence-purple",
    },
    {
      title: "Minimum Balance",
      value: formatBalance(minBalance),
      icon: Lock,
      bgClass: "bg-warning/10",
      iconClass: "text-warning",
    },
    {
      title: "Available Balance",
      value: formatBalance(availableBalance),
      icon: ArrowRight,
      bgClass: "bg-success/10",
      iconClass: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {balanceCards.map((card, index) => (
        <Card 
          key={index}
          className={`transition-all duration-300 ${card.bgClass} border-none`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {card.title}
              </h3>
              <card.icon className={`h-5 w-5 ${card.iconClass}`} />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                {card.value}
              </span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                ALGO
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};