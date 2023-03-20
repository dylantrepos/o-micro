import axios from "axios";
import ValidationError from "../utils/errorHandler";
import {getCookie, removeCookie} from "../utils/cookie";

type UserData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    userId: string;
    status: boolean;
};

export const deleteUserAccount = async (): Promise<boolean> => {
    const cookieTkn = getCookie('user_tkn');
    const API_URL = import.meta.env.VITE_API_URL;
    try {
        const res = await axios.get(`${API_URL}/deactivate`,{
            headers: {
                Authorization: `Bearer ${cookieTkn}`,
            },
        });
        removeCookie('user_tkn');
        return true;
    } catch (error: any) {
        throw new ValidationError(error);
    }
};