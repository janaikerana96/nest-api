//Bussines Logic
import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
    
    signup(){ 
        return {msg: 'i am signed up'};
    }

    signin(){ 
        return {msg: 'i am signed in'};
    }
}