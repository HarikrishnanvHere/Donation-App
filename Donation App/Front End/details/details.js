
let token2 = localStorage.getItem('orgInfoToken');
let token = localStorage.getItem('userToken');
let nameOfCharity;

let donateButton = document.getElementById('donateButton');

axios.get('http://localhost:3000/org/getOrg', {headers: {"authorization": token2}})
.then((data)=>{
    let obj = data.data.obj;
    console.log(obj);
    nameOfCharity = obj.name;
    document.getElementById('name').textContent = obj.name;
    document.getElementById('goal').textContent = obj.goal;
    document.getElementById('target').textContent = obj.target;
    document.getElementById('mission').textContent = obj.mission;
    
})
.catch((err)=>{
    console.log(err);
})

donateButton.onclick = async function (event) {

    let amount = document.getElementById("amount").value;
    
    const response = await axios.get("http://localhost:3000/purchase/purchasepremium", { headers: { "authorization": token, "amount": amount } })
    console.log(response);
    const options = {
        "key": response.data.key_id_,
        "order_id": response.data.order.id,
        "handler": async function (response) {
                //console.log(response);
                await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    name: nameOfCharity
                }, { headers: { "authorization": token } })
                .then((res)=>{
                    alert("Your Donation is successfully received!");
                    window.location.href = "../userHome/userHome.html"
                })
                .catch(err=>console.log(err));
                
                
             
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    event.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id // if transaction is failed no payment key is generated
            }, { headers: { "authorization": token } })
            .then((res)=>{
                alert('Transaction FAILED!');
            })
            
            
       
    });
}
