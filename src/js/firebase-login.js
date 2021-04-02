const config = {
    apiKey: "AIzaSyAx1D-g2qGeJxBdozCO3pfPZvfg5l9yeUc",
    authDomain: "my-project-2d288.firebaseapp.com",
    projectId: "my-project-2d288",
    storageBucket: "my-project-2d288.appspot.com",
    messagingSenderId: "582082591029",
    appId: "1:582082591029:web:64d668bc5f471d6b8eb47c",
    measurementId: "G-NMM570TBES"
};
firebase.initializeApp(config);
    
const openLogInModal = document.querySelector('.lightbox');
const LogInRef = document.querySelector('button[data-action="login-lightbox"]');
const closeModalBtn = document.querySelector('button[data-action="close-lightbox"]');
const logInBtnRef = document.querySelector('button[data-action="logIn"]');
const logOutBtnRef = document.querySelector('button[data-action="logOut"]');
const signInBtnRef = document.querySelector('button[data-action="signIn"]');
const closeOverlayRef = document.querySelector('.lightbox__overlay');

const auth = firebase.auth();

//--------------------------------LogIn Modal--------------------------------//
LogInRef.addEventListener('click', onLogInClick);
closeModalBtn.addEventListener('click', closeModal);
closeOverlayRef.addEventListener('click', closeOverlay);
logInBtnRef.addEventListener('click', logIn);
logOutBtnRef.addEventListener('click', logOut);
signInBtnRef.addEventListener('click', signUp);

function onLogInClick(event) {
  event.preventDefault();
  openLogInModal.classList.add('is-open');
  window.addEventListener('keydown', isEscape);
}

function closeModal(event) {
  event.preventDefault();
  openLogInModal.classList.remove('is-open');
  window.removeEventListener('keydown', isEscape);
}

function closeOverlay(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
    closeModal(event);
  }
}

//---------------------------SignUp Modal-----------------------------//
const openSignUpModal = document.querySelector('.lightbox_2');
const SignUpRef = document.querySelector('button[data-action="signup-lightbox"]');
const closeSignUpModalBtn = document.querySelector('button[data-action="close-signup-lightbox"]');
const closeSignUpOverlayRef = document.querySelector('.lightbox__overlay_2');

SignUpRef.addEventListener('click', onSignUpClick);
closeSignUpModalBtn.addEventListener('click', closeSignUpModal);
closeSignUpOverlayRef.addEventListener('click', closeSignUpOverlay);

function onSignUpClick(event) {
  event.preventDefault();
  openSignUpModal.classList.add('is-open');
  window.addEventListener('keydown', isEscape);
}

function closeSignUpModal(event) {
  event.preventDefault();
  openSignUpModal.classList.remove('is-open');
  window.removeEventListener('keydown', isEscape);
}

function closeSignUpOverlay(event) {
  event.preventDefault();
  if (event.target === event.currentTarget) {
     closeSignUpModal(event);
    }
}

function isEscape(event) {
  if (event.code === 'Escape') {
     closeModal(event);
     closeSignUpModal(event);
    } 
}

//------------------------Firebase---------------------//

function signUp() {
		
   const email = document.getElementById("email");
   const password = document.getElementById("password");
   const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
   promise.catch(e => alert(e.message));
   openSignUpModal.classList.remove('is-open');
   alert("New account is created");
}
	
function logIn(){
		
	const email = document.getElementById("email_field");
	const password = document.getElementById("password_field");
		
	const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    openLogInModal.classList.remove('is-open');
    alert("You are successfully logged in!");
}
	
function logOut() {
		
    auth.signOut();
    openLogInModal.classList.remove('is-open');
	alert("Hope to see you soon");
}
	
auth.onAuthStateChanged(function(user) {
		
	if(user) {
       
      document.getElementById("user_div").style.display = "block";
      document.getElementById("login_div").style.display = "none";
			
	} else {
		document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
	}
});