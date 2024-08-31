let list = document.getElementById("list");
let filterInput = document.getElementById("filterInput");
let token = localStorage.getItem('userToken');
let orgs = {};



axios.get('http://localhost:3000/user/getUserHome', {headers: {"authorization": token}})
.then((data)=>{
    let charities = data.data.data;
    console.log(charities);

    function createListelement(i){
        let listItem = document.createElement("li");
        //anchorElement.href = "userHomeOrg.html";
        listItem.className = "name";
        listItem.textContent = i.name;
        list.appendChild(listItem);

        listItem.addEventListener("click", ()=>{
            let url = `http://localhost:3000/user/charityInfo?name=${i.name}`;
            axios.get(url)
            .then((data)=>{
                localStorage.setItem("orgInfoToken", data.data.token);
                window.location.href = "../details/details.html";
            }).catch((err)=>{
                console.log(err);
            })
        } )

        
    }

   
    

    for(let i=0;i<charities.length;i++){
        orgs[charities[i].id] = charities[i].name;
        //console.log(orgs);
        createListelement(charities[i]);
    }

    axios.get('http://localhost:3000/user/getdonations', {headers: {"authorization": token}})
    .then((data)=>{
        let arrayOfDonations = data.data.donations
        console.log(arrayOfDonations, orgs)

            function displayElement(donation){
            let organisationId = donation.orgId;
            let amount = donation.amount;
            let date = donation.date.substr(0,15);
            let organisation = orgs[organisationId];
            
            let donationHistory = document.getElementById("history");

            let donationEle = document.createElement("li");
            donationEle.textContent = `Charity:  ${organisation}----------------Amount:   ${amount}----------------Date:    ${date}`;
            donationHistory.appendChild(donationEle);

        }

        if(arrayOfDonations.length === 0){
            document.getElementById("show").style.display = "none"
        }
        else{
            document.getElementById("show").style.display = "block"
            for(let i=0;i<arrayOfDonations.length;i++){
                displayElement(arrayOfDonations[i]);
            }
        }
        
    })
    .catch(err=>console.log(err))
    
})
.catch((err=>{
    console.log(err);
}))

filterInput.addEventListener('input', function(){
    const listItems = document.querySelectorAll('li');
    const filterValue = filterInput.value.toLowerCase();
    listItems.forEach(function(item){
        const text = item.innerText.toLowerCase();
        if (text.includes(filterValue)){
            item.classList.remove('hidden');
        }
        else{
            item.classList.add('hidden');
        }
    })
})

//console.log(orgs);



function displaylinks(data){
    let linkContainer = document.getElementById('urlEntries');
    let linkElement = document.createElement("li");
    linkContainer.appendChild(linkElement);
    let entry = document.createElement("a");
    entry.href = data.url;
    entry.textContent = data.filename;
    entry.download;
    linkElement.appendChild(entry);

}



document.getElementById("download").onclick = async ()=>{
    await axios.get("http://localhost:3000/user/download",{headers: {"authorization": token}})
    .then((response)=>{
        console.log(response);
        if(response.data.message === "success"){
            document.getElementById('downloadError').textContent = "";
            console.log(response);

            let previouslyDownloaded = response.data.previouslyDownloaded;
            for(let i=0;i<previouslyDownloaded.length;i++){
                displaylinks(previouslyDownloaded[i]);
            }

            let a = document.createElement("a");
            a.href = response.data.url;
            a.download;
            a.click();
        }
        else if(response.data.message === "Not Authorized"){
            document.getElementById('downloadError').textContent = "Not Authorized!!";
        }
        else{
            document.getElementById('downloadError').textContent = "Please try again later!"
        }
    })
    .catch((err)=>{
        console.log(err);
        document.getElementById('downloadError').textContent = "Server Error!!!"
    })
    
    
    
}


document.getElementById("editButton").addEventListener("click", ()=>{
    window.location.href = "../edit/edit.html"
})