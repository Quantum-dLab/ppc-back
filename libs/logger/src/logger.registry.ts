import { AppLogger, LoggerDriver } from './types';

export class LoggerDriverRegistry {
  private drivers = new Map<string, LoggerDriver>();
  private current?: { name: string; root: AppLogger; driver: LoggerDriver };

  register(driver: LoggerDriver) {
    this.drivers.set(driver.name, driver);
  }
  async init(name: string) {
    const drv = this.drivers.get(name);
    if (!drv) throw new Error(`Logger driver not found: ${name}`);
    const root = await drv.createRootLogger();
    this.current = { name: drv.name, root, driver: drv };
  }

  getRoot(): AppLogger {
    if (!this.current) throw new Error('Logger not initialized');
    return this.current.root;
  }
  getCurrentDriver(): LoggerDriver {
    if (!this.current) throw new Error('Logger not initialized');
    return this.current.driver;
  }

  async switchTo(name: string,) {
    const next = this.drivers.get(name);
    if (!next) throw new Error(`Unknown driver: ${name}`);
    const prev = this.current;
    const nextRoot = await next.createRootLogger();
    this.current = { name: next.name, root: nextRoot, driver: next };
    try {
      const prevDrv = this.drivers.get(prev!.name)!;
    } catch {
      // Ignore errors when closing previous driver
    }
  }
}
