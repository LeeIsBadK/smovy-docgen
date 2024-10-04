<script>
// @ts-nocheck
import axios from 'axios';
import {province_th} from '../../lib/province.ts';
import {PUBLIC_API_KEY} from '$env/static/public';
const handleSubmit = () => {
    let date = document.querySelector('input[type="date"]').value;
    let taxi_plate = document.querySelector('input[type="text"]').value;
    let province = document.querySelector('select').value;
    let amount = document.querySelector('input[type="number"]').value;
    
    axios.post(PUBLIC_API_KEY + '/api/taxi', {
        date: date,
        taxi_plate: taxi_plate,
        province: province,
        amount: amount
    }, {
        responseType: 'blob' // Important for handling binary data
    })
    .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'taxi_receipt.pdf'); // or any other file name
        document.body.appendChild(link);
        link.click();
        link.remove();
    })
    .catch(error => {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    });

}
</script>

<!--
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
-->

<div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-lg text-center">
        <h1 class="text-2xl font-bold sm:text-3xl">เบิกค่าเดินทาง (Taxi)</h1>

        <p class="mt-4 text-gray-500">กรุณากรอกข้อมูลดังต่อไปนี้</p>
    </div>

    <form action="#" class="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <div>
            <label for="Date" class="sr-only">Date</label>
            <p class="text-gray-500">วันที่เบิกค่าเดินทาง</p>
            <div class="relative">
                <input
                    type="date"
                    class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                />

                <span
                    class="absolute inset-y-0 end-0 grid place-content-center px-4"
                >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                  </svg>
                  
                </span>
            </div>
        </div>

        <div>
            <label for="text" class="sr-only">taxi_plate</label>

            <div class="relative">
                <p class="text-gray-500">ทะเบียนรถ</p>
                <input
                    type="text"
                    class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter taxi plate"
                />
            </div>
            <div class="relative">
                <p class="text-gray-500">จังหวัด</p>
                <select
                    class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    required
                >
                    <option value="" disabled selected>เลือกจังหวัด</option>
                    {#each province_th as province}
                        <option value={province}>{province}</option>
                    {/each}
                </select>
        </div>
        <div>
            <div>
                <label for="amount" class="sr-only">Amount</label>
                <p class="text-gray-500">จำนวนเงิน (บาท/สตางค์)</p>
                <div class="relative">
                    <input
                        type="number"
                        class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        placeholder="Enter amount"
                        required
                    />
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between">

            <button
                type="submit"
                class="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                on:click|preventDefault={handleSubmit}
            >
                Submit
            </button>
        </div>
    </form>
</div>
