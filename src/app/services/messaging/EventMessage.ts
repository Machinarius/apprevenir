export enum KnownMessageKeys {
  ProfileChanged
}

export abstract class EventMessage {
  public abstract get key(): KnownMessageKeys;
}

export abstract class EventMessageWithPayload<TPayload> {
  public abstract get payload(): TPayload;
}