import '@babel/polyfill';
import {login } from './login';
import { logout } from '../../Controllers/viewsController';
import {updateData} from './updateSettings';
import { bookTour } from './stripe';
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserData = document.querySelector('.form-user-data');
const isFormClassSet = document.querySelector(".form--login");
const bookBtn = document.getElementById('book-tour');
//Login function
if(isFormClassSet){
    isFormClassSet.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
    }); 
}

//Log Out function
if(logOutBtn){
  logOutBtn.addEventListener('click', logout);
}

// Update User data function
if(updateUserData){
  updateUserData.addEventListener('submit',e =>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}

if(bookBtn){
  bookBtn.addEventListener('click', e =>{
    
    e.target.textContent = 'Processing...';
    const {tourId} = e.target.dataset;
    bookTour(tourId);
  });
}