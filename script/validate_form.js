const billing =()=>{
    alert("Please create new appointment first");
    window.location.replace('appoinment.html');
  }
// ===================form validation==============
function isValidUserData(data) {
  for (const key in data) {
    if (!data[key]) {
      return false;
    }
  }
  return true;
}