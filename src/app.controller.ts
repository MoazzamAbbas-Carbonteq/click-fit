import { Controller, Get, Res, Param, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product-image/:filename')
  testImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(__dirname, '..', 'upload_images', 'products', filename);
    
    if (!existsSync(imagePath)) {
      throw new NotFoundException(`Image ${filename} not found`);
    }

    return res.sendFile(imagePath);
  }
}