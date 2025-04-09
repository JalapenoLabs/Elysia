// Copyright © 2024 Elysia

// Good practice overrides into the module declaration file:
// https://www.npmjs.com/package/bulma-smart-react-forms
import 'bulma-smart-react-forms'

declare module 'bulma-smart-react-forms' {
  // Overrides id to be required
  export interface ButtonProps {
      id: string
  }
}

export {}
