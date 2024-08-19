import { getAuth,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


document.getElementById("sendlink").addEventListener("click", function() {
    let email = document.getElementById("emailre").value;

    if (email !== "" && email !== undefined && email !== null) {
        let authintication = getAuth();

        sendPasswordResetEmail(authintication,email).then(()=>{
            swal({
                title: "Reset Mail Sent",
                text: "Password Reset link sent to email. Use it to reset password",
                icon: "success",
                button: "Ok",
                closeOnClickOutside: false
            }).then(()=>{
                window.location.replace("index.html")
            })
        }).catch((error)=>{
            swal({
                title: "Not Sent",
                text: "Email not sent. \n This could be because no account with provided email or typo in email please check",
                icon: "error",
                button: "Ok",
                closeOnClickOutside: false
            })
        });
    }
    else{
        swal({
            title: "Enter Mail",
            text: "Email field is blank enter registered email",
            icon: "info",
            button: "Ok",
            closeOnClickOutside: false
        })
    }
});