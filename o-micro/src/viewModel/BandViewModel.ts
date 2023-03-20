import ValidationError from "../utils/errorHandler";
import axios from "axios";
import { getCookie } from "../utils/cookie";
import { BandModel } from "../model/BandModel";

type RegisterBandDatas = {
  id: string;
  name: string;
  password: string;
  confirmPassword: string;
};

type JoinBandDatas = {
  bandId: string;
  bandPassword: string;
  bandConfirmPassword: string;
};

//Créer un nouveau groupe
export const createBand = async (data: RegisterBandDatas): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const cookieTkn = getCookie("user_tkn");

    const res = await axios.post(
      `${API_URL}/band`,
      {
        name: data.name,
      },
      {
        headers: {
          Authorization: `Bearer ${cookieTkn}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return res.data.id;
  } catch (error: any) {
    throw new ValidationError(error);
  }
};

//rejoindre un groupe déjà existant
export const joinBand = async (data: JoinBandDatas): Promise<boolean> => {
  const API_URL = import.meta.env.VITE_API_URL;
  try {
    const cookieTkn = getCookie("user_tkn");

    const res = await axios.post(
      `${API_URL}/band/add`,
      {
        name: data.bandId,
        password: data.bandPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${cookieTkn}`,
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return true;
  } catch (error: any) {
    throw new ValidationError(error);
  }
};

export const getBandInfo = async () => {
  const URL = 'http://dylantrepos-server.eddi.cloud/api/band/current';
  try {
      const token = getCookie('user_tkn');
      const res = await axios.get(URL, {
      headers: {'Authorization': `Bearer ${token}`,}
      })
      return new BandModel(res.data);
  } catch (error: any) {
      throw new ValidationError(error)
  }
}

//Modifier le nom du groupe
export const updateBand = async (data: RegisterBandDatas): Promise<boolean> => {
  const id = data.id;
  const API_URL = import.meta.env.VITE_API_URL;
  const cookieTkn = getCookie("user_tkn");
  try {
    const bandData = await axios.patch(
      `${API_URL}/band/${id}/edit`,
      {
        name: data.name,
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

export const getCurrentBand = async (): Promise<any> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookieTkn = getCookie("user_tkn");
  try {
    const bandData = await axios.get(`${API_URL}/band/current`, {
      headers: {
        authorization: `Bearer ${cookieTkn}`,
      },
    });
    return bandData;
  } catch (error: any) {
    throw new ValidationError(error);
  }
};

export const getRequestPassword = async (): Promise<string> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookieTkn = getCookie("user_tkn");
  try {
    const requestPassword = await axios.get(
      `${API_URL}/band/current/request-password`,
      {
        headers: {
          authorization: `Bearer ${cookieTkn}`,
        },
      }
    );
    return requestPassword.data.password;
  } catch (error: any) {
    throw new ValidationError(error);
  }
};