import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, onValue, push,set,update} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let authintication = getAuth();
const db = getDatabase();
let uid = "N/A";
onAuthStateChanged(authintication, (user) => {
    if (user) {
        uid = authintication.currentUser.uid;
        onValue(ref(db, '/user/' + uid+"/events/"), (snapshot) => {
            if (snapshot.exists()) {
                const values = snapshot.val();
                console.log(values);
                for(let eventObj in values){
                    let option = "<option>"+eventObj+"</option>";
                document.getElementById("event").innerHTML+= option;
                }
                document.getElementById("LoadingOverlay").style.display="none";
                document.getElementById("loading").style.display="none";
            }
            else{
                swal({
                    title: "No Event Found",
                    text: "No event is created in your account",
                    icon: "info",
                    button: "back",
                    closeOnClickOutside: false
                }).then(()=>{
                    window.location.replace("home.html");
                })
            }
        })

    } else window.location.replace("login.html");
})



document.getElementById("backButton").addEventListener("click", function() {
    swal({
        title: "Want to Go Back ?",text:"Current progress will be lost !",
        buttons: ["No","Yes"],
        dangerMode: true,
        closeOnClickOutside: false
    }).then((userInput) => {
        if (userInput) {
            window.location.replace("home.html");
        }
    })
});

function checkfill(){
    let name = document.getElementById("name").value;
    let email=document.getElementById("email").value;
    let remark=document.getElementById("remark").value;
    let addNotes=document.getElementById("addNotes").value;
    console.log(name)
    console.log(email)
    console.log(remark)
    console.log(addNotes)

    if((name!==null && name!=="")&&
        (email!==null && email!=="")&&
        (remark!==null && remark!=="")&&
        (addNotes!==null && addNotes!=="")
        ){
        return 1;
    }
    else{
        return 0;
    }

}

document.getElementById("submit").addEventListener("click", function () {
    if(checkfill()) {
        onValue(ref(db, '/credits/' + uid), (snapshot) => {
            let credits = snapshot.val().credits;
            let plan = snapshot.val().plan;

            let eventId = document.getElementById("event").value;
            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;
            let remark = document.getElementById("remark").value;
            let addNotes = document.getElementById("addNotes").value;
            let date = new Date();
            const dd = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
            const mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
            const yy = date.getFullYear();
            let iDate = dd + "/" + mm + "/" + yy;
            if ((credits > 0) || (plan === "STANDARD") && (plan !== "NOT ACTIVE")) {
                swal({
                    title: "Issuing Certificate",
                    text: "Issuing Certificate to " + name + " \n  with eMail :  " + email + " \nfor " + eventId,
                    icon: "info",
                    buttons: ["back", "ok"],
                    closeOnClickOutside: false
                }).then((userInput) => {
                    if (userInput) {
                        let iID = "Unknown";
                        const key = push(ref(db, 'certificates')).then((keyData) => {
                            let keylocation = keyData._path.pieces_[1];
                            iID = keylocation;
                            set(ref(db, "certificates/" + keylocation), {
                                additionalNote: addNotes,
                                eventID: eventId,
                                issueDate: iDate,
                                issuerID: uid,
                                name: name,
                                remark: remark
                            }).then(() => {
                                set(ref(db, "user/" + uid + "/events/" + eventId + "/issue/" + keylocation), {
                                    name: name,
                                    email: email
                                });
                            }).then(() => {
                                update(ref(db, "credits/" + uid + "/"), {credits: credits - 1});
                            }).then(() => {
                                let key1 = push(ref(db, "user/" + uid + "/transactions/")).then((keyData1) => {
                                    let keylocation = keyData1._path.pieces_[3]
                                    let date = new Date();
                                    const dd = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
                                    const mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
                                    const yy = date.getFullYear();
                                    const h = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
                                    const m = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
                                    const ss = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();

                                    let current = dd + "/" + mm + "/" + yy + "@" + h + ":" + m + ":" + ss;
                                    set(ref(db, "user/" + uid + "/transactions/" + keylocation), {
                                        note: "CERTIFICATE: Issued with ID " + iID,
                                        date: current,
                                        balance: credits - 1
                                    })
                                })
                            }).then(() => {
                                swal({
                                    title: "Success",
                                    text: "Certificate Successfully issued to " + name + " \n with Credential ID :  " + keylocation,
                                    icon: "success",
                                    button: "CopyLink",
                                    closeOnClickOutside: false
                                }).then(() => {
                                    console.log("userInput");
                                    navigator.clipboard.writeText("https://certifyyou.tech/verify.html?credentialID=" + keylocation).then(() => {
                                        swal({
                                            title: "Link Copied",
                                            text: "Share Link With Participant",
                                            button: "OK",
                                            closeOnClickOutside: false
                                        }).then(() => {
                                            window.location.replace("home.html")
                                        })
                                    })
                                })

                            });
                        });
                    }
                });
            } else {
                swal({
                    title: "Issue Fail",
                    text: "You are out of credits, Buy Credits \n Contact Support for help or paid plans",
                    icon: "error",
                    buttons: ["Later", "Get"],
                    closeOnClickOutside: false
                }).then((userInput) => {
                    if (userInput) {
                        window.location.replace("plans.html");
                    } else window.location.replace("home.html");
                })
            }
        });
    }
    else{
        swal({
            title: "Missing Fields",
            icon:"info",
            text: "Incomplete fields! Fill all the fields before creating event",
            button: "ok",
            closeOnClickOutside: false
        }).then(()=>{
        })
    }
});




