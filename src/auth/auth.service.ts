//Bussines Logic
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
        ){}
    
    async signup(dto: AuthDto){ 
        // generante the password hash
        const hash = await argon.hash(dto.password)
        // save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: {
                  email: dto.email,
                  hash,
                }
            });
            //return the user saved user
            return this.SignToken(user.id, user.email);
        } catch (error) {
            if(
                error instanceof 
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials Taken',
                    );
                }
            }
            throw error;
        }
    }

    
  async signin(dto: AuthDto){ 
    
        // find the user by email
    const user =
        await this.prisma.user.findUnique({
            where: {
              email: dto.email,
            },
        });
       
        // if user does not exit throw exeception 
        if (!user)
           throw new ForbiddenException('Credentials incorrect');
 
        //compare password
    const pwMatches = await argon.verify(
        user.hash,
        dto.password,
    );
       
        // if password incorrect throw exception
        if (!pwMatches)
           throw new ForbiddenException('Credentials incorrect');
        // send back the user
        return this.SignToken(user.id, user.email);

    }

   async SignToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string }> {

        const payload = {
            sub: userId,
            email,
        };

       const secret = this.config.get('JWT_SECRET');

       const token = await this.jwt.signAsync(
            payload, {
               expiresIn: '30min',
               secret: secret,
            },
        ); 

        return {
            access_token: token,
        };
    }

}