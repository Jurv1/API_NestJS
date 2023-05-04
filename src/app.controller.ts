import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @HttpCode(204)
  @Delete('testing/all-data')
  deleteData() {
    return this.appService.deleteAll();
  }
}
