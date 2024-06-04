import { Validator } from './validators/validator.interface';

export class ValidationOrchestrator<T> {
  private validators: Validator<T>[] = [];
  constructor(validators: Validator<T>[]) {
    this.validators = validators;
  }
  public validate(transaction: T): boolean {
    return this.validators.every((validator) =>
      validator.validate(transaction),
    );
  }
}
