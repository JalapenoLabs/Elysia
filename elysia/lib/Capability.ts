// Copyright © 2025 Jalapeno Labs

import { Lifecycle } from './Lifecycle'

export class Capability extends Lifecycle {
  readonly name: string
  readonly description: string
  readonly version: number
  readonly group: string

  // abstract
  public async execute() {

  }
}
