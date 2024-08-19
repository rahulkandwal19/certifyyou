document.getElementById("closeButton").disabled=true;
document.getElementById("closeButton").style.visibility="hidden";
//---------------------------------------------------------
function search() {
    let cid = document.getElementById("searchInput").value;
    window.location.href = "verify.html?credentialID=" + cid;
}
//---------------------------------------------------------

function openMenu() {
    document.getElementById("scannerSection").style.height= "100vh";
    document.getElementById("closeButton").disabled=false;
    document.getElementById("closeButton").style.visibility="visible";

}

function closeMenu() {
    document.getElementById("scannerSection").style.height= "0%";
    document.getElementById("closeButton").disabled=true;
    document.getElementById("closeButton").style.visibility="hidden";
    document.getElementById("scanappCredits").disabled=true;
    document.getElementById("scanappCredits").style.display="hidden";
}
//---------------------------------------------------------
function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(
    function () {
    // If found you qr code
    function onScanSuccess(decodeText) {
        if(/https:\/\/certifyyou.tech\/verify.html?/gm.test(decodeText)) {
            window.location.href = decodeText;
        }
        else{
            swal({
                title: "This is not issued with Certifyyou.tech",
                text: "Not issued using certifyyou.tech ! \n We dont certify this certificate to be authentic. \n\n Still you can visit external link.  \n Note- You are leaving this platform and visiting external link.",
                buttons: ["back","Visit external link"],
                closeOnClickOutside: false
            }).then((userInput) => {
                if(userInput) {
                    window.location.href = decodeText;
                }
            })
        }
    }
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 ,qrbox: {width: 250, height: 250}  }
    );
    htmlscanner.render(onScanSuccess);
});
//---------------------------------------------------------