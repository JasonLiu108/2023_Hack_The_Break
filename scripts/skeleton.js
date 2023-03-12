//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
// function loadSkeleton(){
//     console.log($('#navbarPlaceholder').load('./text/nav.html'));
//     console.log($('#footerPlaceholder').load('./text/footer.html'));
// }
// loadSkeleton();  //invoke the function

function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log($('#navbarPlaceholder').load('/text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));

        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('/text/nav.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        }
    });
    
}

function signout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        location.replace('./index.html');
      }).catch((error) => {
        // An error happened.
      });
}

loadSkeleton();  //invoke the function