const login=()=>{
    const email= $('#email').val();
    const password = $('#password').val();
    
    

    firebase
    .auth()
    .signInWithEmailAndPassword(email,password)
    .then((resp)=>{
      console.log(resp);
      console.log(resp.user);
      const user = resp.user;
      
      alert("Login successful!");
      window.location.href = `dashbord.html`;
      // ?uid=${user.uid}&email=${user.email}
  })
  .catch((error)=>{
      alert("Invalid email or password",error);
  });
        
    
} 
const createAnAccount=()=>{
  window.location.replace('register.html');
  
}