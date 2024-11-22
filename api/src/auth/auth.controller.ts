import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('/sign-in')
    async signInCustomer(email: string, password: string) {
        return this.authService.signIn(email, password);
    }

}
