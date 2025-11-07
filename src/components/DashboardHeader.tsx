import { Wallet, Plus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  walletBalance: number;
  onCreateClick: () => void;
  onRequestFunds: () => void;
  createButtonLabel: string;
}

const DashboardHeader = ({
  title,
  walletBalance,
  onCreateClick,
  onRequestFunds,
  createButtonLabel,
}: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left - Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-heading font-bold text-gradient">
                PayBazaar
              </h1>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
          </div>

          {/* Center - Action Button */}
          <div className="flex items-center gap-3 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <Button
              onClick={onCreateClick}
              className="flex-1 lg:flex-none gradient-primary hover:opacity-90 transition-opacity shadow-md"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createButtonLabel}
            </Button>
          </div>

          {/* Right - Wallet & Request Funds */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onRequestFunds}
              variant="outline"
              size="lg"
              className="flex-1 lg:flex-none border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Request Funds
            </Button>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wallet-bg border-2 border-wallet-border shadow-sm">
              <Wallet className="w-5 h-5 text-wallet-text" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-medium">Balance</div>
                <div className="text-lg font-heading font-bold text-wallet-text">
                  ₹{walletBalance.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
