import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ac from '@antiadmin/anticaptchaofficial'; 

export interface Result {
    message: string;
    status: boolean
}

@Injectable()
export class CaptchaService{

  logger: Logger = new Logger('Resolver Captchar');

  constructor(
    private configService: ConfigService,
) {}

  async resolve({message, status}: Result): Promise<Result> {
    try {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: false,
        });

        const page = await browser.newPage();
        page.setViewport({ width: 1024, height: 768 });

        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i) {
            console.log(`${i}: ${msg.args()[i]}`);
            }
        });

        page.once('load', async () => {
            await page.evaluate(() => {
            var antcptAccountKeyDiv = document.getElementById("anticaptcha-imacros-account-key");
            if (!antcptAccountKeyDiv) {
                antcptAccountKeyDiv = document.createElement("div");
                antcptAccountKeyDiv.innerHTML = "0fcd0e262c1d08df246bc1b5e93baaea";
                antcptAccountKeyDiv.style.display = "none";
                antcptAccountKeyDiv.id = "anticaptcha-imacros-account-key";
                document.body.appendChild(antcptAccountKeyDiv);
            }
            });

            await page.exposeFunction('anticaptchaUserCallbackMethod', (captchaSolvingInfo) => {
            console.log('captchaSolvingInfo', captchaSolvingInfo);
            });

            await page.addScriptTag({ url: 'https://cdn.antcpt.com/imacros_inclusion/recaptcha.js' });
        });

        // Go to the test web-page
        const url = `${this.configService.get<string>('URL_CAPTCHA')}`;

        console.log(`Goto ${url}`);
        await page.goto(url);

        await page.waitForSelector('.antigate_solver.solved', { timeout: 120 * 1000 });
        console.log('Captcha solved');

        await Promise.all([
        page.click('input[type=submit]'),
        page.waitForNavigation({ waitUntil: "networkidle0" })
        ]);

        
        const apiKey = this.configService.get<string>('ANTI_CAPTCHA_KEY')
        ac.setAPIKey(apiKey);

        await page.waitForTimeout(1000);

        const sucess = await page.$('div.recaptcha-success')
        
        if(sucess){
            message = await page.evaluate(element => element.textContent, sucess);
            status = true;
            await browser.close();
        }

        return {message , status}

    } catch (e) {
        console.error(`Error ${e.message}`);
        return {message:e.message , status: false}
    }
  }

}