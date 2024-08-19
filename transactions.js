import {getAuth,
    onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDownloadURL,
    getStorage,
    ref as refS,
    uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
    getDatabase,
    ref,
    set,push,onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const db = getDatabase();
let authintication = getAuth();
let uid;
let credits;
let plan;
let type;
onAuthStateChanged(authintication, (user) => {
    if (user) {
        uid = authintication.currentUser.uid;

        console.log(uid)

        onValue(ref(db, '/credits/' + uid), (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot)
                credits = snapshot.val().credits;
                plan = snapshot.val().plan;
                type = snapshot.val().type;
                document.getElementById("plan").innerHTML="Plan : "+plan;
                document.getElementById("credits").innerText="Credits Balance : "+credits;
                document.getElementById("type").innerText="Type : "+ type;

            }
            document.getElementById("LoadingOverlay").style.display = "none";
            document.getElementById("loading").style.display = "none";
        })

        onValue(ref(db, '/user/' + uid+'/transactions'), (snapshot) => {

            if(snapshot.exists()){
                const data = snapshot.val();
                let count=0;
                for (let Obj in data) {
                    let transactionID = Obj;
                    let note = data[Obj]['note'];
                    let transaction = "Unknown";
                    let tcolour = "blue";
                    console.log(note)
                    if(/CERTIFICATE:/gm.test(note)){
                        transaction = "-1";
                        tcolour = "red";
                    }
                    else if(/EVENT:/gm.test(note)){
                        transaction = "-250";
                        tcolour = "red";
                    }
                    else if(/PURCHASE:/gm.test(note)){
                        console.log(note)
                        transaction = data[Obj]['transaction'].toString();
                        console.log(transaction)
                        tcolour = "green";
                    }
                    else{
                        transaction = "0";
                    }
                    let row = "<div class='entry'>"+"<div class='entryInfo'>"+"<h3>"+"Transaction ID : "+ Obj +"</h3>" +"<h4>"+ data[Obj]['note'] +"</h4>"
                        +"<h4>"+ data[Obj]['date'] +"</h4>"
                        +"</div><button style= 'background-color:"+tcolour+"!important;' class='tchange tbalance buttonMain'> Change <br>"+transaction+"</button>" +
                        "<button  class='tbalance  buttonMain'> Balance <br>"+data[Obj]['balance']+"</button>"
                    document.getElementById("issuesData").innerHTML += row;
                count +=1;
                }
                document.getElementById("issuesData").scrollTop = -(210*count);
                console.log(count)
            }
        })

    } else window.location.replace("login.html");
});







document.getElementById("backButton").addEventListener("click", function() {
    window.location.replace("home.html");
});
