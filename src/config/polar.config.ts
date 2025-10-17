import { registerAs } from "@nestjs/config";

export default registerAs('polar', () => ({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  serverURL: process.env.POLAR_SERVER_URL,
  successUrl: process.env.POLAR_SUCCESS_URL,
  productId: process.env.POLAR_PRODUCT_ID,
}));