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
    set,push,onValue,update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const db = getDatabase();
let authintication = getAuth();
let issuerID;
let data;
let template;
onAuthStateChanged(authintication, (user) => {
    if (user) {
        issuerID = authintication.currentUser.uid;
        onValue(refDB(db, '/templates/'), (snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.val();
                for (let eventObj in data) {
                    let option = "<option>" + eventObj + "</option>";
                    document.getElementById("tempSelection").innerHTML += option;
                }
                template = data[document.getElementById("tempSelection").value];
                console.log(template);
                document.getElementById("previewImg").src= template.preview;
                document.getElementById("LoadingOverlay").style.display = "none";
                document.getElementById("loading").style.display = "none";
            }
        })
}else window.location.replace("login.html");
});
let res1;
document.getElementById("tempSelection").addEventListener("change",async () => {
    document.getElementById("previewImg").src= "icons/certificateLoading.gif";
    document.getElementById("tempSelection").value
    template = data[document.getElementById("tempSelection").value];
    document.getElementById("previewImg").src= template.preview;
    console.log(template);
})

document.getElementById("uploadLogo").addEventListener("change",async () => {
    const [file] = document.getElementById("uploadLogo").files;
    if (file) {
        const previewBlock = document.getElementById("previewLogo");
        let img2=URL.createObjectURL(file);
        res1 = await imageResize(img2, {format: "webp", width: 350, height: 197,bgColor:"#ffffff",outputType:"blob"});
        previewBlock.src = URL.createObjectURL(res1);
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


    if((eventname!==null && eventname!=="")&&
        (eventdate!==null && eventdate!=="")&&
        (eventlink!==null && eventlink!=="")&&
        (eventabout!==null && eventabout!=="")&&
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
        if( ((credits>=250) || (plan==="STANDARD")) && (plan !== "NOT ACTIVE")){
    swal({
        title: "Creating Event ",
        text:"Event once created can't be edited, Check before submission.",
        buttons: ["wait","Go"],
        closeOnClickOutside: false
    }).then((userInput) => {
        if (userInput) {
            const eid= document.getElementById("eventName").value +" -- "+ Date.now().toString(36)
            document.getElementById("main").style.display="none";
            document.getElementById("LoadingOverlay").style.display="block";
            document.getElementById("loading").style.display="block";
            let  result =0
            const name1 = +new Date() + "- LOGO -" + issuerID+"-"+eid+".jpeg";
            const ref1 = ref(storage,"event_logo/"+issuerID+"/"+name1);
            const metadata1 = {
                contentType: "webp",type:"image/webp"
            };
                uploadBytes(ref1,res1, metadata1).then((snapshot)=>{
                    getDownloadURL(ref1).then((url1)=>{
                        let error=0;
                        console.log(template);
                            set(refDB(database,'user/'+ issuerID+"/events/"+eid),{
                                name: document.getElementById("eventName").value,
                                about: document.getElementById("aboutEvent").value,
                                date: document.getElementById("eventdate").value,
                                image: url1,
                                link: document.getElementById("eventLink").value,

                                certificatetemplate: {
                                    name: {
                                        colour: template.name.colour,
                                        size: template.name.size,
                                        posx: template.name.posx,
                                        posy: template.name.posy,
                                        font: template.name.font
                                    },
                                    remark: {
                                        colour: template.remark.colour,
                                        size: template.remark.size,
                                        posx: template.remark.posx,
                                        posy: template.remark.posy,
                                        width : template.remark.width,
                                        font: template.remark.font
                                    },
                                    qr: {
                                        size: template.qr.size,
                                        posx: template.qr.posx,
                                        posy: template.qr.posy
                                    },
                                    image: template.image,
                                    date: {
                                        colour: template.date.colour,
                                        size: template.date.size,
                                        posx: template.date.posx,
                                        posy: template.date.posy
                                    },
                                    cIDColour:template.cColour
                                }

                            }).then(()=>{
                                console.log("done!");
                                if (plan !== "STANDARD") {
                                    update(refDB(db, "credits/" + issuerID + "/"), {credits: credits - 250});

                                    let key1 = push(refDB(db, "user/"+issuerID+"/transactions/")).then((keyData1) => {
                                        let keylocation = keyData1._path.pieces_[3]
                                        let date = new Date();
                                        const dd = date.getDate()<10?"0"+date.getDate().toString():date.getDate().toString();
                                        const mm = date.getMonth()+1<10?"0"+(date.getMonth()+1).toString():(date.getMonth()+1).toString();
                                        const yy = date.getFullYear();
                                        const h = date.getHours()<10?"0"+date.getHours().toString():date.getHours().toString();
                                        const m = date.getMinutes()<10?"0"+date.getMinutes().toString():date.getMinutes().toString();
                                        const ss = date.getSeconds()<10?"0"+date.getSeconds().toString():date.getSeconds().toString();

                                        let current = dd + "/" + mm + "/" + yy + "@"+h+":"+m+":"+ss;
                                        set(refDB(db, "user/"+issuerID+"/transactions/"+keylocation), {
                                            note:"EVENT: Created named "+eid,
                                            date : current,
                                            balance: credits-250
                                        })
                                    })
                                }
                                swal({
                                    title: "Event Created ",
                                    text: "Event Created Successfully and accessible from organiser portal \n Use issue certificate option to issue certificates for this event ",
                                    icon: "success",
                                    closeOnClickOutside: false,
                                    button:"OK"
                                }).then(()=>{window.location.replace("home.html")})

                            })
                        })
                    })
                }
    })}else{
            swal({
                title: "Event Creation Fails ",
                text:"Reasons Could Be : \n 1. NO ACTIVE PlAN  \n 2. Trial Plan Fully Used \n 3. Insufficient Credits  \n\n OR Use Help & Support  ",
                buttons: ["back","Check Account"],
                closeOnClickOutside: false
            }).then((userInput)=>{
                if(userInput){
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