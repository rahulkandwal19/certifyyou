import {getAuth,
    onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
let authintication = getAuth();
let uid = "NEW USER (NOT SignedIn)";
onAuthStateChanged(authintication, (user) => {
    if (user) {
        uid = authintication.currentUser.uid;
    }
})
document.getElementById("send").addEventListener("click", function() {
        let mail = document.createElement('a');
        let body = 'Keep Only What You Want (Sales Team will contact you !)\n' +"Send Mail Using Registered Email (New Users may use any if don't created account yet) \n"+
            '\n' +
            '1. Need Standard Plan\n' +
            '2. Need Event Plan\n' +
            '3. Need Custom Plan\n' +
            '5. Purchase Credits(Number Required > 50)\n' +
            '6. Other Requirements (Enquire)\n' +
            '\n' +"User ID :"+uid+"\n"+
            "Contact Number(Speedy Response) : [Your Number]";
        mail.href = "mailto:certifyyou.info@gmail.com?subject=Placing Order / Enquiry &body=" + encodeURIComponent(body);
        mail.click();
}
);

