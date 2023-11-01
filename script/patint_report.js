
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
const searchName=()=>{


  const pName = $('#doctorSelect').val();
  
  const firestore = firebase.firestore();
      firestore
          .collection('doctors').where("firstName", "==", pName).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.id contains the document ID
              const data = doc.data();
              $("#addr").val(doc.id);
              $("#bd").val(data.specialization);
              $("#age").val(data.phone);
              $("#num").val(data.email);
              
            });
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
}


const loadTable=()=>{
  searchName();

  $('#search-table-body').empty();
  const pName = $('#doctorSelect').val();
  
  const db = firebase.firestore();
  const appointmentsCollection = db.collection("appoinment");

  appointmentsCollection.where("doctorName", "==", pName).get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // Handle each appointment document here
      const appointmentData = doc.data();
      const row = `
          <tr>
              <td>${doc.id}</td>
              <td>${appointmentData.patientName}</td>
              <td>${appointmentData.date}</td>
              <td>${appointmentData.room}</td>
              
              
          </tr>
          `;
          $('#search-table-body').append(row);

          const count = querySnapshot.size;
          // Update the HTML element with the document count
          $('#ttlAppo').val(count);

    });
    myFunction();
  })
.catch((error) => {
  console.error("Error: ", error);
});

}

// ===============Appo count===================


// ======================button hide=============
function myFunction() {
  var x = document.getElementById("ptintBtn");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// =================================================
const printBtn=()=>{
  window.open(`patient_print.html?name=${$('#doctorSelect').val()}`);
}