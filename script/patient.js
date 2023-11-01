// ================age calculation=======================
$("#birthdate").on("change", function () {
  const birthdate = new Date(document.getElementById("birthdate").value);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthdate.getFullYear();
  if (
    currentDate.getMonth() < birthdate.getMonth() ||
    (currentDate.getMonth() === birthdate.getMonth() &&
      currentDate.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  $("#age").val(age);
});

const createPatient = () => {
  const temPatient = {
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    birthdate: $("#birthdate").val(),
    age: $("#age").val(),
    gender: $("input[name='gender']:checked").val(),
    email: $("#email").val(),
    phone: $("#phone").val(),
    address: $("#address").val(),
  }
  const exDetails={
    freeform: $("#freeform").val(),
    myFile: $("#myFile").val()
  }
  if (!isValidUserData(temPatient)) {
    Swal.fire("Error", "Please fill in all fields.", "error");
    return;
  }
  generateBarcode();
  console.log(temPatient);
  const database = firebase.firestore();
  database
    .collection("patient")
    .add(temPatient,exDetails)
    .then((response) => {
      console.log(response);
      alert("Patient Registration Successfully!");
      loadPatient();
      clearData();
      
    })
    .catch((error) => {
      console.log(error);
      alert("Error");
    });
};

const loadPatient = () => {
  $("#table-body").empty();

  const firestore = firebase.firestore();
  firestore
    .collection("patient")
    .get()
    .then((result) => {
      result.forEach((records) => {
        const data = records.data();
        const row = `
            <tr>
                <td>${records.id}</td>
                <td>${data.firstName} ${data.lastName}</td>
                <td>${data.age}</td>
                <td>${data.gender}</td>
                <td>${data.phone}</td>
                <td style="display:flex; width:80px; text-align:center;">
                        <button class="btn btn-danger btn-sm" onclick="deleteData('${records.id}')">Delete</button> |
                        <button class="btn btn-success btn-sm" onclick="updateData('${records.id}')">Update</button>
                </td>
            </tr>
            `;
        $("#table-body").append(row);
      });
    });
};
patientId = undefined;
const updateData = (id) => {
  patientId = id;
  const firestore = firebase.firestore();
  firestore
    .collection("patient")
    .doc(patientId)
    .get()
    .then((response) => {
      if (response.exists) {
        const data = response.data();
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#age").val(data.age);
        $("#birthdate").val(data.birthdate);
        $("#email").val(data.email);
        $("#phone").val(data.phone);
        $("#address").val(data.address);
        $("#freeform").val(data.freeform);
        $("#myFile").val(data.myFile);
        // $("#maleGender").val(data.gender);
        if (data.gender == "male") {
          $("#maleGender").prop("checked", true).val(data.gender);
        } else if (data.gender == "female") {
          $("#femaleGender").prop("checked", true).val(data.gender);
        } else {
          $("#otherGender").prop("checked", true).val(data.gender);
        }
      }
    });
};
const updateRecord = () => {
  if (patientId) {
    const firestore = firebase.firestore();
    firestore
      .collection("patient")
      .doc(patientId)
      .update({
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        birthdate: $("#birthdate").val(),
        gender: $("input[name='gender']:checked").val(),
        age: $("#age").val(),
        email: $("#email").val(),
        phone: $("#phone").val(),
        address: $("#address").val(),
        freeform: $("#freeform").val(),
        myFile: $("#myFile").val(),
      })
      .then(() => {
        patientId = undefined;
        alert("Patient Updating Successfully!");
        loadPatient();
        clearData();
      });
  }
};
const deleteData = (id) => {
  if (confirm("Are you sure?")) {
    const firestore = firebase.firestore();
    firestore
      .collection("patient")
      .doc(id)
      .delete()
      .then(() => {
        alert("Patient deleting Successfully!");

        patientId = undefined;
        loadPatient();
      });
  }
};
// ======================================================
const clearData = () => {
  firstName.value = "";
  lastName.value = "";
  birthdate.value = "";
  age.value = "";
  email.value = "";
  phone.value = "";
  address.value = "";
  freeform.value = "";
  myFile.value = "";
};
// ===================barcode generator==========
const generateBarcode=()=> {
  const patientName = $("#firstName").val();
  const barcodeData = patientName;
  console.log(barcodeData);
  
  JsBarcode("#barcode", barcodeData, {
    format: "CODE128",
    
  });
  
}
// ====================download barcode===========
function downloadBarcode(e){
  const canvas = document.createElement("canvas");
  const svg = document.getElementById("barcode");
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(svg.getAttribute('width'));
  const h = parseInt(svg.getAttribute('height'));
  const img_to_download = document.createElement('img');
  img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
  console.log(w, h);
  img_to_download.onload = function () {
    console.log('img loaded');
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    const context = canvas.getContext("2d");
    //context.clearRect(0, 0, w, h);
    context.drawImage(img_to_download,0,0,w,h);
    const dataURL = canvas.toDataURL('image/png');
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "download.png");
      e.preventDefault();
    } else {
      const a = document.createElement('a');
      const my_evt = new MouseEvent('click');
      a.download = 'download.png';
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
  //canvas.parentNode.removeChild(canvas);
}  
}