// public/js/script.js
document.addEventListener('DOMContentLoaded', function () {
  const dashboardLink = document.querySelector('a[href="/dashboard"]');
  const sensorLogLink = document.querySelector('a[href="/sensor-log"]');

  dashboardLink.addEventListener('click', function (e) {
    e.preventDefault(); // Ngăn sự kiện mặc định
    // Làm sáng màu cho "Tổng quan"
    dashboardLink.classList.add('active');
    sensorLogLink.classList.remove('active');
  });

  sensorLogLink.addEventListener('click', function (e) {
    e.preventDefault(); // Ngăn sự kiện mặc định
    // Làm sáng màu cho "Sensor-log"
    sensorLogLink.classList.add('active');
    dashboardLink.classList.remove('active');
  });
});