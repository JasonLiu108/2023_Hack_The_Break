let userID;

jQuery(async function() {
    // On page load
    const app = firebase.app();

    app.auth().onAuthStateChanged((user) => {
        if (user) {
          userID = user.uid;
        }
    });

    let results = await getResultForCity('Vancouver');

    drawChart(results);
});

async function getResultForCity(city) {
  return db.collection("results").doc(city).get().then((doc) => {
      if (doc.exists) {
          return doc.data();
      }
  });
}

function drawChart(results) {
  const chartElement = $('#result-chart');

  new Chart(chartElement, {
      type: 'bar',
      options: {
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
      },
      data: {
        labels: Object.keys(results), // language
        datasets: [
          {
            label: 'Acquisitions by year',
            data: Object.values(results) // number of votes
          }
        ]
      }
    }
  );
}