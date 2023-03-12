jQuery(function() {
    // On page load
    const app = firebase.app();
    const db = app.firestore();
    createCityOptions();

    // Send data to firestore after user submits
    $('#survey-submit').on('click', async function() {
        let results = {}
        $('.tech-form :checked').each(function() {
            // console.log($(this).val())
            results[$(this).attr('id')] = firebase.firestore.FieldValue.increment(1) // e.g. {Javascript: increment(1)}
        });

        // console.log(results)

        await db
            .collection('results')
            .doc($('#city option:selected').text())
            .update(results)
            .catch(e => console.log(e));
        
        alert('Submission was successful!', 'success')
        let userID = firebase.auth().currentUser.uid
        db.collection("users").doc(userID).update({     
            city: $('#city option:selected').text(),
            results: results,                  
            voted: true                                    
        })
    });
});

function createCityOptions() {
    for (city in cities) {
        $('#city').append(`<option value="${cities[city]}">${cities[city]}</option>`);
    }
}


// var subjectObject = {
//     "Vancouver": {
//         HTML: ["Links", "Images", "Tables", "Lists"],
//         CSS: ["Borders", "Margins", "Backgrounds", "Float"],
//         JavaScript: ["Variables", "Operators", "Functions", "Conditions"],
//     },
//     "Seattle": {
//         PHP: ["Variables", "Strings", "Arrays"],
//         SQL: ["SELECT", "UPDATE", "DELETE"],
//     },
//     "San Francisco": {
//         PHP: ["Variables", "Strings", "Arrays"],
//         SQL: ["SELECT", "UPDATE", "DELETE"],
//     },
//     "New York": {
//         PHP: ["Variables", "Strings", "Arrays"],
//         SQL: ["SELECT", "UPDATE", "DELETE"],
//     },
//     "Hawaii": {
//         PHP: ["Variables", "Strings", "Arrays"],
//         SQL: ["SELECT", "UPDATE", "DELETE"],
//     },
// };
// window.onload = function () {
//     var subjectSel = document.getElementById("subject");
//     var topicSel = document.getElementById("topic");
//     var chapterSel = document.getElementById("chapter");
//     for (var x in subjectObject) {
//         subjectSel.options[subjectSel.options.length] = new Option(x, x);
//     }
//     subjectSel.onchange = function () {
//         //empty Chapters- and Topics- dropdowns
//         chapterSel.length = 1;
//         topicSel.length = 1;
//         //display correct values
//         for (var y in subjectObject[this.value]) {
//             topicSel.options[topicSel.options.length] = new Option(y, y);
//         }
//     };
//     topicSel.onchange = function () {
//         //empty Chapters dropdown
//         chapterSel.length = 1;
//         //display correct values
//         var z = subjectObject[subjectSel.value][this.value];
//         for (var i = 0; i < z.length; i++) {
//             chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
//         }
//     };
// };
