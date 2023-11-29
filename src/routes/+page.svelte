<script lang="ts">
import {onMount} from "svelte"

import Chart from 'chart.js/auto'
import { browser } from '$app/environment';

let chartObj: Chart;
let startingCash: number = 10000;
let cashPerMonth: number = 100;
let numberOfMonths: number = 24;
let interestRate: number = 0.07;
let total: number;

function getData(){
    let labels: number[] = [];
    let data: number[] = [];

    data.push(startingCash);
    for (var i = 1; i < numberOfMonths; i++){
        labels.push(i);
        let lastVal = data[i-1];
        data.push(lastVal + lastVal * interestRate + cashPerMonth);
    }
    labels.push(numberOfMonths);
    return({labels: labels, data: data, finalValue: data[data.length-1]});
}

function loadChart(){
    if(chartObj){
        chartObj.destroy();
    }
    if(browser){
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
$: startingCash, cashPerMonth, numberOfMonths, interestRate, loadChart()


onMount(async()=>{
    loadChart();
})

function roundCash(num:number){
    return (Math.round((num + Number.EPSILON) * 100) / 100).toLocaleString();
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
                <label for="interest">Interest Rate %</label>
                <input bind:value={interestRate} type="number" name="interest" min="0" max="1" step=0.01>
            </div>

            <h1 class="text-4xl">Total Value: ${roundCash(total)}</h1>
        </div>
    </div>
    <div class="row-span-4 col-span-2 flex items-center">
        <canvas class="w-max h-1/2" id="myChart">
        </canvas>
    </div>
</div>