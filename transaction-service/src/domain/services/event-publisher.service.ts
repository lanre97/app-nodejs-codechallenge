import { TransactionEvents } from 'src/common/constants';

export interface EventPublisherService {
  publish: (event: TransactionEvents, data: any) => Promise<void>;
}
