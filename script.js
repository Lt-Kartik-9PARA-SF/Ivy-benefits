

const form = document.getElementById('loginForm');
const submitForm = document.getElementById('submitForm');
const loginBtn = document.getElementById('login-btn');
const submitBtn = document.getElementById('submit-btn');
let loggedIn = localStorage.getItem('authentication');
let username1 = document.getElementById('name-user');
let loginFlag = false;

// let name1 = document.getElementById('exampleInputName').value;
// let email1 = document.getElementById('emailInput').value;
// let mobileNo = document.getElementById('mobile').value;
// let password = document.getElementById('Password1').value;
// let confirmPassword = document.getElementById('confirmPass').value;


async function loggedInUser(email){
  let data = await fetch("https://ivy-backend-production.up.railway.app/curUser", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({
      email:email
    })
   });
   data = await data.json();
   localStorage.setItem('currentUser',`${data.name}`);
   
  }

async function login (event) {
  // prevent default form submission
 event.preventDefault();
 document.getElementById('loginErr').innerText =""
 if(localStorage.getItem('authentication') == 'true'){
  form.innerHTML = `<h5>You are already Logged in</h5>
        <button class="logout-btn" onclick="logout()">Logout</button>
  `
  return;
 }
  // get form data
  const formData = new FormData(form);
let flag = false;
  // convert form data to JSON object
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });

  // log JSON object to console
 // console.log(jsonObject);

 let data = await fetch("https://ivy-backend-production.up.railway.app/login", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({
      email:jsonObject.email,
      password:jsonObject.password,
    })
   })
   .then(async(res) => {
    if(res.status === 200){
      await loggedInUser(jsonObject.email);
     localStorage.setItem('authentication','true');
      window.location.href = 'index.html';
     
    }
    else if (res.status === 401 ){
      document.getElementById('loginErr').innerText ="Login Failed please check email and password"
    }
    return  res;
    
  }).then((data)=>{
  }).catch((err)=>{
    if(err == "TypeError: Failed to fetch"){
      document.getElementById('loginErr').innerText = "We are facing server issues please try again later";
      console.log("backend is not responding");
    }
    
    
  });

  
  
};


 function register (event) {
  // prevent default form submission
  event.preventDefault();

  let password = document.getElementById('Password1').value;
  let confirmPassword = document.getElementById('confirmPass').value;
  document.getElementById('passwordErr').innerText ="";
  // get form data
  const formData = new FormData(submitForm);
  document.getElementById('emailErr').innerText = "";
  // convert form data to JSON object
  let flag = true;
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
    if(value == ""){
      flag = false;
    }
  });
   console.log(password )
   console.log(confirmPassword)
   if(flag == false){
   alert("All fields are mandatory")
   password.value = "";
   confirmPassword.value = "";
   }
   else if(password !== confirmPassword){
    document.getElementById('passwordErr').innerText ="Passwords are not matching";
   }
   else{
    fetch("https://ivy-backend-production.up.railway.app/register", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(jsonObject)
    }).then(res => {
      if(res.status == 409){
  document.getElementById('emailErr').innerText = "Email Already Exists please log in using your email and password"
      }else{
        console.log("Request complete! response:", res);
        submitForm.innerHTML=`<h5>Thanks for Registering ${jsonObject.name} </h5>
        <h6>Now you can login using your Email and Password</h6>
        <p>you will be redirected to the login page in a few seconds </p>`
        localStorage.removeItem('authentication');
        localStorage.removeItem('currentUser');
        setTimeout(()=>{
          window.location.href="signIn.html";
          
        },5000)
        
      }
      
    }).catch((err)=>{
      document.getElementById('emailErr').innerText = "Please try later we are facing server issues";
    });
   }
 
 //7996123482
};

function loginCheck(){
  if(localStorage.getItem('authentication') == 'true'){
    document.getElementById('cur-user').innerText = "Welcome " + localStorage.getItem('currentUser').toUpperCase();
    
  }else{
    window.location.href = 'signIn.html';
  }
 
}

function logout(){
  localStorage.removeItem('authentication');
  localStorage.removeItem('currentUser');
  form.innerText = "Logged out Sucessfully";
  setTimeout(()=>{
    window.location.href="signIn.html"
  },2000)
 
}

function checkIfAlreadyLoggedIn(){
  var auth = localStorage.getItem('authentication');
  if(auth){
    form.innerHTML = ` <h5>You are already Logged in</h5>
    <button class="logout-btn" onclick="logout()">Logout</button>
    <p>go back to <a href="index.html">Home page</a> </p>
`;
  }
  
}






  