let approvedSection = document.getElementById('approved');
let waitingSection = document.getElementById('waiting');
let textToSend = "Hi there!  we are happy to inform you that the registration of your Charity Organisation with our Website Has been successfully processed! "

axios.get('http://localhost:3000/admin/getInfo')
.then((data)=>{
    let arrayInfo = data.data.data;

    function approvedDisplay(entry){
        let listElement = document.createElement('li');
        listElement.textContent = `Name:  ${entry.name}------email:${entry.email}-------mission:  ${entry.mission}`;
        approvedSection.appendChild(listElement);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        approvedSection.appendChild(deleteButton);

        deleteButton.addEventListener("click", ()=>{
            axios.get('http://localhost:3000/admin/deleteInfo', {headers: {"id": entry.id}})
            .then((data)=>{
                approvedSection.removeChild(listElement);
                approvedSection.removeChild(deleteButton);
            })
            .catch(err=>console.log(err))
        })

       
    }

    function waitingDisplay(entry){
        let listElement = document.createElement('li');
        listElement.textContent = `Name:  ${entry.name}------email:    ${entry.email}-------mission:  ${entry.mission}`;
        waitingSection.appendChild(listElement);

        let approveButton = document.createElement("button");
        approveButton.textContent = "approve";
        waitingSection.appendChild(approveButton);

        let rejectButton = document.createElement("button");
        rejectButton.textContent = "Reject";
        waitingSection.appendChild(rejectButton);

        approveButton.addEventListener("click", ()=>{
            axios.get('http://localhost:3000/admin/approveInfo', {headers: {"id": entry.id}})
            .then((data)=>{
                waitingSection.removeChild(listElement);
                waitingSection.removeChild(approveButton);
                waitingSection.removeChild(rejectButton);
                approvedDisplay(entry);

                axios.get('http://localhost:3000/admin/sendmail', {headers: {"id": entry.id,  "text": textToSend}})
                .then((data)=>{
                    console.log(data);
                    alert("email sent!");
                })
                .catch(err=>console.log(err))

            })
            .catch(err=>console.log(err))
        })

        rejectButton.addEventListener("click", ()=>{
            axios.get('http://localhost:3000/admin/deleteInfo', {headers: {"id": entry.id}})
            .then((data)=>{
                waitingSection.removeChild(listElement);
                waitingSection.removeChild(approveButton);
                waitingSection.removeChild(rejectButton);
            })
            .catch(err=>console.log(err))
        })
    }
    
    
    
    
    function extractElements(entry){
        console.log(entry.isRegistered);
        if(entry.isRegistered ==true){
            approvedDisplay(entry);
        }
        else{
            waitingDisplay(entry);
        }
    }

    for(let i=0;i<arrayInfo.length;i++){
        extractElements(arrayInfo[i]);
    }
    console.log(arrayInfo);
})
.catch(err=>console.log(err))