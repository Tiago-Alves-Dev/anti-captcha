import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { CaptchaService } from './captcha.service';


@Controller('api/captcha')
export class CaptchaController {

  constructor(private readonly service: CaptchaService) {
  }

   @Get()
    async captcha(@Res() res) {
        await this.service.resolve({message:null, status:false})
        .then(result => res.status(HttpStatus.OK).send(result))
        .catch(e => {
            console.log(e);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
        });
    }

}