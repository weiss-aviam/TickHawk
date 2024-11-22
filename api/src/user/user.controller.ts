import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTGuard } from 'src/config/guard/jwt/jwt.guard';
import { Roles } from 'src/config/guard/roles/roles.decorator';
import { RolesGuard } from 'src/config/guard/roles/roles.guard';

@Controller('user')
@UseGuards(JWTGuard, RolesGuard)
export class UserController {
    constructor() {}

    @Get('/me')
    @Roles(['customer', 'admin', 'agent'])
    async getMe(){
        return 'HEY';
    }
}
