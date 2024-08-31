let signUp = document.getElementById("signupForm");
let errorElement = document.getElementById("error");
errorElement.style.display = "none"


function signUpOrg(e){
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let goal = document.getElementById("goal").value;
    let mission = document.getElementById("mission").value;
    let target = document.getElementById("target").value;
    let obj = {
        name,email,password,goal,mission,target
    }
    console.log(obj);
    axios.post("http://localhost:3000/org/signup",obj)
    .then((res)=>{
        console.log(res);
        alert ("Registration Complete!");
        window.location.href = '../login/orgLogin.html'
    })
    .catch(err=> {
        errorElement.style.display = "block"
    });
}

signUp.addEventListener("submit",signUpOrg)
