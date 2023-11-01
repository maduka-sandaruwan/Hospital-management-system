const lodingData=()=>{


// ===============patient count===================
// Reference to your Firestore collection
var firestore = firebase.firestore();
var collectionRef = firestore.collection("patient");


// Get the document count
collectionRef.get().then((querySnapshot) => {
  var count = querySnapshot.size;
  // Update the HTML element with the document count
  document.getElementById("documentCount").textContent = count;
}).catch((error) => {
  console.error("Error getting document count: ", error);
});

// ===============Availabale doctor count===================
// Reference to your Firestore collection

var collectionRef = firestore.collection("doctors");


// Get the document count
collectionRef.where('availability','==',"yes").get().then((querySnapshot) => {
  var count = querySnapshot.size;
  // Update the HTML element with the document count
  document.getElementById("avlDocCount").textContent = count;
}).catch((error) => {
  console.error("Error getting document count: ", error);
});

// ===============doctor count===================
// Reference to your Firestore collection

var collectionRef = firestore.collection("doctors");


// Get the document count
collectionRef.get().then((querySnapshot) => {
  var count = querySnapshot.size;
  // Update the HTML element with the document count
  document.getElementById("docCount").textContent = count;
}).catch((error) => {
  console.error("Error getting document count: ", error);
});

  // ===============today appointment count===================
// Reference to your Firestore collection
var today = new Date().toISOString().split('T', 1)[0];
var collectionRef = firestore.collection("appoinment");


// Get the document count
collectionRef.where('date','==',today).get().then((querySnapshot) => {
  var count = querySnapshot.size;
  // Update the HTML element with the document count
  document.getElementById("appoCount").textContent = count;
}).catch((error) => {
  console.error("Error getting document count: ", error);
});

  // ===============today revenue balance===================
// Reference to your Firestore collection
var today = new Date().toISOString().split('T', 1)[0];
var collectionRef = firestore.collection("appoinment");


// Get the document count
collectionRef.where('biilDate','==',today).get().then((response) => {
  let ttl=parseInt(0);
  response.forEach(doc => {
                    
                    const total=(doc.data().totalAmount);
                    ttl+=parseInt(total);
                    document.getElementById("revenue").textContent = ttl;
  });
  

}).catch((error) => {
  console.error("Error getting document count: ", error);
});

}
const logoutBtn=()=>{
  window.location.replace('login.html');
  
}



// =========================login user Details================

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      const userDetails = document.getElementById('email');
      userDetails.innerHTML = `${user.email}`;
      const userEmail=user.email;


      const firestore = firebase.firestore();
      firestore.collection("users")
      .where('email', '==', userEmail)
      .get().then((response)=>{
          
          response.forEach((doc)=>{
              const data = doc.data();
              document.getElementById("firstName").textContent = data.firstName;
              document.getElementById("lastName").textContent = data.lastName;
             
          })

      })

  } else {
      // User is not signed in, redirect to the login page
      window.location.href = 'login.html';
  }
});