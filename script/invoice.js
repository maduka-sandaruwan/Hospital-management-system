const loadData=()=>{
    $('#invoice-table-body').empty();
    const param ={};
    const queryParam = new URLSearchParams(window.location.search);
    const id = queryParam.get('id');
    console.log(id);
    const toDate = new Date().toISOString().split('T', 1)[0];
    console.log(toDate);
    $('#printdate').val(toDate);
    const firestore = firebase.firestore();
    firestore
          .collection('appoinment')
          .doc(id)
          .get().then((response)=>{
            if (response.exists) {
              const data = response.data();
              $("#invcode").val(response.id);  
              $("#appodate").val(data.date);  
              $("#billdate").val(data.biilDate);  
              $("#docname").val(data.doctorName); 
              $("#patientName").val(data.patientName);
              $("#subtotal").val(data.totalAmount);
              $("#paidamo").val(data.paidAmount);
              $("#balance").val(data.balance);
              $("#method").val(data.paymentMethod);
              
              data.medicineItem.item.forEach(record => {
                const row = `
                <tr>
                    <td>${record.discription}</td>
                    <td>${record.quantity}</td>
                    <td>${record.unitPrice}</td>
                    <td>${record.total}</td>
                    
                    
                </tr>
                `;
                $('#invoice-table-body').append(row);
              });
            }
          
          })
          

        
}