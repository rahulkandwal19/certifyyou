// noinspection NpmUsedModulesInstalled

import {getAuth,
    onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
    getDatabase,
    ref as refDB,
    set,push,onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const db = getDatabase();
let authintication = getAuth();
let issuerID;
let data;

let issuerName ;
onAuthStateChanged(authintication, (user) => {
    if (user) {
        issuerID = authintication.currentUser.uid;
        console.log(issuerID)
        onValue(refDB(db,"user/"+issuerID),(snapshot)=>{
            if(snapshot.exists() && snapshot.val().events !== undefined){
                issuerName = snapshot.val().info.name;
                data = snapshot.val().events;
                console.log(data)
                document.getElementById("Selection").innerHTML = "";
                for (let eventObj in data) {
                    let option = "<option>" + eventObj + "</option>";
                    document.getElementById("Selection").innerHTML += option;
                }

                document.getElementById("name").innerText = "Event Name : "+data[document.getElementById("Selection").value].name;
                document.getElementById("link").innerHTML = "Event Link :  <a href ='"+data[document.getElementById("Selection").value].link +"'><button id='eventLINK' class='buttonMain'>Visit Event</button></a>";
                document.getElementById("date").innerText = "Event Date : "+data[document.getElementById("Selection").value].date;
                document.getElementById("eventLogo").src = data[document.getElementById("Selection").value].image;
                let issues = data[document.getElementById("Selection").value].issue
                document.getElementById("issuesData").innerHTML = "";
                let count = 0;
                for (let eventObj in issues) {
                    console.log(eventObj)
                    //-------------------------------------------------------------------------------------------------
                    let eventName = data[document.getElementById("Selection").value].name;
                    let credentialID = eventObj;
                    let email = data[document.getElementById("Selection").value]["issue"][eventObj]['email'] ;
                    let name = data[document.getElementById("Selection").value]["issue"][eventObj]['name'] ;
                    let body = 'Dear '+name+',\n' +
                        '\n' +
                        'I hope this message finds you well.\n' +
                        '\n' +
                        'I am writing to submit my Certificate of Achievement for \n' + eventName + ' issued by ' + issuerName + '. \n\nYou can view & verify the certificate via the following link:\n'
                        + 'https://certifyyou.tech/verify.html?credentialID=' + credentialID + ' \n\n' +
                        'Thank you for your time and consideration. Should you require any additional information, please contact me. \n\n' +
                        'Yours sincerely, \n' +
                        issuerName + ' \n';
                    let mailto = "mailto:"+email+"?subject= Certificate for " + eventName + " &body=" + encodeURIComponent(body);


                    let row = "<div class='entry'>"+"<div class='entryInfo'>"+"<h5>"+"Participant Name : "+
                        data[document.getElementById("Selection").value]["issue"][eventObj]['name']+"</h5><h6>"+
                        "Crediential ID : "+eventObj +"</h6></div>"+"<a href='"+"https://certifyyou.tech/verify.html?credentialID="+
                        eventObj+"'>" +
                        "<a href = '"+mailto+"' ><button id='mail' class='visit buttonMain'> Send Mail </button></a>"
                        +"<a href='https://certifyyou.tech/verify.html?credentialID="+credentialID+"'><button class='visit buttonMain'> Visit </button></a>"+"</div>"
                    document.getElementById("issuesData").innerHTML += row;
                    count += 1;
                }
                document.getElementById("issuesData").scrollTop = - (170*count);
                //----------------------------------------------------------------------------------
                document.getElementById("LoadingOverlay").style.display = "none";
                document.getElementById("loading").style.display = "none";
            }
            else {
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
    });


document.getElementById("Selection").addEventListener("change", function() {
    document.getElementById("eventLogo").src = "icons/certificateLoading.gif";
    document.getElementById("name").innerText = "Event Name : "+data[document.getElementById("Selection").value].name;
    document.getElementById("link").innerHTML = "Event Link :  <a href ='"+data[document.getElementById("Selection").value].link +"'><button id='eventLINK' class='buttonMain'>Visit Event</button></a>";
    document.getElementById("date").innerText = "Event Date : "+data[document.getElementById("Selection").value].date;
    document.getElementById("eventLogo").src = data[document.getElementById("Selection").value].image;


    let issues = data[document.getElementById("Selection").value].issue
    console.log(issues)
    document.getElementById("issuesData").innerHTML = "";
    let count =0;
    for (let eventObj in issues) {
        let eventName = data[document.getElementById("Selection").value].name;
        let credentialID = eventObj;
        let email = data[document.getElementById("Selection").value]["issue"][eventObj]['email'] ;
        let name = data[document.getElementById("Selection").value]["issue"][eventObj]['name'] ;
        let body = 'Dear '+name+',\n' +
            '\n' +
            'I hope this message finds you well.\n' +
            '\n' +
            'I am writing to submit my Certificate of Achievement for \n' + eventName + ' issued by ' + issuerName + '. \n\nYou can view & verify the certificate via the following link:\n'
            + 'https://certifyyou.tech/verify.html?credentialID=' + credentialID + ' \n\n' +
            'Thank you for your time and consideration. Should you require any additional information, please contact me. \n\n' +
            'Yours sincerely, \n' +
            issuerName + ' \n';
        let mailto = "mailto:"+email+"?subject= Certificate for " + eventName + " &body=" + encodeURIComponent(body);


        let row = "<div class='entry'>"+"<div class='entryInfo'>"+"<h5>"+"Participant Name : "+
            data[document.getElementById("Selection").value]["issue"][eventObj]['name']+"</h5><h6>"+
            "Crediential ID : "+eventObj +"</h6></div>"+"<a href='"+"https://certifyyou.tech/verify.html?credentialID="+
            eventObj+"'>" +
            "<a href = '"+mailto+"' ><button id='mail' class='visit buttonMain'> Send Mail </button></a>"
            +"<a href='https://certifyyou.tech/verify.html?credentialID="+credentialID+"'><button class='visit buttonMain'> Visit </button></a>"+"</div>"
        document.getElementById("issuesData").innerHTML += row;
        count += 1;
    }
    document.getElementById("issuesData").scrollTop = - (170*count);
});


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

const database = getDatabase();


