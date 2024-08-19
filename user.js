import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let authintication = getAuth();
const db = getDatabase();
let uid ;
onAuthStateChanged(authintication, (user) => {
    if (user) {
        console.log(user);
        uid = user.uid;

        document.getElementById("userid").innerText = "User ID : "+ user.uid;
        document.getElementById("email").innerText = "eMail : "+user.email;
        onValue(ref(db, '/user/' + user.uid +'/info'), (snapshot) => {
            if (snapshot.exists()) {
                let issuerName = snapshot.val().name;
                let aboutIssuerLink = snapshot.val().link;
                let aboutIssuer = snapshot.val().about;
                let issuerlogo = snapshot.val().image;

                document.getElementById("name").innerText = "Display Name : "+ issuerName;
                document.getElementById("about").innerText = aboutIssuer;
                document.getElementById("link").innerHTML = "<a id='elink' href='"+aboutIssuerLink+"'>"+aboutIssuerLink+"</a>";
                document.getElementById("eventLogo").src = issuerlogo;

            }
            document.getElementById("loading").href = "none";
            document.getElementById("loading").style.display = "none";
            document.getElementById("LoadingOverlay").style.display = "none";

        })

    } else window.location.replace("login.html");
})



document.getElementById("update").addEventListener(("click"), () => {
    let mail = document.createElement('a');
    let body =
        'Want the following update in my profile.\n' +
        'User ID :  '+ uid + '\n\n [List Changes you want]'
    mail.href = "mailto:certifyyou.tech@gmail.com?subject=  Profile Update Request " + " &body=" + encodeURIComponent(body);
    mail.click();
});