const createPatient=()=>{
    
    
    const temDoctor={
        firstName: $("#firstName").val(),
        inName: $("#inName").val(),
        availability:$("input[name='availability']:checked").val(),
        specialization: $("#specialization").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
    };
    if (!isValidUserData(temDoctor)) {
        Swal.fire("Error", "Please fill in all fields.", "error");
        return;
    }
    console.log(temDoctor);
    const database = firebase.firestore();
    database
      .collection('doctors')
      .add(temDoctor)
      .then((response)=>{
          console.log(response);
          alert('Doctor Registration Successfully!')
          loadDoctor();
          clearData();
    })
    .catch((error)=>{
        console.log(error);
        alert('Error')
        
    });
  
  }
  
  const loadDoctor=()=>{
      $('#table-body').empty();
  
      const firestore=firebase.firestore();
      firestore.collection('doctors').get().then((result)=>{
          result.forEach((records)=>{
              const data=records.data();
              const row = `
              <tr>
                  <td>${records.id}</td>
                  <td>${data.firstName}</td>
                  <td>${data.specialization}</td>
                  <td>${data.phone}</td>
                  <td>${data.availability}</td>
                  
                  <td style="display:flex; width:80px; text-align:center;">
                          <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')">Delete</button> |
                          <button class="btn btn-success btn-sm" onclick="updateData('${records.id}')">Update</button>
                  </td>
              </tr>
              `;
              $('#table-body').append(row);
          })
      })
  }
  doctorId=undefined;
  const updateData=(id)=>{
  
    doctorId=id;
      const firestore = firebase.firestore();
      firestore
          .collection('doctors')
          .doc(doctorId)
          .get().then((response)=>{
              if (response.exists) {
                  const data = response.data();
                  $("#firstName").val(data.firstName);
                  $("#inName").val(data.inName);
                  $("#availability").val(data.availability);
                  $("#specialization").val(data.specialization);
                  $("#email").val(data.email);
                  $("#phone").val(data.phone);
                    if (data.availability=="yes"){
                    $("#yes").prop("checked", true).val(data.availability); 
                    }
                    else{
                        ($("#no").prop("checked", true).val(data.availability));
                    }
                  
              }
          })
  
  }
  const updateRecord=()=>{
      if (doctorId){
  
          const firestore = firebase.firestore();
          firestore
              .collection('doctors')
              .doc(doctorId)
              .update({
                firstName: $("#firstName").val(),
                inName: $("#inName").val(),
                specialization: $("#specialization").val(),
                email: $("#email").val(),
                phone: $("#phone").val(),
                availability:$("input[name='availability']:checked").val(),
              }).then(()=>{
              doctorId=undefined;
              alert('Doctor Updating Successfully!')
              loadDoctor();
              clearData();
          })
      }
  }
  const deleteData=(id)=>{
      if (confirm('Are you sure?')){
          const firestore = firebase.firestore();
          firestore
              .collection('doctors')
              .doc(id)
              .delete()
              .then(()=>{
                  alert('Doctor deleting Successfully!')
                  
                  
                  // toastr.success('Deleted!', 'success!')
                  doctorId=undefined;
                  loadDoctor();
              })
      }
  }

// ======================================================
const clearData = () => {
    firstName.value = "";
    inName.value = "";
    specialization.value = "";
    email.value = "";
    phone.value = "";
  };
