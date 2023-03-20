import ValidationError from '../utils/errorHandler';
import axios from 'axios';
import { addCookie, getCookie } from '../utils/cookie';

type UserData = {
  id: string;
  firstname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterBandDatas = {
    id: string;
    name: string;
    password: string;
    confirmPassword: string;
  };

export const loginUserAccount = async (email: string, password: string): Promise<boolean> => {
    const URL = 'http://dylantrepos-server.eddi.cloud/api/login';
    try {
        const res = await axios.post(URL,
            {
            email: email,
            password: password,
        }, {headers: {"Access-Control-Allow-Origin": "*"},})
        document.cookie = `user_tkn=${res.data.access_token}`
        return true;
    } catch (error: any) {
        throw new ValidationError(error).getErrorMessageLogin();
    }
}

export const createUserAccount = async (data: UserData): Promise<boolean> => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const res = await axios.post(
        `${API_URL}/register`,
        {
          firstname: data.firstname,
          email: data.email,
          password: data.password,
          status: true,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
  
      addCookie("user_tkn", res.data.access_token);
      return true;
    } catch (error: any) {
      console.log(API_URL);
      throw new ValidationError(error);
    }
  };

export const updateUser = async (data: UserData): Promise<boolean> => {
    const API_URL = import.meta.env.VITE_API_URL;
    const cookieTkn = getCookie("user_tkn");
    try {
      const userData = await axios.patch(
        `${API_URL}/user/edit`,
        {
          id: data.id,
          firstname: data.firstname,
          email: data.email,
        },
        {
          headers: {
            authorization: `Bearer ${cookieTkn}`,
          },
        }
      );
  
      console.log(userData);
      return true;
    } catch (error: any) {
      throw new ValidationError(error);
    }
  };

// export const loginUserAccount = async (
//   email: string,
//   password: string
// ): Promise<boolean> => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   try {
//     const res = await axios.post(`${API_URL}/login`, {
//       email: email,
//       password: password,
//     });

//     try {
//         const res = await axios.post(URL, {
//             firstname: data.name,
//             email: data.email,
//             password: data.password,
//             status: true,
//         },{headers: {"Access-Control-Allow-Origin": "*"},})
//         document.cookie = `user_tkn=${res.data.access_token}`
//         return true;
//     } catch (error: any) {
//         console.log('err : ', new ValidationError(error).getErrorMessageLogin())
//         throw new ValidationError(error).getErrorMessageLogin()
//     }
// }

export const getUserInfo = async () => {
    const URL = 'http://dylantrepos-server.eddi.cloud/api/user/current';
    try {
        const token = getCookie('user_tkn');
        const res = await axios.get(URL, {
        headers: {'Authorization': `Bearer ${token}`,}
        })
        
        return res.data;
    } catch (error: any) {
        throw new ValidationError(error)
    }
}

export default () => '';


//Modifier le groupe de l'utilisateur
export const changeBand = async (data: RegisterBandDatas): Promise<boolean> => {
    const API_URL = import.meta.env.VITE_API_URL;
    const cookieTkn = getCookie("user_tkn");
    try {
      const bandData = await axios.patch(
        `${API_URL}/user/changeBand`,
        {
          id: data.id,
          password: data.password,
        },
        {
          headers: {
            authorization: `Bearer ${cookieTkn}`,
          },
        }
      );
      return true;
    } catch (error: any) {
      throw new ValidationError(error);
    }
  };


  export const getCurrentUser = async (): Promise<any> => {
    const API_URL = import.meta.env.VITE_API_URL;
    const cookieTkn = getCookie("user_tkn");
    try {
      const userData = await axios.get(`${API_URL}/user/current`, {
        headers: {
          authorization: `Bearer ${cookieTkn}`,
        },
      });
  
      return userData;
    } catch (error: any) {
      throw new ValidationError(error);
    }
  };