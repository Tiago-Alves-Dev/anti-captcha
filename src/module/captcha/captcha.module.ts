import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';

@Module({
  providers: [CaptchaService, ConfigService],
  exports: [CaptchaService, ConfigService],
  controllers: [CaptchaController]
})
export class CaptchaModule implements OnModuleInit {

  async onModuleInit() {
  }

}