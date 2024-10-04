<script>
    // @ts-nocheck
    import axios from 'axios';
    import { province_th } from '../../lib/province.ts';
    
    const handleSubmit = () => {
      let date = document.querySelector('input[type="date"]').value;
      let taxi_plate = document.querySelector('input[name="taxi_plate"]').value;
      let province = document.querySelector('select').value;
      let from = document.querySelector('input[name="from"]').value;
      let to = document.querySelector('input[name="to"]').value;
      let amount = document.querySelector('input[name="amount"]').value;
      
      axios.post('/api/taxi', {
          date: date,
          taxi_plate: taxi_plate,
          province: province,
          from: from,
          to: to,
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
    
    <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-lg text-center">
        <h1 class="text-2xl font-bold sm:text-3xl">เบิกค่าเดินทาง (Taxi)</h1>
        <p class="mt-4 text-gray-500">กรุณากรอกข้อมูลดังต่อไปนี้</p>
      </div>
    
      <form action="#" class="mx-auto mb-0 mt-8 max-w-md space-y-4">
        <!-- Date -->
        <div>
          <label for="date" class="sr-only">Date</label>
          <p class="text-gray-500">วันที่เบิกค่าเดินทาง</p>
          <div class="relative">
            <input
              type="date"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter date"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
    
        <!-- Taxi Plate -->
        <div>
          <label for="taxi_plate" class="sr-only">Taxi Plate</label>
          <p class="text-gray-500">ทะเบียนรถ</p>
          <div class="relative">
            <input
              type="text"
              name="taxi_plate"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter taxi plate"
              required
            />
          </div>
        </div>
    
        <!-- Province -->
        <div>
          <label for="province" class="sr-only">Province</label>
          <p class="text-gray-500">จังหวัด</p>
          <div class="relative">
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
        </div>
    
        <!-- From Location -->
        <div>
          <label for="from" class="sr-only">From</label>
          <p class="text-gray-500">ต้นทาง</p>
          <div class="relative">
            <input
              type="text"
              name="from"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="From Location"
              required
            />
          </div>
        </div>
    
        <!-- To Location -->
        <div>
          <label for="to" class="sr-only">To</label>
          <p class="text-gray-500">ปลายทาง</p>
          <div class="relative">
            <input
              type="text"
              name="to"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="To Location"
              required
            />
          </div>
        </div>
    
        <!-- Amount -->
        <div>
          <label for="amount" class="sr-only">Amount</label>
          <p class="text-gray-500">จำนวนเงิน (บาท/สตางค์)</p>
          <div class="relative">
            <input
              type="number"
              name="amount"
              class="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>
    
        <!-- Submit Button -->
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
    