import { Controller, Get, Query } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Get()
  async generateQrcode(@Query('text') text: string) {
    const qrcode = await this.qrcodeService.generateQRCode(text);

    return {
      message: 'QR code generated successfully',
      qrcode: qrcode,
    };
  }
}
