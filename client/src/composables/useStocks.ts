import { ref, computed } from 'vue';
import type { Stock, StockSummary } from '../types/stock';

// サンプルの株価データ
const sampleStocks: Stock[] = [
    {
        id: '1',
        code: '7203',
        name: 'トヨタ自動車',
        quantity: 100,
        purchasePrice: 2800,
        currentPrice: 2950,
    },
    {
        id: '2',
        code: '9984',
        name: 'ソフトバンクグループ',
        quantity: 50,
        purchasePrice: 8500,
        currentPrice: 8200,
    },
    {
        id: '3',
        code: '6758',
        name: 'ソニーグループ',
        quantity: 30,
        purchasePrice: 12000,
        currentPrice: 12800,
    }
];

export function useStocks() {
    const stocks = ref<Stock[]>([...sampleStocks]);

    const summary = computed<StockSummary>(() => {
        const totalValue = stocks.value.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
        const totalCost = stocks.value.reduce((sum, stock) => sum + (stock.purchasePrice * stock.quantity), 0);
        const totalGainLoss = totalValue - totalCost;
        const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

        return {
            totalValue,
            totalCost,
            totalGainLoss,
            totalGainLossPercent
        };
    });

    const addStock = (stock: Omit<Stock, 'id'>) => {
        const newStock: Stock = {
            ...stock,
            id: Date.now().toString()
        };
        stocks.value.push(newStock);
    };

    const updateStock = (id: string, updatedStock: Partial<Stock>) => {
        const index = stocks.value.findIndex(stock => stock.id === id);
        if (index !== -1) {
            stocks.value[index] = { ...stocks.value[index], ...updatedStock };
        }
    };

    const removeStock = (id: string) => {
        const index = stocks.value.findIndex(stock => stock.id === id);
        if (index !== -1) {
            stocks.value.splice(index, 1);
        }
    };

    const getStockById = (id: string) => {
        return stocks.value.find(stock => stock.id === id);
    };

    return {
        stocks,
        summary,
        addStock,
        updateStock,
        removeStock,
        getStockById
    };
}