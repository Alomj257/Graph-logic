const agentData = {
    daily: [],
    yearly: []
};

const teamData = {
    daily: new Map(),
    yearly: new Map()
};

const countries = ['Чехия', 'Германия', 'Хорватия', 'Франция', 'Испания', 'Россия', 'Италия'];

document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
});

function addAgentData() {
    const name = document.getElementById('agentName').value;
    const sales = parseInt(document.getElementById('agentSales').value);
    const type = document.getElementById('agentType').value;

    if (!name || isNaN(sales)) {
        alert('Пожалуйста, заполните корректные данные агента.');
        return;
    }

    agentData[type].push({ name, sales });
    if (type === 'daily') {
        updateAgentChartDaily();
    } else {
        updateAgentChartYearly();
    }
    updateTotalAmount();
}

function addTeamData() {
    const country = document.getElementById('teamCountry').value;
    const sales = parseInt(document.getElementById('teamSales').value);

    if (isNaN(sales)) {
        alert('Пожалуйста, заполните корректные данные команды.');
        return;
    }

    const currentSales = teamData[dailyTeams].get(country) || 0;
    teamData[dailyTeams].set(country, currentSales + sales);
    updateTeamChart(dailyTeams);
}

function initializeCharts() {
    // Инициализируем графики для агентов и команд
    window.dailyAgentsChart = new Chart(document.getElementById('dailyAgentsChart'), getChartConfig([], [], 'Ежедневные продажи агентов'));
    window.yearlyAgentsChart = new Chart(document.getElementById('yearlyAgentsChart'), getChartConfig([], [], 'Годовые продажи агентов'));
    window.topAgentsChart = new Chart(document.getElementById('topAgentsChart'), getTopAgentsChartConfig());

    const initialTeamSales = countries.map(() => 0);
    window.dailyTeamsChart = new Chart(document.getElementById('dailyTeamsChart'), getChartConfig(countries, initialTeamSales, 'Ежедневные продажи команд'));
}

function updateAgentChartDaily() {
    const chart = window.dailyAgentsChart;
    const data = agentData.daily.map(item => item.sales);
    const labels = agentData.daily.map(item => item.name);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function updateAgentChartYearly() {
    const chart = window.yearlyAgentsChart;
    const data = agentData.yearly.map(item => item.sales);
    const labels = agentData.yearly.map(item => item.name);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function updateTeamChart(type) {
    const chart = window.dailyTeamsChart;
    const data = countries.map(country => teamData[type].get(country) || 0);

    chart.data.datasets[0].data = data;
    chart.update();
}

function updateTotalAmount() {
    const totalAmount = agentData.daily.reduce((total, agent) => total + agent.sales, 0);
    document.getElementById('total-amount').textContent = totalAmount + '€';
}

    function updateTotalAmount() {
    // Рассчитываем общую сумму ежедневных продаж
    const totalAmount = agentData.daily.reduce((total, agent) => total + agent.sales, 0);
    document.getElementById('total-amount').textContent = totalAmount + '€';

    // Получаем значение дневного таргета, введенное пользователем
    const dailyTargetValue = parseInt(document.getElementById('dailyTargetInput').value, 10);
    
    // Проверяем, задан ли дневной таргет и корректно ли введено значение
    if (!isNaN(dailyTargetValue)) {
        // Рассчитываем, достигнут ли дневной таргет
        const remainingTarget = dailyTargetValue - totalAmount;
        document.getElementById('daily-target').textContent = remainingTarget > 0 ? `Осталось: ${remainingTarget}€` : 'Достигнут';
    } else {
        // Если значение дневного таргета не задано или задано некорректно, информируем пользователя
        document.getElementById('daily-target').textContent = 'Не задан';
    }
}

function getGradient(ctx, chartArea) {
    const width = chartArea.right - chartArea.left;
    const height = chartArea.bottom - chartArea.top;
    let gradient = ctx.createLinearGradient(0, chartArea.bottom, width, chartArea.top);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.2)');
    return gradient;
}

function getChartConfig(labels, data, label) {
    return {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label,
                data,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return;
                    return getGradient(ctx, chartArea);
                },
                borderColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return;
                    return getGradient(ctx, chartArea);
                },
                borderWidth: 1,
                borderRadius: 20,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#4B5563', // Цвет подписей на оси Y
                        font: {
                            size: 14,
                        }
                    }
                },
                x: {
                    ticks: {
                        color: '#4B5563', // Цвет подписей на оси X
                        font: {
                            size: 14,
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#374151', // Цвет легенды
                        font: {
                            size: 16,
                        }
                    }
                },
                tooltip: {
                    bodyFont: {
                        size: 14,
                    },
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    borderWidth: 1,
                    borderRadius: 8,
                },
            },
            animation: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
            }
        }
    };
}

function getTopAgentsChartConfig(agentNames, agentSales) {
    return {
        type: 'bar',
        data: {
            labels: agentNames, // Массив с именами агентов, который будет отображаться под графиком
            datasets: [{
                label: 'Сумма продаж',
                data: agentSales, // Массив с суммами продаж для каждого агента
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 200, 200, 0.3)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    color: '#000',
                    anchor: 'center',
                    align: 'center',
                    formatter: function(value) {
                        return value.toLocaleString() + '€'; // Отображение суммы продаж внутри столбца
                    }
                },
                title: {
                    display: true,
                    text: 'Топ агенты за день',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#333',
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        }
    };
}



// Функция добавления агента в список "Топ агенты за день"
function addTopAgent() {
    const name = document.getElementById('topAgentName').value;
    const sales = parseInt(document.getElementById('topAgentSales').value);

    if (!name || isNaN(sales)) {
        alert('Пожалуйста, заполните корректные данные агента.');
        return;
    }

    const topChart = window.topAgentsChart;
    const labels = topChart.data.labels;
    const data = topChart.data.datasets[0].data;

    // Добавляем нового агента в список
    labels.push(name);
    data.push(sales);

    // Ограничиваем список только 10 агентами
    if (labels.length > 10) {
        labels.shift();
        data.shift();
    }

    // Обновляем график
    topChart.update();

    // Очищаем поля редактора
    document.getElementById('topAgentName').value = '';
    document.getElementById('topAgentSales').value = '';
}
function updateTotalAmount() {
    const totalAmount = agentData.daily.reduce((total, agent) => total + agent.sales, 0);
    document.getElementById('total-amount').textContent = totalAmount + '€';
}

// // Функция для обновления дневного таргета
// function updateDailyTarget() {
//     const newTarget = document.getElementById('new-daily-target').value;
//    document.getElementById('daily-target').textContent = newTarget + '€';
//     // Опционально: обновите логику отображения достижения дневного таргета здесь, если это необходимо
// }

// // Добавляем обработчик событий к кнопке для изменения дневного таргета
// document.getElementById('update-target-button').addEventListener('click', updateDailyTarget);
// function updateTotalAmountDisplay(totalAmount) {
//     document.getElementById('total-amount').textContent = totalAmount + '€';
// }

// // Исходная функция, обновленная для использования нового отображения
// document.getElementById('update-total-amount-button').addEventListener('click', function() {
//   var newTotalAmount = document.getElementById('edit-total-amount').value; // Убедитесь, что у вас есть input с id='edit-total-amount'
  
//   if (newTotalAmount.trim() !== '') { // Проверяем, не пустая ли строка
//     localStorage.setItem('totalAmount', newTotalAmount);
//     alert('Общая сумма успешно изменена на ' + newTotalAmount + '.');
//   } else {
//     alert('Пожалуйста, введите значение общей суммы.');
//   }
// });

function updateDailyTarget() {
    const newTarget = document.getElementById('new-daily-target').value;
    document.getElementById('daily-target').textContent = newTarget + '€';
    // Опционально: обновите логику отображения достижения дневного таргета здесь, если это необходимо
}

// Добавляем обработчик событий к кнопке для изменения дневного таргета
document.getElementById('update-target-button').addEventListener('click', updateDailyTarget);

// Функция для обновления отображения общей суммы
function updateTotalAmountDisplay(totalAmount) {
    document.getElementById('total-amount').textContent = totalAmount + '€';
}

// Исходная функция, обновленная для использования нового отображения
document.getElementById('update-total-amount-button').addEventListener('click', function () {
    var newTotalAmount = document.getElementById('edit-total-amount').value.trim(); // Получаем введенное значение и удаляем лишние пробелы

    if (newTotalAmount !== '') { // Проверяем, не пустая ли строка
        localStorage.setItem('totalAmount', newTotalAmount); // Сохраняем новую общую сумму в localStorage
        updateTotalAmountDisplay(newTotalAmount); // Обновляем отображение общей суммы
        alert('Общая сумма успешно изменена на ' + newTotalAmount + '.');
    } else {
        alert('Пожалуйста, введите значение общей суммы.');
    }
});


// Добавляем обработчик событий для кнопки редактирования общей суммы
function exportToCSV(data, filename) {
    let csvContent = "data:text/csv;charset=utf-8," 
        + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
function exportToXLS(data, sheetName, filename) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, filename);
}
function exportSVG(svgElement, filename) {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function svgToPng(svgElement, filename) {
    const xml = new XMLSerializer().serializeToString(svgElement);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    const img = new Image();
    img.src = image64;
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 'image/png');
    };
}
localStorage.setItem('agentData', JSON.stringify(agentData));
localStorage.setItem('teamData', JSON.stringify(teamData));

// Получение сохраненных данных
localStorage.setItem('agentData', JSON.stringify(agentData));
localStorage.setItem('teamData', JSON.stringify(teamData));
localStorage.setItem('AgentsChartData', JSON.stringify(AgentsChartData));
localStorage.setItem('TeamsChartData', JSON.stringify(TeamsChartData));


// Получение сохраненных данных
const savedAgentData = JSON.parse(localStorage.getItem('agentData'));
const savedTeamData = JSON.parse(localStorage.getItem('teamData'));
const savedAgentsChartData = JSON.parse(localStorage.getItem('AgentsChartData'));
const savedTeamsChartData = JSON.parse(localStorage.getItem('TeamsChartData'));
// Функция для добавления данных агента
// Функция для добавления данных агента
// Создание графика ежедневных продаж агентов
var dailyAgentsChart = new Chart(document.getElementById('dailyAgentsChart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Ежедневные продажи агентов',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Создание графика ежедневных продаж команд
var dailyTeamsChart = new Chart(document.getElementById('dailyTeamsChart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Ежедневные продажи команд',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Создание графика годовых продаж агентов
var yearlyAgentsChart = new Chart(document.getElementById('yearlyAgentsChart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Годовые продажи агентов',
      backgroundColor: 'rgba(255, 206, 86, 0.5)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// Создание графика топ агентов
var topAgentsChart = new Chart(document.getElementById('topAgentsChart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Топ агенты',
      backgroundColor: '#4CAF50', // Зеленый цвет для столбцов
      borderColor: '#4CAF50',
      borderWidth: 2,
      data: []
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: '#333' // Цвет шрифта для оси Y
        },
        gridLines: {
          color: '#ccc' // Цвет линий сетки
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#333' // Цвет шрифта для оси X
        },
        gridLines: {
          color: '#ccc' // Цвет линий сетки
        }
      }]
    },
    legend: {
      display: false // Отключаем отображение легенды
    },
    title: {
      display: true,
      text: 'Продажи топ агентов',
      fontSize: 20,
      fontColor: '#333', // Цвет заголовка
      fontStyle: 'bold'
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      backgroundColor: '#555', // Цвет фона подсказки
      titleFontColor: '#fff', // Цвет заголовка подсказки
      bodyFontColor: '#fff', // Цвет текста подсказки
      borderColor: '#777' // Цвет границы подсказки
    }
  }
});


// Функция для сохранения данных в localStorage
function saveDataToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Функция для получения данных из localStorage
function getDataFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Функция для обновления графика ежедневных продаж агентов
function updateDailyAgentsChart() {
  // Получаем текущие данные из localStorage
  var agents = getDataFromLocalStorage('agents');

  // Обновляем данные графика
  var agentLabels = [];
  var agentSales = [];
  agents.forEach(function(agent) {
    agentLabels.push(agent.name + ' (Сумма: ' + agent.sales + ')'); // Добавляем сумму к имени агента
    agentSales.push(agent.sales);
  });

  // Обновляем график
  dailyAgentsChart.data.labels = agentLabels;
  dailyAgentsChart.data.datasets[0].data = agentSales;
  dailyAgentsChart.update();
}

// Функция для обновления графика ежедневных продаж команд
function updateDailyTeamsChart() {
  // Получаем текущие данные из localStorage
  var teams = getDataFromLocalStorage('teams');

  // Обновляем данные графика
  var teamLabels = [];
  var teamSales = [];
  teams.forEach(function(team) {
    teamLabels.push(team.country + ' (Сумма: ' + team.sales + ')'); // Добавляем сумму к названию команды
    teamSales.push(team.sales);
  });

  // Обновляем график
  dailyTeamsChart.data.labels = teamLabels;
  dailyTeamsChart.data.datasets[0].data = teamSales;
  dailyTeamsChart.update();
}


// Функция для обновления графика годовых продаж агентов
// Функция для добавления годовых данных агента
function addYearlyAgent() {
  var yearlyAgentName = document.getElementById('yearlyAgentName').value;
  var yearlyAgentSales = parseFloat(document.getElementById('yearlyAgentSales').value);

  var yearlyAgentData = {
    name: yearlyAgentName,
    sales: yearlyAgentSales
  };

  // Получаем текущие данные из localStorage
  var yearlyAgents = getDataFromLocalStorage('yearlyAgents');

  // Добавляем новые годовые данные агента
  yearlyAgents.push(yearlyAgentData);

  // Сохраняем обновленные данные в localStorage
  saveDataToLocalStorage('yearlyAgents', yearlyAgents);

  // Обновляем график
  updateYearlyAgentsChart();

  alert('Годовые данные агента добавлены и сохранены в localStorage.');
}

// Функция для обновления графика годовых продаж агентов
function updateYearlyAgentsChart() {
  // Получаем текущие данные из localStorage
  var yearlyAgents = getDataFromLocalStorage('yearlyAgents') || [];

  // Обновляем данные графика
  var agentLabels = [];
  var agentData = [];
  yearlyAgents.forEach(function(agent) {
    agentLabels.push(agent.name + ' (Сумма: ' + agent.sales + ')'); // Добавляем сумму к имени агента
    agentData.push(agent.sales);
  });

  // Обновляем график
  yearlyAgentsChart.data.labels = agentLabels;
  yearlyAgentsChart.data.datasets[0].data = agentData;
  yearlyAgentsChart.update();
}



// Функция для обновления графика топ агентов
function updateTopAgentsChart() {
  // Получаем текущие данные из localStorage
  var topAgents = getDataFromLocalStorage('topAgents');

  // Обновляем данные графика
  var topAgentNames = topAgents.map(function(agent) {
    return agent.name;
  });
  var topAgentSales = topAgents.map(function(agent) {
    return agent.sales;
  });

  // Обновляем график
  topAgentsChart.data.labels = topAgentNames;
  topAgentsChart.data.datasets[0].data = topAgentSales;
  topAgentsChart.update();
}

// Функция для добавления данных агента
function addAgentData() {
  var agentName = document.getElementById('agentName').value;
  var agentSales = parseFloat(document.getElementById('agentSales').value);
  var agentType = document.getElementById('agentType').value;

  var agentData = {
    name: agentName,
    sales: agentSales,
    type: agentType
  };

  // Получаем текущие данные из localStorage
  var agents = getDataFromLocalStorage('agents');

  // Добавляем новые данные агента
  agents.push(agentData);

  // Сохраняем обновленные данные в localStorage
  saveDataToLocalStorage('agents', agents);

  // Обновляем графики
  updateDailyAgentsChart();

  alert('Данные агента добавлены и сохранены в localStorage.');
}

// Функция для добавления данных команды
function addTeamData() {
  var teamCountry = document.getElementById('teamCountry').value;
  var teamSales = parseFloat(document.getElementById('teamSales').value);
  var teamType = document.getElementById('teamType').value;

  var teamData = {
    country: teamCountry,
    sales: teamSales,
    type: teamType
  };

  // Получаем текущие данные из localStorage
  var teams = getDataFromLocalStorage('teams');

  // Добавляем новые данные команды
  teams.push(teamData);

  // Сохраняем обновленные данные в localStorage
  saveDataToLocalStorage('teams', teams);

  // Обновляем график
  updateDailyTeamsChart();

  alert('Данные команды добавлены и сохранены в localStorage.');
}

function displayDailyTarget() {
  var dailyTarget = getDataFromLocalStorage('dailyTarget'); // Используем уже определенную функцию для извлечения данных
  document.getElementById('dailyTargetDisplay').innerText = `Дневной таргет: ${dailyTarget}`;
}
function displayTotalAmount() {
  var totalAmount = getDataFromLocalStorage('totalAmount'); // Используем уже определенную функцию для извлечения данных
  document.getElementById('totalAmountDisplay').innerText = `Общая сумма: ${totalAmount}`;
}


// Загрузка данных при загрузке страницы
window.onload = function() {
  updateDailyAgentsChart();
  updateDailyTeamsChart();
  updateYearlyAgentsChart();
  updateTopAgentsChart();
  displayDailyTarget(); // Отображаем дневной таргет
  displayTotalAmount(); // Отображаем общую сумму
};

