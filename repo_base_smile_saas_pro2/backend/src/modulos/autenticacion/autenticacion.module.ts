import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AutenticacionController } from './autenticacion.controller';
import { AutenticacionService } from './autenticacion.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto-demo',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  exports: [AutenticacionService, JwtModule],
})
export class AutenticacionModule {}
