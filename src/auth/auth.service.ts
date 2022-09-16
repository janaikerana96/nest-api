//Bussines Logic
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    
    async signup(dto: AuthDto){ 
        // generante the password hash
        const hash = await argon.hash(dto.password)
        // save the new user in the db
        const user = await this.prisma.user.create({
            data: {
              email: dto.email,
              hash,
            }
        });
        
        //will not showing up the password
        delete user.hash;
        //return the user saved user
        return user;
    }

    signin(){ 
        return {msg: 'Welcome to Nestjs Tutorial'};
    }
}