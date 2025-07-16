export interface Stock {
    id: string;
    code: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
}

export interface StockSummary {
    totalValue: number;
    totalCost: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
}