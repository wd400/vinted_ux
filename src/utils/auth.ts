import axios from "axios";
import { API_URL } from "../config";

// import jwt from 'jsonwebtoken'; 

function delete_cookie() { document.cookie = 'session=; Path=/;  Domain=.vinted.loveresell.com; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure'; }

function clearCookies() {
   // document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
 //  document.cookie = 'session=; Max-Age=0; path=/; domain=.' + window.location.host; 
delete_cookie();
}

function signOut() {
    //clear the session
    //localStorage.removeItem('pro_until');
    localStorage.clear();
    //clear cookies
//clear the session
clearCookies();
    //redirect to the homepage
    window.location.href = '/';

    
}



async function signIn(email: string,locale:string): Promise<boolean> {
    return fetch(API_URL +  '/api/mail_auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //include credentials
        credentials: 'include',
        body: JSON.stringify({ email,locale }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then((data) => {
            console.log(data);
            //   window.location.href = '/';
            return true;
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
            return false;
        });
}

interface CheckTokenResponse {
    is_pro: boolean ;
    status: 'authenticated' | 'unauthenticated';
}

function checkToken(token:string|undefined) : CheckTokenResponse {
    if (!token) {
        return { is_pro: false, status: 'unauthenticated' };
    }
    let data;

    try {
        //base64 decode the token on client side
        //start by splitting the token
        const token_parts = token.split('.');
        //get the payload
        const payload = token_parts[1];
        //decode the payload
        const decodedPayload = atob(payload);
        //parse the payload
        data = JSON.parse(decodedPayload);



    } catch (error) {
        console.error('Error parsing response', error);
        return { is_pro: false, status: 'unauthenticated' };
    }

    console.log("data",data);
    if (!data) {
        return { is_pro: false, status: 'unauthenticated' };
    }

    if (typeof data === 'string') {
        return { is_pro: false, status: 'unauthenticated' };
    }

    if (!data.exp) {
        return { is_pro: false, status: 'unauthenticated' };
    }


    //check expiration date
    if (data.exp && data.exp < (Date.now()/1000)) {
        return { is_pro: false, status: 'unauthenticated' };
    }

    const pro_until = data.pro_until;
    if (pro_until && (
        parseInt(pro_until) > (Date.now()/1000)
    )) {
        return { is_pro: true, status: 'authenticated' };
    }

    return { is_pro: false, status: 'authenticated' };
}

function ExtractToken() {
    const cookie = document.cookie;
    const session = cookie.split('; ').find(row => row.startsWith('session='));
    //decode jwt token
    const token = session?.split('=')[1];
    return token;
}

async function useSession() : Promise<CheckTokenResponse> {
    // get current cookie and extract the session
    const token = ExtractToken();

    const checked_token = checkToken(token);


    if (checked_token.status === 'authenticated' && !checked_token.is_pro) {
        const response = await fetch(
            API_URL +
            '/api/refresh_token',
            // include credentials
            { credentials: 'include' },
        );
        //check if the response is ok
        if (response.ok) {
            const token = ExtractToken();
            const checked_token = checkToken(token);
            return checked_token;
        } else {
            return { is_pro: false, status: 'unauthenticated' };
        }
    }
    return checked_token;
}

function ExtractEmail() {
    const cookie = document.cookie;
    const session = cookie.split('; ').find(row => row.startsWith('session='));
    //decode jwt token
    const token = session?.split('=')[1];
    if (!token) {
        return '';
    }
    let data;


    try {
        //base64 decode the token on client side
        //start by splitting the token

        const token_parts = token.split('.');
        //get the payload
        const payload = token_parts[1];
        //decode the payload
        const decodedPayload = atob(payload);
        //parse the payload
        data = JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error parsing response', error);
        return '';
    }

    if (!data) {
        return '';
    }

    if (typeof data === 'string') {
        return '';
    }

    if (!data.email) {
        return '';
    }

    return data.email as string;
}

function verifyMagicLink(token: string): boolean {

    const checked_token = checkToken(token);
    if (checked_token.status === 'authenticated') {
        // Store the token in cookies or local storage
      //  document.cookie = `session=${token}; path=/`;
        //also for subdomains
        document.cookie = `session=${token}; path=/; domain=.${window.location.hostname}`;

        // fetch(API_URL + '/api/log', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //        // 'Cookie': `session=${token}`,
        //     },
            
        //     //include credentials
        //     credentials: 'include',
        //     body: JSON.stringify({ action: 'magic' }),
        // });

        // same but with axios
        axios.post(API_URL + '/api/log', { action: 'magic' }, 
            { withCredentials: true },
        );


        return true;
    }
    return false;
}

const authUtils = { signOut, signIn, useSession, checkToken, ExtractToken, verifyMagicLink ,ExtractEmail};
export default authUtils;