import { asyncHandler } from '@helpers/async-handler';
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

  public static getInstance(): EventsManager {
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
  public static on(event: string, listener: (...args: any[]) => void | Promise<void>): void {
    try {
      EventsManager.getInstance().emitter.on(event, asyncHandler(listener));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Remove an event listener.
   * @param event The event name.
   * @param listener The listener function.
   */
  public static emit(event: string, ...args: any[]): void {
    EventsManager.getInstance().emitter.emit(event, ...args);
  }

  /**
   * Create a queue to store events.
   * @returns An EventsQueue object.
   * @see EventsQueue
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
          EventsManager.emit(item.event, ...item.args);
        });

        this.clear();
      }
    }
  }
}
