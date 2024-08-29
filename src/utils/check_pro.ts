import { API_URL } from "../config";

async function CheckPro () {
    const pro_until = localStorage.getItem('pro_until');

    if (pro_until && (
        parseInt(pro_until) > (Date.now()/1000)
    )) {
        return true;
    }

    const response = await fetch(
      API_URL +
      '/api/check_pro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: localStorage.getItem('token'),
        }),
    });
    //check if the response is ok

    //check if the response is ok

    if (response.ok) {
      //try to parse the response and catch any errors
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing response', error);
        return false;
      }
      
      //save pro_until in local storage
      localStorage.setItem('pro_until', data.proUntil);
      if (data.proUntil < (Date.now()/1000)) {
        return false;
      
      }
        return true;
    }
    return false;
}

export default CheckPro;