let notApproved = document.getElementById("notApproved");
let approved = document.getElementById("approved");

notApproved.style.display = "none";
approved.style.display = "none";

let token = localStorage.getItem('orgToken');

axios.get('http://localhost:3000/org/getOrg', {headers: {"authorization": token}})
.then((data)=>{
    let obj = data.data.obj;
    console.log(obj)
    if(obj.registered == 0){
        notApproved.style.display = "block";
    }
    else{
        approved.style.display = "block";
        document.getElementById('name').textContent =`Hi, This is the official page of ${obj.name}`;
        document.getElementById('goal').textContent = obj.goal;
        document.getElementById('target').textContent = obj.target;
        document.getElementById('mission').textContent = obj.mission;
        document.getElementById('total').textContent = obj.total;
    }
})
.catch((err)=>{
    console.log(err);
})