import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('customer/sign-in')
    async signInCustomer(email: string, password: string) {
        return this.authService.signInCustomer(email, password);
    }

    @Get('agent/sign-in')
    async signInAgent(email: string, password: string) {
        return this.authService.signInAgent(email, password);
    }
}
