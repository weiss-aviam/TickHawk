import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHome(): { message: string } {
    return {message: 'Welcome to the API'};
  }
}
