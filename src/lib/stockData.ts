import axios from 'axios';

interface MonthlyPriceData {
  date: string; // Format: "YYYY-MM"
  price: number;
}

export interface MontlyData {
  mean: number,
  stdDev: number
}

async function fetchMonthlyPriceData(symbol: string): Promise<MonthlyPriceData[] | null> {
  const respoonse = await axios.get("http://127.0.0.1:1234/stock-data?ticker="+symbol)
  return respoonse.data;
}

export async function calculateMonthlyStatistics(symbol: string): Promise<MontlyData | null> {
  const monthlyPriceData = await fetchMonthlyPriceData(symbol);

  if (monthlyPriceData === null || monthlyPriceData.length === 0) {
    console.error('Invalid or empty data');
    return null;
  }
  if(symbol == "BTC-USD"){
    console.log(monthlyPriceData)
  }  // The rest of the calculation remains the same as in the previous example

  const priceChanges: number[] = [];
  // Calculate monthly price changes
  for (let i = 1; i < monthlyPriceData.length; i++) {
    const currentPrice = monthlyPriceData[i].price;
    const previousPrice = monthlyPriceData[i - 1].price;
    const priceChange = (currentPrice - previousPrice) / previousPrice;
    if(priceChange != null){
      priceChanges.push(priceChange);
    }
    else{
      priceChanges.push(0)
    }
  }
  const mean = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  const squaredDifferences = priceChanges.map(change => Math.pow(change - mean, 2));
  const variance = squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / priceChanges.length;
  const stdDev = Math.sqrt(variance);

  return { mean, stdDev };
}
