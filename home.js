import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDatabase,
    ref as ref,
    set,push,onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


let authintication = getAuth();

//User Email Set in Profile Section of Menu
function setname(userName) {
    document.getElementById("userEmailText").innerText = userName;
}
const db = getDatabase();
onAuthStateChanged(authintication, (user) => {
    if (user) {
        console.log(user);
        const issuerID = authintication.currentUser.uid;
        onValue(ref(db, '/user/'+issuerID+'/info/'), (snapshot) => {
            if (snapshot.exists() && snapshot.val().image !== undefined)
                document.getElementById("userPicture").src = snapshot.val().image;
            setname(snapshot.val().name);
        })
    } else window.location.replace("login.html");
})

//OPEN MENU
document.getElementById("menu_button").addEventListener("click", function() {
    if(window.innerWidth < 900) {
        document.getElementById("menu").style.width = "100vw";
    }
    else{
        document.getElementById("menu").style.width = "40vw";
    }
});
//CLOSE MENU
document.getElementById("closeMenu").addEventListener("click", function() {
    document.getElementById("menu").style.width = "0%";
});

//LOGOUT
document.getElementById("logoutButton").addEventListener("click", function() {
    swal({
        title: "Logging Out?",
        icon: "info",
        buttons: ["Cancel","Log Out"],
        dangerMode: true,
        closeOnClickOutside: false
    }).then((userInput) => {
        if (userInput) {
            signOut(authintication).then(() => {
                console.log('Sign-out successful.');
                window.location.replace("index.html");
            }).catch((error) => {
                console.log('An error happened.');
                swal({
                    title: "Error!",
                    text: "User LogOut Failed! Try Again",
                    icon: "error",
                    closeOnClickOutside: false,
                    buttons:false
                })
            });
        }
    });
});




document.getElementById("profileButton").addEventListener("click", function() {
    window.location.href = "user.html";
});
document.getElementById("aboutButton").addEventListener("click", function() {
    window.location.href = "shop.html";
});
document.getElementById("supportButton").addEventListener("click", function() {
    window.location.href = "designdesk.html";
});