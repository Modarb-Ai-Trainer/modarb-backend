import EventEmitter from 'node:events';

/**
 * EventsManager is a singleton class that manages events.
 * It uses the EventEmitter class from Node.js to handle events.
 */
export class EventsManager {
  private static instance: EventsManager;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  private static getInstance(): EventsManager {
    if (!EventsManager.instance) {
      EventsManager.instance = new EventsManager();
    }

    return EventsManager.instance;
  }

  /**
   * Register an event listener.
   * @param event The event name.
   * @param listener The listener function.
   */
  public on(event: string, listener: (...args: any[]) => void): void {
    this.emitter.on(event, listener);
  }

  /**
   * Remove an event listener.
   * @param event The event name.
   * @param listener The listener function.
   */
  public emit(event: string, ...args: any[]): void {
    this.emitter.emit(event, ...args);
  }

  /**
   * Create a queue to store events.
   * @returns An EventsQueue object.
   */
  public createQueue() {
    return new class EventsQueue {
      private queue: any[] = [];

      public add(event: string, ...args: any[]): void {
        this.queue.push({ event, args });
      }

      public clear() {
        this.queue = [];
      }

      public process() {
        this.queue.forEach((item) => {
          EventsManager.getInstance().emit(item.event, ...item.args);
        });

        this.clear();
      }
    }
  }
}
