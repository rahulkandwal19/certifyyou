import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,updateProfile } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue,set,push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
let authintication = getAuth();
const database = getDatabase();
document.getElementById("signupButton").addEventListener("click", function() {
    let uname = document.getElementById("name").value;
    let ulink = document.getElementById("link").value;
    let uabout = document.getElementById("about").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(uname);
    console.log(ulink);
    console.log(uabout);
    if ((uname !== null && uname !== "") &&
        (ulink !== null && ulink !== "") &&
        (uabout !== null && uabout !== "") &&
        (email !== null && email !== "") &&
        (password !== null && password !== "")) {
        swal({
            title: "Creating Account",
            text: "Creating new account with \n e-Mail :  " + email + "\nDisplay Name : " + uname + ".\nThis cannot be change later. \n\n *By creating account you are accepting platform\n  Terms and Conditions.",
            buttons: ["wait", "Proceed"],
            closeOnClickOutside: false
        }).then((userInput) => {
            if (userInput) {
                createUserWithEmailAndPassword(authintication, email, password)
                    .then((userCredential) => {
                        if (uname === "" || uname === undefined || uname === null) {
                            uname = "user";
                        }
                        updateProfile(authintication.currentUser, {
                            displayName: uname
                        });
                        const user = userCredential.user.uid;
                        const message = "Save your UserID : \n" + user;

                        set(ref(database, 'user/' + user), {
                            info: {
                                about: uabout,
                                image: "https://firebasestorage.googleapis.com/v0/b/certifyyou-5f82f.appspot.com/o/organization_logo%2FdefaultUserPic.jpeg?alt=media&token=22c6204d-09c1-4926-b10a-ef315b09364c",
                                link: ulink,
                                email: email,
                                name: uname
                            },
                            event: {}
                        });
                        set(ref(database, 'credits/' + user), {
                                credits: 255,
                                plan: "FREE TRIAL",
                                type: "NO COST",
                            }
                        ).then(() => {
                            let key1 = push(ref(database, "user/" + user + "/transactions/")).then((keyData1) => {
                                let keylocation = keyData1._path.pieces_[3]
                                let date = new Date();
                                const dd = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
                                const mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
                                const yy = date.getFullYear();
                                const h = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
                                const m = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
                                const ss = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();

                                let current = dd + "/" + mm + "/" + yy + "@" + h + ":" + m + ":" + ss;
                                set(ref(database, "user/" + user + "/transactions/" + keylocation), {
                                    note: "PURCHASE: Account Open FREE-TRIAL ",
                                    date: current,
                                    balance: 255,
                                    transaction: 255
                                })
                            })
                        }).then(() => {
                            swal({
                                title: "Sign Up successful",
                                text: "\nLog in using your eMail and Password \n \n Set your Public Profile from Profile options in main menu\n\n" + message,
                                icon: "success",
                                button: "Ok",
                                closeOnClickOutside: false
                            }).then((userInput) => {
                                window.location.replace("login.html");
                            });
                        })
                    })
                    .catch((error) => {
                        swal({
                            title: "SignUp Fail",
                            text: "Check your Internet Connection \n Check if already signup using this email \n Check is email valid",
                            icon: "error",
                            button: "Ok",
                            closeOnClickOutside: false
                        })
                    })
            }
        })
    } else {
        swal({
            title: "Missing Fields",
            text: "All Fields are Required \n You Missed Some, Check and ReTry.",
            icon: "info",
            button: "Ok",
            closeOnClickOutside: false
        })
    }
});

document.getElementById("backButton").addEventListener("click", function() {
    swal({
        title: "Want to Go Back ?",text:" Registration will be cancelled !",
        buttons: ["No","Yes"],
        dangerMode: true,
        closeOnClickOutside: false
    }).then((userInput) => {
        if (userInput) {
            window.location.replace("index.html");
        }
    })
});