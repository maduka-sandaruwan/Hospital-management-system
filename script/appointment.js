// ====patient select==================================
const loadPatient=()=>{
    $('#patientSelect').empty();

    const firestore = firebase.firestore();
    firestore
          .collection('patient')
          .get()
          .then((records => {
                records.forEach((result)=>{
                  const option = $('<option></option>').val(result.data().firstName +" " +result.data().lastName).text(result.data().firstName +" "+ result.data().lastName);
                  $('#patientSelect').append(option);
                })
          }))

}
$('#patientSelect').on("change",function (){
  const patientSelect = $(this).val();
  alert("Selected Patient: " + patientSelect);


})

// ====doctor select==================================

const loadDoctor=()=>{
  $('#doctorSelect').empty();

  const firestore = firebase.firestore();
  firestore
        .collection('doctors')
        .get()
        .then((records => {
              records.forEach((result)=>{
                const option = $('<option></option>').val(result.data().firstName).text(result.data().firstName);
                $('#doctorSelect').append(option);
              })
        }))

}
$('#doctorSelect').on("change",function (){
  const doctorSelect = $(this).val();
  alert("Selected Doctor: " + doctorSelect);


})
// ====appointment pass database==================================

const createAppointment=()=>{
  
  
  const temAppo={
      patientName: $("#patientSelect").val(),
      doctorName: $("#doctorSelect").val(),
      date: $("#date").val(),
      start: $("#stime").val(),
      end: $("#etime").val(),
      room: $("#room").val(),
      payment: $("#payment").val(),
      
  };
  if (!isValidUserData(temAppo)) {
    Swal.fire("Error", "Please fill in all fields.", "error");
    return;
  }
  console.log(temAppo);
  const database = firebase.firestore();
  database
    .collection('appoinment')
    .add(temAppo)
    .then((response)=>{
        console.log(response);
        alert('Appointment Registration Successfully!')
        loadAppo();
        clearData();
  })
  .catch((error)=>{
      console.log(error);
      alert('Error')
      
  });

}

$('#sdate').on("change",function (){
      $('#appo-table-body').empty();
      const sdate = document.getElementById("sdate").value;
      const db = firebase.firestore();
      const appointmentsCollection = db.collection("appoinment");
    
      
      console.log(date);
      console.log("sdate",sdate);
  // Fetch relevant appointments
  appointmentsCollection.where("date", "==", sdate).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Handle each appointment document here
        const appointmentData = doc.data();
        // Populate your table with appointmentData
        console.log(appointmentData.patientName);
        const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${appointmentData.patientName}</td>
                <td>${appointmentData.doctorName}</td>
                <td>${appointmentData.date}</td>
                <td>${appointmentData.start}</td>
                <td>${appointmentData.end}</td>
                <td>${appointmentData.room}</td>
                <td>${appointmentData.payment}</td>
                <td style="display:flex; width:120px; text-align:center;">
                        <button class="col-10 btn btn-success btn-sm" onclick="createBill('${doc.id}')">Create Bill</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteData('${doc.id}')">Delete</button> 
                        
                </td>
            </tr>
            `;
            $('#appo-table-body').append(row);
      });
    })
    .catch((error) => {
      console.error("Error loading appointments: ", error);
    });

  })



const loadAppo=()=>{
      loadPatient();
      loadDoctor();
      
      $('#appo-table-body').empty();
      const db = firebase.firestore();
      const appointmentsCollection = db.collection("appoinment");
  // Fetch relevant appointments
  appointmentsCollection.get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Handle each appointment document here
        const appointmentData = doc.data();
        // Populate your table with appointmentData
        console.log(appointmentData.patientName);
        const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${appointmentData.patientName}</td>
                <td>${appointmentData.doctorName}</td>
                <td>${appointmentData.date}</td>
                <td>${appointmentData.start}</td>
                <td>${appointmentData.end}</td>
                <td>${appointmentData.room}</td>
                <td>${appointmentData.payment}</td>
                <td style="display:flex; width:120px; text-align:center;">
                        <button class="col-10 btn btn-success btn-sm" onclick="createBill('${doc.id}')">Create Bill</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteData('${doc.id}')">Delete</button> 
                        
                </td>
            </tr>
            `;
            $('#appo-table-body').append(row);
      });
    })
    .catch((error) => {
      console.error("Error loading appointments: ", error);
    });

  }

  const createBill=(id)=>{
    window.location.replace(`billing.html?id=${id}`);
    
  }          

  const deleteData=(id)=>{
    if (confirm('Are you sure?')){
        const firestore = firebase.firestore();
        firestore
            .collection('appoinment')
            .doc(id)
            .delete()
            .then(()=>{
                alert('Appointment deleting Successfully!')
                
                
                // toastr.success('Deleted!', 'success!')
                doctorId=undefined;
                loadAppo();
            })
    }
}
// =================clear input field=====================================
const clearData = () => {
  patientSelect.value = "";
  doctorSelect.value = "";
  date.value = "";
  stime.value = "";
  etime.value = "";
  room.value = "";
  payment.value = "";
};
// ==============================validation date==========
function validateDateOnChange(inputElement) {
  const selectedDate = new Date(inputElement.value);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1)

  if (selectedDate <= currentDate) {
    alert("Please select a future date.");
    inputElement.value = ''; // Clear the input field
  }
}





