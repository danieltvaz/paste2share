import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [WebsocketModule, QrcodeModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
