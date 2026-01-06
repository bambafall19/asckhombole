import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type AppEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// This is a workaround for the fact that you can't declare a generic event emitter
// See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32915
declare interface AppEventEmitter {
  on<U extends keyof AppEvents>(event: U, listener: AppEvents[U]): this;
  emit<U extends keyof AppEvents>(
    event: U,
    ...args: Parameters<AppEvents[U]>
  ): boolean;
}

class AppEventEmitter extends EventEmitter {}

export const errorEmitter = new AppEventEmitter();
