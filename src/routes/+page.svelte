<script lang="ts">
import {onMount} from "svelte"

import Chart from 'chart.js/auto'

const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

onMount(async()=>{
    new Chart(
        document.getElementById('myChart') as any,
        {
      type: "line",
      data: {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45]
          }
        ]
      },
      options: {}
    });
})


</script>
  

  
<div class="grid grid-cols-3 grid-rows-4 h-screen">
    <div class="bg-red-200 row-span-4">
        <div class="grid justify-items-center">
            <h1 class="p-10 text-6xl">Urb Finance</h1>
        </div>
        <div class="p-10 grid gap-4">
            <div class="grid">
                <label for="starting">Starting Cash</label>
                <input type="number" name="starting" id="">
            </div>

            <div class="grid">
                <label for="monthly">Cash added monthly</label>
                <input type="number" name="montly" id="">
            </div>
        </div>
    </div>
    <div class="row-span-4 col-span-2 flex items-center">
        <canvas class="w-max h-1/2" id="myChart">
        </canvas>
    </div>
</div>