import axios from "axios";
import { showAlert } from "./alert";

export const updateData =  async(name, email) =>{
     try{
        console.log("hello")
        const res = await axios({
            method:'PATCH',
            url: 'http://127.0.0.1:3000/v1/user/updateMe',
            data:{
                name,
                email
                }
            });

    if(res.data.status === 'success'){
        showAlert('success', 'data updated successfully.');
    }
     }catch(err){ 
        showAlert('error', err.res.data.message);
     }
}