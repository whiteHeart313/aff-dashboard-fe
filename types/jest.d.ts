/// <reference types="jest" />
/// <reference types="@types/jest" />

// This file ensures Jest types are available globally in test files
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
    }
  }
}

export {}
