// src/modules/metrics/metrics.module.ts
import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Registry } from 'prom-client';
import { REGISTRY } from '../../constants/metrics.constants';

@Module({
  imports: [PrometheusModule.register()],
  controllers: [MetricsController],
  providers: [
    {
      provide: REGISTRY,
      useValue: new Registry(),
    },
  ],
})
export class MetricsModule {}
