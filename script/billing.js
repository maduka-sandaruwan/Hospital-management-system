// ====medicine select==================================
let bill=[];

const loadMedicine=()=>{
  clearData();
    $('#medicineSelect').empty();

    const firestore = firebase.firestore();
    firestore
          .collection('medicine')
          .get()
          .then((records => {
                records.forEach((result)=>{
                  const option = $('<option></option>').val(result.id).text(result.id);
                  $('#medicineSelect').append(option);
                })
          }))

}
medicineId=undefined;
$('#medicineSelect').on("change",function (){
  const medicineId = $(this).val();
  console.log(medicineId);
  const firestore = firebase.firestore();
    firestore
          .collection('medicine')
          .doc(medicineId)
          .get().then((response)=>{
            if (response.exists) {
              const data = response.data();
              console.log(data);
              $("#unitPrice").val(data.unitPrice);
              $("#mediName").val(data.medicineName);  
              $('#balQty').val(data.balanceQty);
            }
          })
})

$('#quantity').on("change",function (){
  const unitPrice=Number.parseInt($("#unitPrice").val());
  const quantity=Number.parseInt($("#quantity").val());
  if (quantity < 0){
    $('#total').val(" ");
  }else{
    const total = unitPrice*quantity;
    console.log(total);
    $('#total').val(total);
  }
  
});



const addToBill=()=>{
  const billObj={
     "discription":$('#mediName').val(),
     "quantity":$('#quantity').val(),
     "unitPrice":$('#unitPrice').val(),
     "total":$('#total').val(),
     

  }
  medicineBal();
  let medicineBalQty=parseInt(0);
  medicineBalQty=parseInt($('#balQty').val())-parseInt($('#quantity').val());
  if (medicineBalQty <= 0){
    Swal.fire("Error", "Please check medice quantity", "error");
    return;
  }
  bill.push(billObj);
  $('#billing-table-body').empty();

  bill.forEach(data=>{
    const row = `
              <tr>
                  <td>${data.discription}</td>
                  <td>${data.quantity}</td>
                  <td>${data.unitPrice}</td>
                  <td>${data.total}</td>
                  
                  
              </tr>
              `;
              $('#billing-table-body').append(row);
              
  });
  netTotal();
  
  clearData();
}

const addServiceToBill=()=>{
  const billObj={
     "discription":$('#services').val(),
     "unitPrice":$('#price').val(),
     "total":$('#price').val(),
     "quantity":"0",

  }
  bill.push(billObj);
  $('#billing-table-body').empty();

  bill.forEach(data=>{
    const row = `
              <tr>
                  <td>${data.discription}</td>
                  <td>${data.quantity}</td>
                  <td>${data.unitPrice}</td>
                  <td>${data.total}</td>
                  
                  
              </tr>
              `;
              $('#billing-table-body').append(row);
              
  });
  netTotal();
  clearData();
}

const netTotal=()=>{
  $('#net').empty();
  let ttl=parseInt(0);
  
  bill.forEach(data=>{
    ttl+=parseInt(data.total);
  });
  $('#net').val(ttl);
  const row = `
              <tr>
                  <th colspan="2"></th>
                  <th style="text-align: right;">Total Price</th>
                  <td>${ttl}</td> 
              </tr>
              `;
              $('#net').append(row);
  
  
}
// ===================bill save firestore ===========

const saveBill=()=>{
  const param ={};
  const queryParam = new URLSearchParams(window.location.search);
  const id = queryParam.get('id');
  
    const billDate = new Date().toISOString().split('T', 1)[0];
    const totalAmount = Number.parseInt($('#net').val());
    
    let obj={
      item:[],
    
    };
    
    const firestore = firebase.firestore();
    bill.forEach(data=>{
      obj.item.push(data)
      
    });
    firestore
        .collection('appoinment')
        .doc(id)
        .update({
          medicineItem: obj,
          totalAmount: totalAmount,
          biilDate: billDate,
          paidAmount:$('#paidAmount').val(),
          paymentMethod: $("#payment").val(),
          balance:$('#balance').val(),
        }).then(()=>{
        
        alert('Bill Saved Successfully!')
        myFunction();
        
  })

}

// ==========================balance==============

$('#paidAmount').on("change", function (){
  const fullTotal = $('#net').val();
  const paidAmo = $('#paidAmount').val();
  const balance = paidAmo-fullTotal;
  console.log(balance);
  $('#balance').val(balance);
  document.getElementById('balance').textContent = balance;
  if (balance < 0) {
    alert("Please Check Paid Amount");
    paidAmount.value = "";
  }

})

function myFunction() {
  var x = document.getElementById("ptintBtn");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
// ==============print bill===========================

const printBill=()=>{
  const param ={};
  const queryParam = new URLSearchParams(window.location.search);
  const id = queryParam.get('id');

  const firestore = firebase.firestore();
    firestore
          .collection('appoinment')
          .doc(id)
          .get()
          .then((response)=>{
            if (response.exists) {
              const data = response.data();
              console.log(response.id);
              window.open(`invoice.html?id=${response.id}`);
                
            }
          })
         

  
}
// ===============================================
const medicineBal=()=>{
  const medicineId=$('#medicineSelect').val();
  const quantity=Number.parseInt($("#quantity").val());
  
  const firestore = firebase.firestore();
      firestore
            .collection('medicine')
            .doc(medicineId)
            
            .get()
            .then((response)=>{
              if (response.exists) {
                const data = response.data();
                let medicineBal=parseInt(0);
                medicineBal=parseInt(data.balanceQty)-parseInt(quantity);
                if (medicineBal <= 0) {
                  // Swal.fire("Error", "Please check medice quantity", "error");
                  return;
                }
                else{
                    firestore
                    .collection('medicine')
                    .doc(medicineId)
                    .update({
                      balanceQty: medicineBal,
                      
                    })
                    .then(()=>{
                      
                    })
                }
                
                
                  
              }
            })        
}
// ======================================================
const clearData = () => {
  mediName.value = "";
  quantity.value = "";
  unitPrice.value = "";
  total.value = "";
  price.value = "";
  paidAmount.value = "";
  balQty.value = "";
};
// ================Qty Validation========================================
function qtyValidate(){
  if($("#quantity").val() <= 0){
      qtyError.innerHTML = 'Invalid input';
      quantity.value = "";
      
  }
  
  else{
      qtyError.innerHTML = "" 
    }
}
function priceValidate(){
  if ($("#price").val() <= 0){
    priceError.innerHTML = 'Invalid input';
    price.value = "";
  }
  else{
    priceError.innerHTML = "" 
    }
}
