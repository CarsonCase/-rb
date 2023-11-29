<script lang="ts">
import {onMount} from "svelte"

import Chart from 'chart.js/auto'
import { browser } from '$app/environment';

let chartObj: Chart;
let startingCash: number;
let cashPerMonth: number;
let numberOfMonths: number;

function getData(){
    let labels: number[] = [];
    let data: number[] = [];

    data.push(startingCash);
    for (var i = 1; i < numberOfMonths; i++){
        labels.push(i);
        data.push(data[i-1] + cashPerMonth);
    }
    labels.push(numberOfMonths);

    return({labels: labels, data: data});
}

function loadChart(){
    if(chartObj){
        chartObj.destroy();
    }
    if(browser){
        let {labels, data} = getData();
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
        options: {}
        });
    }
}
$: startingCash, cashPerMonth, numberOfMonths, loadChart()


onMount(async()=>{
    loadChart();
})


</script>
  

  
<div class="grid grid-cols-3 grid-rows-4 h-screen">
    <div class="bg-red-200 row-span-4">
        <div class="grid justify-items-center">
            <h1 class="p-10 text-6xl">Ürb Finance</h1>
        </div>
        <div class="p-10 grid gap-4">
            <div class="grid">
                <label for="starting">Starting Cash</label>
                <input bind:value={startingCash} type="number" name="starting" id="">
            </div>

            <div class="grid">
                <label for="monthly">Cash added monthly</label>
                <input bind:value={cashPerMonth} type="number" name="montly" id="">
            </div>

            <div class="grid">
                <label for="months">Number of Months</label>
                <input bind:value={numberOfMonths} type="number" name="months" id="">
            </div>
        </div>
    </div>
    <div class="row-span-4 col-span-2 flex items-center">
        <canvas class="w-max h-1/2" id="myChart">
        </canvas>
    </div>
</div>