import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { url } from 'inspector';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "mysql://root:q1w2e3r4t5@localhost:3306/nest?connection_limit=5"
                },
            },
        });
    }
}
