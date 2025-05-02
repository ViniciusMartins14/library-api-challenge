import { Controller, Get, Inject } from '@nestjs/common';
import { Registry } from 'prom-client';
import { REGISTRY } from '../../constants/metrics.constants';

@Controller('metrics')
export class MetricsController {
  constructor(@Inject(REGISTRY) private readonly registry: Registry) {}

  @Get()
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
