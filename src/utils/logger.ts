import { Signale } from 'signale';

export class Logger extends Signale {
  constructor(name: string) {
    super({ scope: name });
  }
}
