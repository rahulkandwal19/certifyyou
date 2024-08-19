import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const db = getDatabase();
const auth = getAuth();


let credentialID="N/A";
let image = "";
const url = new URL(window.location.href);
const search = new URLSearchParams(url.search);
const sharemenu = document.createElement('div');
sharemenu.innerHTML = '<div class="share">\n' +
    '  <div id="whatsappDIV" class="card">\n' +
    '  <img id="watsapp" src="icons/whatsapp.png"></div>\n' +
    '  <div id="linkedinDIV" class="card">\n' +
    '  <img id="linkedin" src="icons/linkedin.png"></div>\n' +
    '  <div id="emailDIV" class="card">\n' +
    '  <img id="mail" src="icons/email.png"></div>\n' +
    '  <div class="card">\n' +
    '  <img id="instagram" src="icons/instagram.png"></div>\n' +
    '  <div id="copyDIV" class="card">\n' +
    '  <img id="copy" src="icons/copy.png"></div>\n' +
    '  <div id="telegramDIV" class="card">\n' +
    '  <img id="telegram" src="icons/telegram.png"></div>\n' +
    '  <div id="facebookDIV" class="card">\n' +
    '  <img id="facebook" src="icons/facebook.png"></div>\n' +
    '  <div id="xDIV" class="card">\n' +
    '  <img id="socialX" src="icons/twitter.png"></div>\n' +
    '  <div class="card">\n' +
    '  <img id="discord" src="icons/discord.png"></div>\n' +
    '  <div class="main_back"></div>\n' +
    '</div>\n'


credentialID = search.get("credentialID");

let issuerID = "N/A";
let eventID = "N/A";
let additionalNote = "N/A";
let aboutIssuer = "N/A";
let aboutIssuerLink = "N/A";
let aboutEvent = "N/A";
let aboutEventLink = "N/A";
let issuerlogo  = "N/A";
let issuerName = "N/A";
let eventlogo  = "N/A";
let eventName = "N/A";
let name="";
let issueDate="";
onValue(ref(db, '/certificates/' + credentialID), (snapshot) => {
    if (snapshot.exists()) {
        const values = snapshot.val();
        document.getElementById("name").innerText = values.name;
        name = values.name;
        document.getElementById("remark").innerText = values.remark;
        issueDate = values.issueDate;
        document.getElementById("date").innerText = values.issueDate;
        issuerID =  values.issuerID;
        eventID = values.eventID;
        additionalNote = values.additionalNote;

        onValue(ref(db, '/user/' + issuerID+'/info'), (snapshot) => {
            if (snapshot.exists()) {
                issuerName = snapshot.val().name;
                document.getElementById("issuedby").innerText = issuerName;
                aboutIssuerLink = snapshot.val().link;
                aboutIssuer = snapshot.val().about;
                issuerlogo  = snapshot.val().image;
                document.getElementById("issuerLogo").src = issuerlogo;

                let certificateTemplate="";
                onValue(ref(db, '/user/' + issuerID+"/events"+"/"+eventID), (snapshot) => {
                    if (snapshot.exists()) {
                        const evalues = snapshot.val();
                        document.getElementById("event").innerText = snapshot.val().name;
                        aboutEventLink = snapshot.val().link;
                        aboutEvent = snapshot.val().about;
                        eventlogo = snapshot.val().image;
                        eventName = snapshot.val().name;
                        certificateTemplate = snapshot.val().certificatetemplate;
                        console.log(certificateTemplate);
                        let data = {
                            cID : credentialID,
                            //console.log(cID);
                            name : values.name,
                            //console.log(name);
                            nameSize : certificateTemplate.name.size,
                            //console.log(nameSize);
                            nameX : certificateTemplate.name.posx,
                            //console.log(nameX);
                            nameY : certificateTemplate.name.posy,
                            //console.log(nameY);
                            nameColour : certificateTemplate.name.colour,
                            //console.log(nameColour);
                            nfont : certificateTemplate.name.font,
                            //console.log(nfont);

                            qrSize : certificateTemplate.qr.size,
                            //console.log(qrSize);
                            qrX : certificateTemplate.qr.posx,
                            //console.log(qrX);
                            qrY : certificateTemplate.qr.posy,
                            //console.log(qrY);


                            remark : values.remark,
                            //console.log(remark);
                            remarkSize : certificateTemplate.remark.size,
                            //console.log(remarkSize);
                            remarkColour : certificateTemplate.remark.colour,
                            //console.log(remarkColour);
                            remarkX : certificateTemplate.remark.posx,
                            //console.log(remarkX);
                            remarkY : certificateTemplate.remark.posy,
                            //console.log(remarkY);
                            remarkWidth : certificateTemplate.remark.width,
                            //console.log(remarkWidth);
                            rfont : certificateTemplate.remark.font,
                            //console.log(rfont);

                            date : values.issueDate,
                            //console.log(date);
                            dateSize : certificateTemplate.date.size,
                            //console.log(dateSize);
                            dateX : certificateTemplate.date.posx,
                            //console.log(dateX);
                            dateY : certificateTemplate.date.posy,
                            //console.log(dateY);
                            dateColour : certificateTemplate.date.colour,
                            //console.log(dateColour);
                            eColour : certificateTemplate.cIDColour,
                            //console.log(eColour);
                            image : certificateTemplate.image
                            //console.log(image);
                        };

                        /*let request="cID="+cID+"&name="+name+"&nameSize="+
                            nameSize+"&nameX="+nameX+ "&nameY="+nameY+
                            "&nameColour="+nameColour+ +"&qrSize="+qrSize+"&qrX="+qrX+
                            "&qrY="+qrY+"&remark="+remark+"&remarkSize="+remarkSize+
                            "&remarkColour="+remarkColour+"&remarkX="+remarkX+
                            "&remarkY="+remarkY+"&remarkWidth="+remarkWidth+
                            "&date="+date+"&dateSize="+dateSize+"&dateX="+dateX+
                            "&dateY="+dateY+"&dateColour="+dateColour+
                            "&dateColour="+dateColour+"&eColour="+eColour+
                            "&image="+image;*/

                        console.log(data);
                        let send = JSON.stringify(data);
                        console.log(send);

                        fetch('https://certifyyou.pythonanywhere.com/getimage',{method:'POST',
                            body: send })
                            .then((response) => {
                                return response.json();
                            })
                            .then((myJson) => {
                                console.log(myJson);
                                document.getElementById("certificate").src="data:image/jpeg;base64," + myJson.img;
                                image = myJson.img;
                            }
                            );
                    }
                });
            }
        });
        setTimeout(()=>{
            document.getElementById("overlay").style.display="none";
        },1000);

    } else {
        window.location.replace("invalid.html");
    }
});

function openMenu() {
    document.getElementById("menu").style.width= "100vw";
}

function closeMenu() {
    document.getElementById("menu").style.width = "0%";
}

document.getElementById("moreInfo").addEventListener(("click"),()=>{
    swal({
        title: "Additional Notes",
        text:additionalNote,
        button: "Ok",
    })
});

document.getElementById("share").addEventListener(("click"),()=> {
    swal({
        title: "Share Certificate",
        content: sharemenu,
        buttons: ["back", "Download"],
        closeOnClickOutside: false
    }).then((yes) => {
        if (yes) {
            let download = document.createElement('a');
            download.href = "data:image/jpeg;base64," + image;
            console.log(image)
            download.download = "certificate.jpeg";
            download.click();
        }
    })

    document.getElementById("copyDIV").addEventListener(("click"), () => {
        navigator.clipboard.writeText("https://certifyyou.tech/verify.html?credentialID=" + credentialID).then(() => {
            swal({
                title: "Link Copied",
                text: "Certificate link copied successfully \n Share link to any platform",
                button: "OK",
                closeOnClickOutside: false
            })
        });
    });


    document.getElementById("emailDIV").addEventListener(("click"), () => {
        let mail = document.createElement('a');
        let body = 'Dear [Recipient’s Name],\n' +
            '\n' +
            'I hope this message finds you well.\n' +
            '\n' +
            'I am writing to submit my Certificate of Achievement for \n' + eventName + ' issued by ' + issuerName + '. \n\nYou can view & verify the certificate via the following link:\n'
            + 'https://certifyyou.tech/verify.html?credentialID=' + credentialID + ' \n\n' +
            'Thank you for your time and consideration. Should you require any additional information, please contact me. \n\n' +
            'Yours sincerely, \n' +
            name + ' \n' +
            '[Your Contact Information]';
        mail.href = "mailto:?subject= Submission of certificate for your consideration related to " + eventName + " &body=" + encodeURIComponent(body);
        mail.click();
    });

    document.getElementById("whatsappDIV").addEventListener(("click"), () => {
        let whatsapp = document.createElement('a');
        let text = "Hello,\n" +
            "\n" +
            "Delighted to share about my achievement.\n" +
            "\n" +
            "Here’s my Certificate of Achievement for " + eventName + ": \n" + 'https://certifyyou.tech/verify.html?credentialID=' + credentialID + "\n" +
            "\n" +
            "Thanks!";
        whatsapp.href = "https://wa.me/?text=" + encodeURIComponent(text);
        whatsapp.click();
    });

    document.getElementById("linkedinDIV").addEventListener(("click"), () => {
        let linkedin = document.createElement('a');
        let url = encodeURIComponent('https://certifyyou.tech/verify.html?credentialID='+credentialID);
        linkedin.href =    'https://www.linkedin.com/profile/add?startTask='+'CERTIFICATION_NAME&name=' + eventName + '%20Certificate&organizationName=' + 'Google' + '&issueYear='+ yy +
            '&issueMonth='+mm+'%20&certUrl=' +url+'&certId=' + credentialID;
        linkedin.click();
    });
    document.getElementById("facebookDIV").addEventListener(("click"), () => {
        let facebook = document.createElement('a');
        let url = encodeURIComponent('https://certifyyou.tech/verify.html?credentialID='+credentialID);
        facebook.href = "https://www.facebook.com/sharer/sharer.php?u="+url;
        facebook.click();
    });

    document.getElementById("telegramDIV").addEventListener(("click"), () => {
        let telegram = document.createElement('a');
        let url = encodeURIComponent('https://certifyyou.tech/verify.html?credentialID='+credentialID);
        telegram.href = "https://t.me/share/url?url="+url+"&text="+encodeURIComponent("Hello,\n" +
            "\n" +
            "Delighted to share about my achievement.\n" +
            "\n" +
            "Here’s my Certificate of Achievement for " + eventName + ": \n" +
            "\n" +
            "Thanks!");
        telegram.click();
    });

    document.getElementById("xDIV").addEventListener(("click"), () => {
        let x = document.createElement('a');
        let url = encodeURIComponent('https://certifyyou.tech/verify.html?credentialID='+credentialID);
        x.href = "https://twitter.com/share?url="+url+"&text="+encodeURIComponent("Hello,\n" +
            "\n" +
            "Delighted to share about my achievement.\n" +
            "\n" +
            "Here’s my Certificate of Achievement for " + eventName + ": \n" +
            "\n" +
            "Thanks!");
        x.click();
    });
});

document.getElementById("aboutIssuer").addEventListener(("click"),()=> {
    swal({
        html:true,
        title: "About Issuer",
        icon: issuerlogo,
        text: issuerName+" :  "+ aboutIssuer,
        buttons: ["back", "Visit Issuer"]
    }).then((yes)=>{
        if (yes) {
            window.location.href = aboutIssuerLink;
        }
    })
});

document.getElementById("aboutEvent").addEventListener(("click"),()=> {
    swal({
        html:true,
        title: "About Event",
        icon: eventlogo,
        text: eventName+" :  "+ aboutEvent,
        buttons: ["back", "Visit Event"]
    }).then((yes)=>{
        if (yes) {
            window.location.href = aboutEventLink;
        }
    })
});



