# Project Conventions and Practices

This document outlines the architectural patterns, naming conventions, and coding practices used in the `propinq-frontend` Angular project. The goal is to provide a consistent and maintainable codebase.

## 1. Architecture

The project follows a **modular architecture** with a clear separation of concerns.

### 1.1 Module Structure

The `src/app` directory is divided into logical modules, each representing a distinct feature or domain of the application (e.g., `auth`, `buildings`, `contacts`, `maps`, `shared`, `users`).

Each module typically contains the following subdirectories:

*   `components/`: Houses reusable UI components specific to the module.
*   `dialogs/`: Contains components used as dialogs (e.g., for forms, confirmations).
*   `interfaces/`: Defines TypeScript interfaces for data models and types used within the module.
*   `enums/`: Defines TypeScript enumerations for sets of named constant values.
*   `pages/`: Contains top-level components that represent full pages or views in the application.
*   `services/`: Provides services for data fetching, business logic, and state management.
*   `adapters/`: (Optional) Contains classes for adapting data between different formats (e.g., API responses to application models).
*   `constants.ts`: (Optional) Stores module-specific constants.
*   `*.routes.ts`: Defines routing configurations for the module.

### 1.2 Core Modules

*   `shared/`: This module is crucial for housing reusable components, directives, pipes, and services that are used across multiple other modules. It promotes reusability and avoids code duplication.
*   `layouts/`: Contains components responsible for the overall application layout (e.g., header, sidebar, footer).
*   `environments/`: Manages environment-specific configurations (e.g., API URLs, reCAPTCHA keys).

## 2. Technologies and Libraries

*   **Angular:** The primary framework for building the single-page application.
*   **TypeScript:** Used for type-safe and robust code development.
*   **Angular Material:** A UI component library providing pre-built, high-quality components following Material Design guidelines.
*   **RxJS:** Used extensively for reactive programming, managing asynchronous operations, and handling events.
*   **Angular Signals:** Leveraged for modern, reactive state management within components and services.
*   **OpenLayers (`ol`):** Utilized for mapping functionalities (inferred from `package.json`).
*   **reCAPTCHA:** Integrated for security purposes, especially in authentication flows.

## 3. Coding Practices

### 3.1 Components

*   **Standalone Components:** Components are preferably standalone (`standalone: true`) to reduce boilerplate and improve tree-shakability.
*   **Reactive Forms:** `FormBuilder` and `FormGroup` are used for handling forms, enabling robust validation and state management.
*   **Input Validation:** Angular's built-in `Validators` (e.g., `Validators.required`, `Validators.email`) are used for client-side form validation.
*   **UI State Management:** `WritableSignal` is used for managing component-specific UI state (e.g., `isLoading`, `errorMessage`, `hidePassword`).
*   **Lifecycle Hooks:** `ngOnInit` is used for initialization logic, such as loading external scripts or fetching initial data.

### 3.2 Services

*   **Dependency Injection:** Services are injected using either the `inject` function or constructor injection.
*   **State Management:** Services manage application-wide or module-specific state using Angular Signals (`signal`, `computed`).
*   **Asynchronous Operations:** RxJS observables are used for all asynchronous operations (e.g., HTTP requests, timers). Operators like `tap`, `finalize`, and `catchError` are commonly used for side effects and error handling.
*   **Token Management:** Clear and encapsulated methods (`setTokens`, `getTokens`, `clearTokens`) are provided for managing authentication tokens (access and refresh tokens).
*   **Error Handling:** Services implement error handling for API calls, often returning `EMPTY` or `throwError` observables in case of errors.

### 3.3 TypeScript

*   **Interfaces:** Interfaces are widely used to define the shape of data objects, ensuring type safety throughout the application.
*   **Enums:** Enums are used for defining a set of related constant values, improving code readability and maintainability.
*   **Type Safety:** Explicit typing is encouraged for variables, function parameters, and return values.

### 3.4 API Interaction

*   **HttpClient:** Angular's `HttpClient` is used for making HTTP requests to the backend API.
*   **Environment Variables:** API URLs are configured using environment variables (`environment.apiUrl`) to facilitate easy switching between development, staging, and production environments.

## 4. Naming Conventions

The project adheres to standard Angular and TypeScript naming conventions, promoting consistency and readability.

*   **Files:**
    *   Components: `feature-name.component.ts`, `feature-name.component.html`, `feature-name.component.css`
    *   Services: `feature-name.service.ts`
    *   Interfaces: `entity-name.interface.ts`
    *   Enums: `enum-name.enum.ts`
    *   Routes: `feature-name.routes.ts`
*   **Classes:** PascalCase (e.g., `AuthService`, `LoginFormComponent`).
*   **Interfaces:** PascalCase, often prefixed with `I` (though not strictly enforced, `AuthResponse` is an example) or simply descriptive (e.g., `UserAuth`).
*   **Enums:** PascalCase (e.g., `AuthStatus`, `Role`).
*   **Functions/Methods:** camelCase (e.g., `login`, `checkStatus`, `loadRecaptchaScript`).
*   **Variables:** camelCase (e.g., `loginForm`, `isLoading`, `accessToken`).
*   **Private Members:** Private class members are typically prefixed with an underscore (`_`) (e.g., `_authState`, `_storage`).
*   **Constants:** UPPER_SNAKE_CASE for global constants (e.g., `INITIAL_STATE`, `environment.reCAPTCHA_SiteKey`).

## 5. Security

*   **Token-Based Authentication:** The application uses access and refresh tokens for user authentication, a common and secure practice.
*   **reCAPTCHA:** Integrated into authentication flows to prevent bot attacks and ensure legitimate user interactions.

This document serves as a living guide for developers contributing to the `propinq-frontend` project. Adhering to these conventions will help maintain a high-quality, scalable, and understandable codebase.