import { Module, Global } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

/**
 * AuditModule es @Global para que AuditService pueda ser inyectado
 * en cualquier módulo sin necesidad de importarlo explícitamente.
 */
@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
