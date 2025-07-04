import * as qrcode from 'qrcode';

import { Injectable } from '@nestjs/common';

@Injectable()
export class QrcodeService {
  async generateQRCode(text: string): Promise<string> {
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(text);
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }
}
