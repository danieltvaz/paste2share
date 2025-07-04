import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';
import { QrcodeModule } from './qrcode/qrcode.module';

@Module({
  imports: [WebsocketModule, QrcodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
