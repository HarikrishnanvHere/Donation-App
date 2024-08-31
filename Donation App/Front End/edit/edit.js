let token = localStorage.getItem('userToken');
let editForm = document.getElementById("editForm");


axios.get('http://localhost:3000/user/editdetails', {headers: {"authorization": token}})
.then((data) =>{
    document.getElementById("name").value = data.data.name;
    document.getElementById("email").value = data.data.email;
    console.log(data.data);
})
.catch((err)=>{
    console.log(err)
})





function editUser(e){
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let obj = {
        name,email,password
    }
    axios.post("http://localhost:3000/user/saveedits",obj,  {headers: {"authorization": token}})
    .then((res)=>{
        console.log(res);
        alert ("Details saved!");
        window.location.href = '../userLogin/userLogin.html'
    })
    .catch(err=> {
        alert ("Failed to save! please try again!");
    });
}

editForm.addEventListener("submit",editUser)