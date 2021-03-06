import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { EventMessage, KnownMessageKeys } from "./EventMessage";

export class EventBus {
  private backend: Subject<EventMessage>;

  private constructor() {
    this.backend = new Subject<EventMessage>();
  }

  private static _instance: EventBus;
  public static get instance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }

    return EventBus._instance;
  }

  public messages<TMessage extends EventMessage>(key: KnownMessageKeys): Observable<TMessage> {
    return this.backend.pipe(
      filter(message => message.key === key)
    ) as Observable<TMessage>;
  }

  public publishMessage(message: EventMessage) {
    this.backend.next(message);
  }
}