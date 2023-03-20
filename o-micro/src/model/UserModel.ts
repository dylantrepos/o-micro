import User from "../types/user";

export class UserModel {

    user: User;

    constructor({firstname, email, password}: User){
        this.user = {
            firstname: firstname,
            email: email,
            password: password,
        }
    }   
}