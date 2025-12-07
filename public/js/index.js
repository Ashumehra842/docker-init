import '@babel/polyfill';
import {login } from './login';
import { logout } from '../../Controllers/viewsController';
import {updateData} from './updateSettings';
const logOutBtn = document.querySelector('.nav__el--logout');
const updateUserData = document.querySelector('.form-user-data');
document.querySelector(".form--login").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
}); 

if(logOutBtn){
  logOutBtn.addEventListener('click', logout);
}

if(updateUserData){
  updateUserData.addEventListener('submit',e =>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}