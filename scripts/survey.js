let userID;
let previousSubmission = [];
let previousCity = null;

jQuery(async function() {
    // On page load
    const app = firebase.app();
    const db = app.firestore();

    app.auth().onAuthStateChanged((user) => {
        if (user) {
          userID = user.uid;

          loadExistingSubmission();
        }
    });

    createCityOptions();

    $('.tech-form').on('change', function() {
        toggleSubmitButton();
    });

    // Send data to firestore after user submits
    $('#survey-submit').on('click', async function() {
        submitSurvey();
    });
});

function createCityOptions() {
    for (city in cities) {
        $('#city').append(`<option value="${cities[city]}">${cities[city]}</option>`);
    }
}

function loadExistingSubmission() {
    db.collection("users").doc(userID).get().then((doc) => {
        if (doc.exists) {
            if (doc.data().results) {
                Object.keys(doc.data().results).forEach((entry) => {
                    $(`[id='${entry}']`).prop('checked', true);
                    previousSubmission.push(entry);
                });
            }

            if (doc.data().city) {
                previousCity = doc.data().city
                $(`#city option[value='${doc.data().city}']`).prop('selected', true);
            }
        }
    });
}

function toggleSubmitButton() {
    let anyButtonsChecked = $('.tech-form :checked').length > 0;
    if (anyButtonsChecked) {
        $('#survey-submit').prop('disabled', false);
    } else {
        $('#survey-submit').prop('disabled', true);
    }
    
}

async function submitSurvey() {
    let results = {};
    let removals = {};
    $('.tech-form :checked').each(function() {
        let tech = $(this).attr('id')
        if (!previousSubmission.includes(tech)) {
            // previous submission does not have this item
            results[tech] = firebase.firestore.FieldValue.increment(1) // e.g. {Javascript: increment(1)}
        } else if (previousSubmission.length > 0) {
            // remove item from previousSubmission if it exists, so remaining items in previousSubmissions are ones unselected
            previousSubmission = previousSubmission.filter(item => item !== tech)
        }
    });

    previousSubmission.forEach(tech => {
        removals[tech] = firebase.firestore.FieldValue.increment(-1)
    });

    let error = null;


    try {
        await db
            .collection('results')
            .doc($('#city option:selected').text())
            .update(results);
        
        if (Object.keys(removals).length > 0 && previousCity) {
            await db
                .collection('results')
                .doc(previousCity)
                .update(removals);
        }

        await db
            .collection("users")
            .doc(userID)
            .update({
                city: $('#city option:selected').text(),
                results: results,
                voted: true
            });
    } catch (e){
        console.log(e)
        alert('Submission failed!', 'error');
        // window.location.href = "index.html";
        return;
    }

    alert('Submission was successful!', 'success');
    window.location.href = "index.html";
}