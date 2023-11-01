const clearField=()=>{
    searchPatient();
}

const loadData=()=>{
    $('#ttlAmount').empty();
    $('#appo-table-body').empty();
    $('#pName').empty();
    const from=$('#sdate').val();
    const to=$('#edate').val();
    document.getElementById("from").textContent = from;
    document.getElementById("to").textContent = to;
    
    

    const firestore = firebase.firestore();
    firestore.collection('appoinment')
          .where('date', '>', from)
          .where('date', '<', to)
          .get().then((response)=>{
              let ttl=parseInt(0);
              response.forEach((doc)=>{
                  const data = doc.data();
                  const row = `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${data.patientName}</td>
                        <td>${data.doctorName}</td>
                        <td>${data.date}</td>
                        <td>${data.start}</td>
                        <td>${data.end}</td>
                        <td>${data.room}</td>
                        
                        
                    </tr>
                    `;
                    $('#appo-table-body').append(row);
                    // ================================
                    const count = response.size;
                    // Update the HTML element with the document count
                    document.getElementById("ttlBill").textContent = count;
                    
              })

          })      
}

const loadPatient=()=>{
    $('#from').empty();
    $('#to').empty();
    $('#ttlAmount').empty();
    $('#appo-table-body').empty();
    const pName=$('#patientSelect').val();
    document.getElementById("pName").textContent = pName;
    console.log(pName);
    const firestore = firebase.firestore();
    firestore.collection('appoinment')
          .where('patientName', '==', pName)
          .get().then((response)=>{
              let ttl=parseInt(0);
              response.forEach((doc)=>{
                  const data = doc.data();
                  const row = `
                  <tr>
                    <td>${doc.id}</td>
                    <td>${data.patientName}</td>
                    <td>${data.doctorName}</td>
                    <td>${data.date}</td>
                    <td>${data.start}</td>
                    <td>${data.end}</td>
                    <td>${data.room}</td>
                  
                  
              </tr>
                    `;
                    $('#appo-table-body').append(row);
                    // ================================
                    const count = response.size;
                    // Update the HTML element with the document count
                    document.getElementById("ttlBill").textContent = count;
                    
              })

          })      
}




function printPageArea(printReport) {
    var printContent = document.getElementById(printReport).innerHTML;
    var originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}

const searchPatient=()=>{
    $('#patientSelect').empty();
    

    const firestore = firebase.firestore();
    firestore
          .collection('appoinment')
          .get()
          .then((records => {
                records.forEach((result)=>{
                  const option = $('<option></option>').val(result.data().patientName).text(result.data().patientName);
                  $('#patientSelect').append(option);
                })
          }))

}