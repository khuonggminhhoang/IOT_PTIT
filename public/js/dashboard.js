const formatDate = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Chuyển 0 giờ thành 12
  const formattedMinutes = minutes.toString().padStart(2, "0"); // Đảm bảo 2 chữ số
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const ctx = document.getElementById('myChart').getContext('2d');
let peopleIns = [];
let peopleOuts = [];
let times = []
fetch(`http://localhost:3000/dashboard/chart`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
.then(response => response.json())
.then(result => {
  result.forEach(x => peopleIns.push(x.people_in));
  result.forEach(x => peopleOuts.push(x.people_out));
  result.forEach(x => times.push(formatDate(new Date(x.updated_at))));
})
.catch(error => {
  console.error("Lỗi:", error);
});
console.log(times);

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: times,
    datasets: [{
      label: 'Số người vào',
      data: peopleIns,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      fill: true
    }, {
      label: 'Số người ra',
      data: peopleOuts,
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


//- Script cho hiệu ứng thay đổi màu nút
document.addEventListener('DOMContentLoaded', function() {
  const onButton = document.getElementById('onButton');
  const offButton = document.getElementById('offButton');

  // Xử lý khi nút On được nhấn
  onButton.addEventListener('click', function() {
    onButton.classList.add('btn-success');
    onButton.classList.remove('btn-outline-success');
    offButton.classList.remove('btn-danger');
    offButton.classList.add('btn-outline-danger');
  });

  // Xử lý khi nút Off được nhấn
  offButton.addEventListener('click', function() {
    offButton.classList.add('btn-danger');
    offButton.classList.remove('btn-outline-danger');
    onButton.classList.remove('btn-success');
    onButton.classList.add('btn-outline-success');
  });
});