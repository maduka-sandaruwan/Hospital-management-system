const loadData=()=>{
    searchName();
    

    $('#invoice-table-body').empty();
    const param ={};
    const queryParam = new URLSearchParams(window.location.search);
    const name = queryParam.get('name');
    console.log(name);
    const toDate = new Date().toISOString().split('T', 1)[0];
    console.log(toDate);
    $('#printdate').val(toDate);
    $('#name').val(name);
    $('#search-table-body').empty();
    
  
  const db = firebase.firestore();
  const appointmentsCollection = db.collection("appoinment");

  appointmentsCollection.where("doctorName", "==", name).get()
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
    print();
  })
.catch((error) => {
  console.error("Error: ", error);
});        
}
// ============================================
const searchName=()=>{


  const dName=$('#name').val();
  const firestore = firebase.firestore();
      firestore
          .collection('doctors').where("firstName", "==", dName).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.id contains the document ID
              const data = doc.data();
              $("#special").val(data.specialization);
              $("#phone").val(data.phone);
              $("#email").val(data.email);
              
            });
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
}
// ===========================================================
