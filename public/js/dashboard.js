const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM', '17:00 PM'],
    datasets: [{
      label: 'Số người vào',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      fill: true
    }, {
      label: 'Số người ra',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});


// cập nhật số lượng người
const ws = new WebSocket('ws://localhost:3000');

// Khi kết nối thành công
ws.onopen = () => {
  console.log('WebSocket connected');
  ws.send('Hello Server!');
};

// Khi nhận được tin nhắn từ server
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const peopleInsideElment = document.querySelector('#people-inside');
  const peopleInElment = document.querySelector('#people-in');
  const peopleOutElment = document.querySelector('#people-out');
  const timeUpdateElements = document.querySelectorAll('#time-update');
  peopleInsideElment.innerHTML = data.people_inside;
  peopleInElment.innerHTML = data.people_in;
  peopleOutElment.innerHTML = data.people_out;
  timeUpdateElements.forEach((elm) => elm.innerHTML = data.updated_at);


  // Cập nhật biểu đồ mỗi lần nhận dữ liệu mới
  myChart.data.labels.push(data.updated_at); // Thêm thời gian mới
  myChart.data.datasets[0].data.push(data.people_in); // Số người vào
  myChart.data.datasets[1].data.push(data.people_out); // Số người ra

  // Giới hạn số lượng điểm hiển thị trên biểu đồ (ví dụ: chỉ 30 điểm)
  if (myChart.data.labels.length > 15) {
    myChart.data.labels.shift();
    myChart.data.datasets[0].data.shift();
    myChart.data.datasets[1].data.shift();
  }

  myChart.update();
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

const btnStates = document.querySelectorAll('.btn-state');
btnStates.forEach(btn => {
  btn.addEventListener('click', () => {
    const state = btn.getAttribute('state');
    fetch(`http://localhost:3000/dashboard/${state}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: state }),
    })
      .then(response => response.json())
      .then(result => {
        console.log("Thành công:", result);
      })
      .catch(error => {
        console.error("Lỗi:", error);
      });
  })

});