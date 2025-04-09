// Copyright © 2025 Jalapeno Labs

import { EventEmitter } from 'events';

export class Lifecycle {
  protected readonly events = new EventEmitter<{
    mount: []
    unmount: []
  }>();

  protected isMounted: boolean = false;

  public mount() {
    this.isMounted = true;
  }

  public unmount() {
    this.isMounted = false;
  }
}
