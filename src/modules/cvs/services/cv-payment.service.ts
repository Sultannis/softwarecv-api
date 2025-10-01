import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Polar } from '@polar-sh/sdk';
import { appConfig } from '../../../config/app.config';

@Injectable()
export class CvPaymentService {
  private readonly polar: Polar;

  constructor() {
    this.polar = new Polar({
      accessToken: appConfig.polar.accessToken,
      serverURL: appConfig.polar.serverURL,
    });
  }

  async createCheckout() {
    try {
      return await this.polar.checkouts.create({
        successUrl: appConfig.polar.successUrl as string,
        productPriceId: appConfig.polar.productId as string,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create checkout');
    }
  }

  async getCheckout(checkoutId: string) {
    try {
      return await this.polar.checkouts.get({ id: checkoutId });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get checkout');
    }
  }
}
