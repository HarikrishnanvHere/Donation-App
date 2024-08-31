let logIn = document.getElementById("logInForm");
let messageElement = document.getElementById("message");
console.log(messageElement);
messageElement.style.display = "none";

function fetchLogInCredentials(e){
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let obj = {
        email,password
    }
    axios.post("http://localhost:3000/org/login",obj)
    .then((res)=>{
        alert(res.data.message);
        localStorage.setItem("orgToken", res.data.token);
        window.location.href = "../home/orgHome.html";
        
        
        // if(messageElement.textContent === "LogIn Successful"){
        //     alert ("login successful!!");
        //     
        // }

        
    })
    .catch(err=>{
        console.log(JSON.stringify(err));
        messageElement.style.display = "block";
        messageElement.textContent = err.message;
    })
}


logIn.addEventListener("submit",fetchLogInCredentials)