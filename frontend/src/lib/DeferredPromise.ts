// Copyright © 2025 Elysia


import EventEmitter from 'events'

type DeferredPromiseEvents<Type> = {
  onResolve: [Type]
  onReject: [unknown]
  onFinish: [Type | unknown]
}

export class DeferredPromise<Type = any> extends Promise<Type> {
  public resolvedValue?: Type
  public rejectedValue?: unknown
  public isResolved: boolean = false
  public isRejected: boolean = false

  private originalResolve!: (value: Type) => void
  private originalReject!: (reason?: any) => void

  private events = new EventEmitter<DeferredPromiseEvents<Type>>()

  constructor() {
    super((resolve, reject) => {
      this.originalResolve = resolve
      this.originalReject = reject
    })

    // Bind the resolve and reject methods to ensure correct 'this' context
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  public resolve(value: Type): void {
    if (this.isResolved || this.isRejected) {
      throw new Error('Promise has already been settled.')
    }

    this.isResolved = true
    this.resolvedValue = value

    // Resolve the underlying Promise
    this.originalResolve(value)

    // Emit events
    this.events.emit('onResolve', value)
    this.events.emit('onFinish', value)
  }

  public reject(reason: any): void {
    if (this.isResolved || this.isRejected) {
      throw new Error('Promise has already been settled.')
    }

    this.isRejected = true
    this.rejectedValue = reason

    // Reject the underlying Promise
    this.originalReject(reason)

    // Emit events
    this.events.emit('onReject', reason)
    this.events.emit('onFinish', reason)
  }

  public onResolve(listener: (value: Type) => void): void {
    this.events.on('onResolve', listener)
  }

  public onReject(listener: (reason: unknown) => void): void {
    this.events.on('onReject', listener)
  }

  public onFinish(listener: (result: Type | unknown) => void): void {
    this.events.on('onFinish', listener)
  }
}
