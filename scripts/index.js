let userID;
let chart;


jQuery(async function() {
    // On page load
    const app = firebase.app();

    createCityOptions();

    app.auth().onAuthStateChanged((user) => {
        if (user) {
          userID = user.uid;
          updateCTALink(true);
          selectUsersCity();
        } else {
          updateCTALink(false);
        }
    });

    city = $('#city').val();
    let results = await getResultForCity(city);
    drawChart(results);

    $('#city').change(async function() {
      city = $('#city').val();
      let results = await getResultForCity(city);
      drawChart(results);
    });
});

function createCityOptions() {
  for (city in cities) {
      $('#city').append(`<option value="${cities[city]}">${cities[city]}</option>`);
  }
}

function updateCTALink(loggedIn) {
  if (loggedIn) {
    $('#cta_link').attr('href', `./survey.html`);
  } else {
    $('#cta_linkg').attr('href', `./login.html`);
  }
}

function selectUsersCity() {
  db.collection("users").doc(userID).get().then((doc) => {
      if (doc.exists) {
          if (doc.data().city) {
              $(`#city option[value='${doc.data().city}']`).prop('selected', true);
          }
      }
  });
}

async function getResultForCity(city) {
  let results = await db.collection("results").doc(city).get().then((doc) => {
      if (doc.exists) {
        return doc.data();
      }
  });

  let resultsArray = [];
  let total = 0; 
  for (const [key, val] of Object.entries(results)) {
    total += val; 
    resultsArray.push({
      label: key,
      data: val,
    });
  } 

  // // change colors of the chart.js
  Chart.defaults.color = '#EDEDED';
  Chart.defaults.borderColor = 'transparent';
  // Chart.defaults.backgroundColor = '#fff';
  // Chart.defaults.font.color = '#fff';


  resultsArray.sort((a, b) => {
    if (b.data === a.data) {
      return a.label.charCodeAt(0) - b.label.charCodeAt(0);
    } else {
      return b.data - a.data;
    }
  });
  // return resultsArray;
  return resultsArray.map((element) => {
    element.data = Math.ceil(element.data / total * 100);
    return element;
  }); 
}

function drawChart(results) {
  const chartElement = $('#result-chart');
  Chart.defaults.font.size = 21;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.scale.grid.display = false;
  
  if (chart) chart.destroy();

  chart = new Chart(chartElement, {
    type: 'bar',
    options: {
      indexAxis: 'y',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      scales: {
        x: {
          ticks: {
            callback: (value, index, values) => {
              return `${value}%`
            }
          },
          display: true,
        }
      },
      plugins: {
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: function(toolTipItem, data) {
              return toolTipItem.formattedValue + '%'
            }
          }
        }
      },
      tooltips: {
        callback: (chart, label, c, d, e, f, g, h, i) => {
          console.log(label);
        }
      }
    },
      data: {
        labels: results.map(element => element.label), // language
        datasets: [
          {
            labels: {
              render: 'percentage'
            },
            data: results.map(element => element.data), // number of votes
            backgroundColor: ["#EADCFB", "#DCBDFB", "#CB9EFB", "#B083F0", "#986EE2", "#8256D0", "#8256D0", "#6C4BB1", "#604598", "#523E7C", "#3F3365", "#2E2A4F", "#1F1F39", "#0F0F1F", "#000000"],
          }
        ]
      }
    }
  );
}