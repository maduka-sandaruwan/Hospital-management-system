const register=()=>{
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        // const password = document.getElementById("password").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("conf_password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        if (!isValidUserData({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password,
            confirmPassword:confirmPassword,
        })) {
            Swal.fire("Error", "Please fill in all fields.", "error");
            return;
        }
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // You can store additional user data in Firestore or Realtime Database here
            // For example, you can create a 'users' collection and store the first name and last name
            // userCredential.user.uid can be used as the unique user identifier
            return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
            firstName: firstName,
            lastName: lastName,
            email: email
            });
        })
        .then(() => {
            // Registration successful, redirect or show a success message
            alert("Registration successful!");
            window.location.replace('login.html');
            // You can redirect the user to a different page here if needed
        })
        .catch((error) => {
            alert(error.message);
        });
        
// ----------------------------------------        
    
}
const alreadyHaveAnAccount=()=>{
    window.location.replace('login.html');
}


 