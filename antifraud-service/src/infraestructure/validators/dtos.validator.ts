import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Validator } from '../../application/validation/validators/validator.interface';
import { Logger } from '@nestjs/common';

export class DtoValidator<T extends object> implements Validator<T> {
  private readonly logger = new Logger('DtoValidator');
  private readonly type: new () => T;

  constructor(type: new () => T) {
    this.type = type;
  }

  public async validate(object: T): Promise<boolean> {
    try {
      const instance = plainToInstance(this.type, object, {
        enableImplicitConversion: true,
      });
      await validateOrReject(instance);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
