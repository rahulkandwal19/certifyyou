import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
let authintication = getAuth();
document.getElementById("loginButton").addEventListener("click", function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(authintication, email, password)
        .then((userCredential) => {
            swal({
                title: "Log in successfully",
                icon: "success",
                button: "Ok",
                closeOnClickOutside: false
            }).then((userInput) => {
                window.location.replace("home.html");
            });
        })
        .catch((error) => {
            swal({
                title: "Log in fail!",
                text: "Check your eMail and password \n Check your internet connection",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })
        });
});

document.getElementById("backButton").addEventListener("click", function() {
    swal({
        title: "Want to Go Back ?",text:" Login will be cancelled !",
        buttons: ["No","Yes"],
        dangerMode: true,
        closeOnClickOutside: false
    }).then((userInput) => {
        if (userInput) {
            window.location.replace("index.html");
        }
    })
});

document.getElementById("getportal").addEventListener("click", function() {
    window.location.replace("signup.html");
});