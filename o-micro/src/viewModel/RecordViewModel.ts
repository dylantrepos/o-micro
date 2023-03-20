import axios from "axios";
import { callToast } from "../components/Toast";
import { RecordModel } from "../model/RecordModel";
import { RecordRequest } from "../types/record";
import ValidationError from "../utils/errorHandler";
import { getCookie } from "../utils/cookie";

export const getAllRecords = async (id: string): Promise<RecordModel[]> => {
   // Récupère les enregistrements bruts
   console.log('coucou')
   const token = getCookie('user_tkn');
   const request = await axios.get(`http://dylantrepos-server.eddi.cloud/api/song/${id}/records`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  }).catch(e => callToast({message: (new ValidationError(e)).getErrorMessage()}));
  console.log('tk : ', token)
  console.log('req : ', request)

  return request?.data.map((req: RecordRequest) => new RecordModel(req));
}
