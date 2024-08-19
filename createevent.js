// noinspection NpmUsedModulesInstalled

import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
    getDatabase,
    ref as refDB,
    set,push,onValue,update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const db = getDatabase();
let authintication = getAuth();
let issuerID;
onAuthStateChanged(authintication, (user) => {
    if (user) {
        issuerID = authintication.currentUser.uid;
        console.log(issuerID);
    } else window.location.replace("login.html");
});

let res1;
document.getElementById("uploadTemplate").addEventListener("change",async () => {
    const [file] = document.getElementById("uploadTemplate").files;
    if (file) {
        const previewBlock = document.getElementById("previewImg");
        let img1 = URL.createObjectURL(file);
        res1 = await imageResize(img1, {format: "jpeg", width: 1280, height: 720,bgColor:"#ffffff",outputType:"blob"});
        previewBlock.src = URL.createObjectURL(res1);
    } else {
        const previewBlock = document.getElementById("previewImg");
        previewBlock.src = "icons/previewMessage.png";
    }
})
let res2;
document.getElementById("uploadLogo").addEventListener("change",async () => {
    const [file] = document.getElementById("uploadLogo").files;
    if (file) {
        const previewBlock = document.getElementById("previewLogo");
        let img2=URL.createObjectURL(file);
        res2 = await imageResize(img2, {format: "webp", width: 350, height: 197,bgColor:"#ffffff",outputType:"blob"});
        previewBlock.src = URL.createObjectURL(res2);
    } else {
        const previewBlock = document.getElementById("previewLogo");
        previewBlock.src = "icons/previewMessage.png";
    }
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


const database = getDatabase();

const storage = getStorage();
function checkfill(){
    let eventname = document.getElementById("eventName").value;
    let eventdate=document.getElementById("eventdate").value;
    let eventlink=document.getElementById("eventLink").value;
    let eventabout=document.getElementById("aboutEvent").value;

    let remarksize=document.getElementById("Rsize").value;
    let remarkx=document.getElementById("Rx").value;
    let remarky=document.getElementById("Ry").value;
    let remarkwidth=document.getElementById("Rwidth").value;

    let namesize=document.getElementById("Nsize").value;
    let namex=document.getElementById("Nx").value;
    let namey=document.getElementById("Ny").value;

    let qrsize=document.getElementById("qrsize").value;
    let qrx=document.getElementById("QRx").value;
    let qry=document.getElementById("QRy").value;


    let datesize=document.getElementById("Dsize").value;
    let datex=document.getElementById("Dx").value;
    let datey=document.getElementById("Dy").value;

    if((eventname!==null && eventname!=="")&&
        (eventdate!==null && eventdate!=="")&&
        (eventlink!==null && eventlink!=="")&&
        (eventabout!==null && eventabout!=="")&&
        (remarksize!==null && remarksize!=="")&&
        (remarkx!==null && remarkx!=="")&&
        (remarky!==null && remarky!=="")&&
        (remarkwidth!==null && remarkwidth!=="")&&
        (namesize!==null && namesize!=="")&&
        (namex!==null && namex!=="")&&
        (namey!==null && namey!=="")&&
        (qrsize!==null && qrsize!=="")&&
        (qrx!==null && qrx!=="")&&
        (qry!==null && qry!=="")&&
        (datesize!==null && datesize!=="")&&
        (datex!==null && datex!=="")&&
        (datey!==null && datey!=="")&&
        (document.getElementById("uploadTemplate").files.length!==0)&&
        (document.getElementById("uploadLogo").files.length!==0)){
        return 1;
    }
    else{
        return 0;
    }

}

document.getElementById("submit").addEventListener("click", function() {
    if(checkfill()) {
        onValue(refDB(db, '/credits/' + issuerID), (snapshot) => {
            let credits = snapshot.val().credits;
            let plan = snapshot.val().plan;
            if (((credits >= 250) || (plan === "STANDARD")) && (plan !== "NOT ACTIVE")) {
                swal({
                    title: "Creating Event ",
                    text: "Event once created can't be edited, Check before submission.",
                    buttons: ["wait", "Go"],
                    closeOnClickOutside: false
                }).then((userInput) => {
                    if (userInput) {
                        const eid = document.getElementById("eventName").value + " -- " + Date.now().toString(36)
                        document.getElementById("main").style.display = "none";
                        document.getElementById("LoadingOverlay").style.display = "block";
                        document.getElementById("loading").style.display = "block";
                        let result = 0
                        const file1 = document.querySelector("#uploadTemplate").files[0];
                        const name1 = +new Date() + "- LOGO -" + issuerID + "-" + eid + ".jpeg";
                        const ref1 = ref(storage, "certificate_templates/" + issuerID + "/" + name1);
                        const metadata1 = {
                            contentType: "jpeg", type: "image/jpeg"
                        };

                        const file2 = document.querySelector("#uploadLogo").files[0];
                        const name2 = +new Date() + "- TEMP -" + issuerID + "-" + eid + ".jpeg";
                        const ref2 = ref(storage, "event_logo/" + issuerID + "/" + name2);
                        const metadata2 = {
                            contentType: "webp", type: "image/webp"
                        };
                        uploadBytes(ref1, res1, metadata1).then((snapshot) => {
                            uploadBytes(ref2, res2, metadata2).then((snapshot) => {
                                getDownloadURL(ref1).then((url1) => {
                                    let error = 0;
                                    getDownloadURL(ref2).then((url2) => {

                                        set(refDB(database, 'user/' + issuerID + "/events/" + eid), {
                                            name: document.getElementById("eventName").value,
                                            about: document.getElementById("aboutEvent").value,
                                            date: document.getElementById("eventdate").value,
                                            image: url2,
                                            link: document.getElementById("eventLink").value,

                                            certificatetemplate: {
                                                name: {
                                                    colour: document.getElementById("Ncolour").value,
                                                    size: document.getElementById("Nsize").value,
                                                    posx: document.getElementById("Nx").value,
                                                    posy: document.getElementById("Ny").value,
                                                    font: document.getElementById("Nfont").value
                                                },
                                                remark: {
                                                    colour: document.getElementById("Rcolour").value,
                                                    size: document.getElementById("Rsize").value,
                                                    posx: document.getElementById("Rx").value,
                                                    posy: document.getElementById("Ry").value,
                                                    width: document.getElementById("Rwidth").value,
                                                    font: document.getElementById("Rfont").value
                                                },
                                                qr: {
                                                    size: document.getElementById("qrsize").value,
                                                    posx: document.getElementById("QRx").value,
                                                    posy: document.getElementById("QRy").value
                                                },
                                                image: url1,
                                                date: {
                                                    size: document.getElementById("Dsize").value,
                                                    colour: document.getElementById("Dcolour").value,
                                                    posx: document.getElementById("Dx").value,
                                                    posy: document.getElementById("Dy").value
                                                },
                                                cIDColour: document.getElementById("Ccolour").value

                                            }

                                        }).then(() => {
                                            console.log("done!");
                                            if (plan !== "STANDARD") {
                                                update(refDB(db, "credits/" + issuerID + "/"), {credits: credits - 250});
                                                let key1 = push(refDB(db, "user/" + issuerID + "/transactions/")).then((keyData1) => {
                                                    let keylocation = keyData1._path.pieces_[3]
                                                    let date = new Date();
                                                    const dd = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
                                                    const mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
                                                    const yy = date.getFullYear();
                                                    const h = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
                                                    const m = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
                                                    const ss = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();

                                                    let current = dd + "/" + mm + "/" + yy + "@" + h + ":" + m + ":" + ss;
                                                    set(refDB(db, "user/" + issuerID + "/transactions/" + keylocation), {
                                                        note: "EVENT: Created named " + eid,
                                                        date: current,
                                                        balance: credits - 250
                                                    })
                                                })
                                            }
                                            swal({
                                                title: "Event Created ",
                                                text: "Event Created Successfully and accessible from organiser portal \n Use issue certificate option to issue certificates for this event ",
                                                icon: "success",
                                                closeOnClickOutside: false,
                                                button: "OK"
                                            }).then(() => {
                                                window.location.replace("home.html")
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    }

                })
            } else {
                swal({
                    title: "Event Creation Fails ",
                    text: "Reasons Could Be : \n 1. NO ACTIVE PlAN \n 2. Trial Plan Fully Used \n 3. Insufficient Credits  \n\n OR Use Help & Support  ",
                    buttons: ["back", "Check Account"],
                    closeOnClickOutside: false
                }).then((userInput) => {
                    if (userInput) {
                        window.location.replace("transactions.html")
                    }
                })
            }
        })
    }
    else{
        swal({
            title: "Missing Fields",
            icon:"info",
            text: "Incomplete fields! Fill all the fields before creating event",
            button: "ok",
            closeOnClickOutside: false
        })
    }
});

