import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPublisherService } from 'src/domain/services/event-publisher.service';
import { KAFKA_SERVICE } from '../utils/constants';

@Injectable()
export class KafkaEventPublisherService implements EventPublisherService {
  constructor(@Inject(KAFKA_SERVICE) private readonly client: ClientKafka) {}
  async publish(event: string, data: any): Promise<void> {
    const stringData = JSON.stringify(data);
    this.client.emit(event, stringData);
  }
}
