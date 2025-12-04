import '@babel/polyfill';
import {login } from './login';
import { logout } from '../../Controllers/viewsController';

const logOutBtn = document.querySelector('.nav__el--logout');
document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
}); 

if(logOutBtn){
  logOutBtn.addEventListener('click', logout);
}