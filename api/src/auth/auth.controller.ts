import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerAuthDto } from './dtos/customer-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-in')
    async signInCustomer(@Body() createCatDto: CustomerAuthDto) {
        return this.authService.signIn(createCatDto);
    }

}
