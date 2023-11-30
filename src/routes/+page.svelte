<script lang="ts">
import {onMount} from "svelte"

import Chart from 'chart.js/auto'
import { browser } from '$app/environment';
import {calculateMonthlyStatistics} from "../lib/stockData";
import type {MontlyData} from "../lib/stockData";
import {generateRandomNormalDistribution} from "../lib/statistics";

let chartObj: Chart;
let startingCash: number = 10000;
let cashPerMonth: number = 100;
let numberOfMonths: number = 24;
let isRandom: boolean = false;
let total: number;
let assets: Asset[] = [];
let assetsLoaded: boolean = false;

type Asset = {
    symbol: string,
    name: string,
    data: MontlyData,
    portfolioWeight: number
}

function getData(){
    let labels: number[] = [];
    let data: number[] = [];

    data.push(startingCash);
    for (var i = 1; i < numberOfMonths; i++){
        labels.push(i);
        let lastVal = data[i-1];
        let thisMonthsCash = lastVal + cashPerMonth;
        assets.forEach(asset => {
            let priceChange=0;
            if(isRandom){
                priceChange = generateRandomNormalDistribution(asset.data);
            }else{
                priceChange = asset.data.mean;
            }
            thisMonthsCash += (lastVal * (asset.portfolioWeight/100) * priceChange)
        });
        data.push(thisMonthsCash);
    }
    labels.push(numberOfMonths);
    return({labels: labels, data: data, finalValue: data[data.length-1]});
}

function loadChart(){
    if(chartObj){
        chartObj.destroy();
    }
    if(browser && assetsLoaded){
        let {labels, data, finalValue} = getData();
        total = finalValue;
        
        chartObj = new Chart(
            document.getElementById('myChart') as any,
            {
        type: "line",
        data: {
            labels: labels,
            datasets: [
            {
                label: "Portfolio Value",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: data
            }
            ]
        },
        options: {
            scales:{
                x: {
                    title: {
                        display: true,
                        text: "Month"
                    }
                },
                y: {
                    title: {
                        display: false,
                        text: "Cash Value"
                    }
                }

            }
        }
        });
    }
}
$: startingCash, cashPerMonth, numberOfMonths, assets, isRandom, loadChart()

onMount(async()=>{
    
    assets.push({
        symbol: "SPY",
        name: "S&P500 Index Fund",
        data: await calculateMonthlyStatistics("SPY") as MontlyData | null,
        portfolioWeight: 0
    } as Asset
    );
    assets.push({
        symbol: "BTC-USD",
        name: "Bitcoin",
        data: await calculateMonthlyStatistics("BTC-USD") as MontlyData | null,
        portfolioWeight: 0
    } as Asset
    );
    assets.push({
        symbol: "MSFT",
        name: "Microsoft",
        data: await calculateMonthlyStatistics("MSFT") as MontlyData | null,
        portfolioWeight: 0

    } as Asset
    );
    assets.push({
        symbol: "CL=F",
        name: "Crude Oil",
        data: await calculateMonthlyStatistics("CL=F") as MontlyData | null,
        portfolioWeight: 0

    } as Asset
    );
    assets.push({
        symbol: "GC=F",
        name: "Gold",
        data: await calculateMonthlyStatistics("GC=F") as MontlyData | null,
        portfolioWeight: 0

    } as Asset
    );
    assets.push({
        symbol: "O",
        name: "Realty Income Corp.",
        data: await calculateMonthlyStatistics("O") as MontlyData | null,
        portfolioWeight: 0

    } as Asset
    );
    assetsLoaded = true;
    console.log(assets)
    loadChart();
})

function roundCash(num:number){
    return (Math.round((num + Number.EPSILON) * 100) / 100).toLocaleString();
}

function handleSliderChange(index: number, event: Event) {
    const newValue = (event.target as HTMLInputElement).valueAsNumber;
    
    // Calculate the total sum of all slider values excluding the current one
    const totalWithoutCurrent = assets.reduce((sum, asset, i) => (i !== index ? sum + asset.portfolioWeight : sum), 0);
    // Check if the new value, when added to the total sum, exceeds 100%
    if (newValue + totalWithoutCurrent <= 100) {
      assets[index].portfolioWeight = newValue;
    } else {
        assets[index].portfolioWeight = 100 - totalWithoutCurrent;
    }
  }
</script>


<div class="grid grid-cols-3 grid-rows-4 h-screen">
    <div class="bg-red-200 row-span-4">
        <div class="grid justify-items-center">
            <h1 class="p-10 text-6xl">Ürb Finance</h1>
        </div>
        <div class="p-10 grid gap-4">
            <div class="grid">
                <label for="starting">Starting Cash</label>
                <input bind:value={startingCash} type="number" name="starting" step=100>
            </div>

            <div class="grid">
                <label for="monthly">Cash added monthly</label>
                <input bind:value={cashPerMonth} type="number" name="montly" step=100>
            </div>

            <div class="grid">
                <label for="months">Number of Months</label>
                <input bind:value={numberOfMonths} type="number" name="months">
            </div>

            <div class="grid">
                <label for="isRandom">Use Random numbers based on asset mean/std</label>
                <input bind:checked={isRandom} type="checkbox" name="isRandom">
            </div>
                {#if assetsLoaded}
                    {#each assets as asset, index}
                        <div class="grid">
                            <div class="flex justify-between">
                                <label for={asset.symbol}>{asset.name}</label>
                                <p>{asset.portfolioWeight}%</p>
                            </div>
                            <input 
                                bind:value={asset.portfolioWeight}
                                type="range" 
                                name={asset.symbol} 
                                min=0 
                                max={100}
                                on:input={(event) => handleSliderChange(index, event)}
                            >
                        </div>
                    {/each}
                {/if}

            <h1 class="text-4xl">Total Value: ${roundCash(total)}</h1>
        </div>
    </div>
    <div class="row-span-4 col-span-2 flex items-center">
        <canvas class="w-max h-1/2" id="myChart">
        </canvas>
    </div>
</div>