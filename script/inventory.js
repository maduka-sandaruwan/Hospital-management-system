const addItem=()=>{

    const addItem={
        medicineName: $("#medicineName").val(),
        expDate: $("#expDate").val(),
        qty: $("#qty").val(),
        balanceQty:$("#qty").val(),
        unitPrice: $("#unitPrice").val(),
        
    };
    if (!isValidUserData(addItem)) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
    }
    const database = firebase.firestore();
    database
      .collection('medicine')
      .add(addItem)
      .then((response)=>{
          console.log(response);
          alert('Medicine Adding Successfully!')
          loadInventory();
          clearData();
  
    })
    .catch((error)=>{
        console.log(error);
        alert('Error')
        
    });
  
  }
  
  const loadInventory=()=>{
    clearData();
      $('#inventory-table-body').empty();
  
      const firestore=firebase.firestore();
      firestore.collection('medicine').get().then((result)=>{
          result.forEach((records)=>{
              const data=records.data();
              const row = `
              <tr>
                  <td>${data.medicineName}</td>
                  <td>${data.expDate}</td>
                  <td>${data.qty}</td>
                  <td>${data.balanceQty}</td>
                  <td>${data.unitPrice}</td>
                  
                  <td style="display:flex; width:80px; text-align:center;">
                          <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')">Delete</button> |
                          <button class="btn btn-success btn-sm" onclick="updateData('${records.id}')">Update</button>
                  </td>
              </tr>
              `;
              $('#inventory-table-body').append(row);
          })
      })
  }
  itemId=undefined;
  const updateData=(id)=>{
  
    itemId=id;
      const firestore = firebase.firestore();
      firestore
          .collection('medicine')
          .doc(itemId)
          .get().then((response)=>{
              if (response.exists) {
                const data = response.data();
                $("#medicineName").val(data.medicineName);
                $("#expDate").val(data.expDate);
                $("#qty").val(data.qty);
                $("#unitPrice").val(data.unitPrice);
                  
              }
          })
  
  }
//   const updateRecord=()=>{
//       if (itemId){



//           const firestore = firebase.firestore();
//           firestore
//               .collection('medicine')
//               .doc(itemId)
//               .update({
//                 medicineName: $("#medicineName").val(),
//                 expDate: $("#expDate").val(),
//                 qty: $("#qty").val(),
//                 unitPrice: $("#unitPrice").val(),
//               }).then(()=>{
//                 itemId=undefined;
                

//               alert('Item Updating Successfully!')
//               loadInventory();
//               clearData();
//           })
//       }
//   }
  const updateRecord=()=>{
    if (itemId){

        const firestore = firebase.firestore();
        firestore
                .collection('medicine')
                .doc(itemId)
                .get().then((response)=>{
                    if (response.exists) {
                        const data = response.data();
                        balanceQty=parseInt(data.balanceQty) + parseInt($("#qty").val());
                        firestore
                                .collection('medicine')
                                .doc(itemId)
                                .update({
                                    medicineName: $("#medicineName").val(),
                                    expDate: $("#expDate").val(),
                                    qty: $("#qty").val(),
                                    balanceQty:balanceQty,
                                    unitPrice: $("#unitPrice").val(),
                                }).then(()=>{
                                    itemId=undefined;
                                    

                                alert('Item Updating Successfully!')
                                loadInventory();
                                clearData();
                            })
                    }
                })
    }
}


  const deleteData=(id)=>{
      if (confirm('Are you sure?')){
          const firestore = firebase.firestore();
          firestore
              .collection('medicine')
              .doc(id)
              .delete()
              .then(()=>{
                  alert('Item deleting Successfully!')
                  
                  
                  // toastr.success('Deleted!', 'success!')
                  itemId=undefined;
                  loadInventory();
              })
      }
  }
// =================clear input field=====================================
const clearData = () => {
    medicineName.value = "";
    expDate.value = "";
    qty.value = "";
    unitPrice.value = "";
  };
// ================Qty Validation========================================
function qtyValidate(){
    if($("#qty").val() <= 0){
        qtyError.innerHTML = 'Invalid input'
        qty.value = "";
    }
    else{
        qtyError.innerHTML = ""    }
}