import { ConsoleAppLogger } from './console.logger';
import { LoggerDriverRegistry } from './logger.registry';
import { AppLogger, BaseBindings } from './types';

export class LoggerManager {
  constructor(private readonly registry: LoggerDriverRegistry) {}

  private static _factory?: () => AppLogger;

  static registerFactory(factory: () => AppLogger) {
    this._factory = factory;
  }

  logger(bindings?: BaseBindings): AppLogger {
    const base = this.registry.getRoot();
    const merged = LoggerManager.resolveBindings(bindings);
    return Object.keys(merged).length ? base.child(merged) : base;
  }

  static resolveLogger(bindings?: BaseBindings): AppLogger {
    if (!this._factory) return new ConsoleAppLogger(bindings ?? {});
    const base = this._factory();

    const merged = LoggerManager.resolveBindings(bindings);

    return Object.keys(merged).length ? base.child(merged) : base;
  }

  static resolveBindings(bindings?: BaseBindings): BaseBindings {
    return {
      ...bindings,
    };
  }

  static tryResolveLogger(bindings?: BaseBindings): AppLogger | null {
    try {
      return this.resolveLogger(bindings);
    } catch {
      return null;
    }
  }

  async switchTo(name: string) {
    await this.registry.switchTo(name);
    return this.logger();
  }
}
