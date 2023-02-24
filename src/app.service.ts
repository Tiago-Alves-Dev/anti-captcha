import { Injectable } from '@nestjs/common';
import { AppConstants } from './core/app.constants';

@Injectable()
export class AppService {

  async getAppInfo(): Promise<{}> {
    return await new Promise<{}>((resolve) => {
      resolve(AppConstants.info);
    });
  }

}
