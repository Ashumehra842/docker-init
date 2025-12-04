import axios from 'axios';
import { showAlert } from './alert';    
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/v1/user/login",
      data: { email, password },
      withCredentials: true,
    });
    if (res.data.status === "success") {
        console.log(" login js");
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert('error',err.response.data.message);
  }
};

export const logout = async() => {
  try{
    const res = await axios({
      method:'GET',
      url: 'http://127.0.0.1:3000/logout'
    });
    if(res.data.status === 'success'){
      location.reload(true);
    }
  }catch(err){
    showAlert('error', 'error while logout tyr again');
  }
}


