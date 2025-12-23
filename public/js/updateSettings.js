import axios from "axios";
import { showAlert } from "./alert";

export const updateData =  async(data) =>{
     try{
        console.log(data);
        const res = await axios({
            method:'PATCH',
            url: 'http://127.0.0.1:3000/v1/user/updateMe',
            data
            });

    if(res.data.status === 'success'){
        showAlert('success', 'data updated successfully.');
    }
     }catch(err){ 
        showAlert('error', err.res.data.message);
     }
}