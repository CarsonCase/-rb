import type {MontlyData} from "./stockData";

export function generateRandomNormalDistribution(data: MontlyData): number {
    let u1 = 0;
    let u2 = 0;
  
    // Generate two random numbers between 0 and 1
    while (u1 === 0) u1 = Math.random(); // Converting [0,1) to (0,1)
    while (u2 === 0) u2 = Math.random();
  
    // Apply Box-Muller transform
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
    // Scale and shift the result to the desired mean and standard deviation
    return z0 * data.stdDev + data.mean;
}  