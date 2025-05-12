# Redemption Application

## Overview

This application is my submission for the developer role at Thanx.  It is an application built to the specifications outlined [here](https://docs.google.com/document/d/1W46Co5_xHGgySKfO82jNsmxAURi-nwfA-7_P0Lm09I0/edit?tab=t.0).  The goal of the application is to create a basic rewards redemption application that allows the user to:
1. view their current points balance
2. Browse available rewards
3. Redeem rewards using points
4. See a history of their rewards redemptions



## Running the Application

You can run the app using Docker **(recommended)** or locally.

### Docker

To setup the application using Docker, enter the application root directory and run these two commands.
```bash
docker-compose build
docker-compose up
```
To test the backend

```bash
docker-compose run --rm backend bundle exec bin/rails spec
```
To test the frontend
```bash
docker-compose run --rm frontend npm test
```

The application can be found at `localhost:5173`.

### Local Setup
Local setup is straightforward. ensure that the local Ruby version is 3.4.3.  To setup and run the application in the backend run the following:
```bash
cd backend
bundle install
rails db:prepare
rails s
```

To setup and run the frontend run the following commands
```bash
cd frontend
npm install
npm run dev
```

The application can be found at `localhost:5173`.


## Using the Application

The application is straightforward to use. It features three main sections:

1. **Points Header** – Displays the user's current point balance and includes a test input to adjust points manually.
2. **Rewards Page** – Displays a paginated list of redeemable rewards.
3. **Claimed Rewards Page** – Shows a history of redeemed rewards.

> The app is automatically seeded with one user and 100 randomly generated rewards during setup.

---

### Rewards Page

The Rewards page displays all available rewards in a paginated format for scalability. Users can:

- **Redeem rewards** by clicking the "Redeem" button on a reward card.
- **Sort rewards** by:
  - Points cost (ascending/descending)
  - Title (A → Z or Z → A)
- **Receive feedback** via a confirmation message that shows the reward name and cost upon successful redemption.
- **See their balance update** in real time after redeeming a reward.

Redemption eligibility is enforced both on the **frontend** (disabling buttons when insufficient points) and **backend** (rejecting unauthorized redemptions).

---

### Claimed Rewards Page

This section lists all rewards the user has successfully redeemed, ordered by redemption date (most recent first). Each entry shows the reward name, point cost, and date of redemption.

---

### Points Header

Located at the top of the application, the header includes:

- The **current points balance** for the user.
- A form field that allows updating the user's point balance manually (for testing purposes only).


## Tech Stack

There are two components to this application, the Ruby on Rails backend and the React frontend.

### Code Quality

- **Backend**: Uses RuboCop for static analysis (`rubocop`).
- **Frontend**: Uses ESLint (`npm run lint`).

Both codebases were linted before submission.


### Backend

#### Stack
- **Ruby** 3.4.3
- **Rails** 8.0.2 (API Mode)
- **SQLite**
- **Rspec** for testing

#### Points Service Layer

The `PointsService` class encapsulates all business logic related to a user's points balance and reward redemptions. It acts as an intermediary between the controller layer and the underlying models (`User`, `Reward`, and `Redemption`), ensuring that balance changes and redemptions are handled consistently and safely.

##### Responsibilities

- **Setting a user’s points balance** (e.g., for testing purposes)
- **Redeeming rewards**, including:
  - Checking whether the user has enough points
  - Deducting points from the balance
  - Creating a corresponding `Redemption` record

All balance updates are handled through this single entrypoint, reducing duplication and centralizing validation and error handling.

##### Implementation

- Uses `ActiveRecord::Base.transaction` to ensure atomicity of redemptions.
- Wraps updates in `user.with_lock` to apply row-level pessimistic locking, preventing race conditions during concurrent updates.
- Raises descriptive exceptions for invalid operations (e.g., negative points, insufficient balance).
- Maintains immutability of historical data by recording redemptions separately from rewards or balances.

##### Benefits

- **Separation of Concerns**: Keeps controller actions clean and focused on request/response logic.
- **Reusability**: Can be reused across multiple endpoints or jobs without duplicating logic.
- **Testability**: Encapsulated logic makes it easier to write unit and integration tests against business rules.

##### Tradeoffs

- **Increased Indirection**: Adding a service layer adds some complexity compared to placing logic directly in controllers or models.
- **Not Granular by Operation**: For a simple app, grouping both point-setting and reward-redemption in a single service is sufficient, but a more complex domain might benefit from separating concerns further (e.g., `PointsAdjustmentService` vs `RedemptionService`).

#### Data model

The data model consists of three core entities: `User`, `Reward`, and `Redemption`. This structure supports tracking a user's points balance, displaying available rewards, and maintaining a history of redemptions.

##### User
Represents a participant in the rewards program.
- Maintains the current points balance.
- Validates presence of a name and enforces a non-negative balance.
- Associated with Reward through the Redemption join model.

##### Reward
Represents a reward that users can redeem using their points.
- Defines a `points_cost` that determines redemption eligibility.
- Supports sorting via a `sorted_by` scope using predefined options.
- Connected to `User` through many-to-many relationships via `Redemption`.

##### Redemption
Represents the act of a user redeeming a specific reward at a given time.
- Serves as a historical record of redemptions.
- Captures a timestamp of when the redemption occurred.
- Designed to be append-only, ensuring an immutable audit trail.

###### Tradeoffs and Considerations
- Normalization: The schema avoids data duplication by using foreign keys and join tables.
- Auditability: Redemptions preserve a history of user activity without altering past records.
- Mutability: points_cost is not snapshotted in the Redemption model. In a production system, it may be beneficial to denormalize this field at redemption time to preserve historical accuracy if reward costs change.
- Validation: Basic validations are implemented at the model level. Additional database-level constraints (indexes, foreign key constraints, uniqueness validations) could be added for robustness and performance in a production context.



#### Decisions and Tradeoffs

The primary concern of the application is ensuring the consistency and integrity of the user's points balance. Users should not be able to redeem rewards they cannot afford, and they should not be charged points unless the reward redemption is successfully completed. This includes guarding against edge cases such as partial failures, race conditions, or unexpected errors during the transaction process.

##### Transactional Consistency
The redemption flow uses `ActiveRecord::Base.transaction` in combination with `user.with_lock` to enforce both atomicity and row-level pessimistic locking. This ensures that race conditions are avoided during concurrent balance updates and reward redemptions.

**Tradeoff**: This is a pretty simple locking strategy, that would not necessarily scale well with distributed systems, but for a simple implementation of a rewards app it is sufficient.


##### No Authentication
- Skipped user auth (e.g., Devise, JWT) and assumed `User.first` for simplicity, as allowed by the prompt.
- **Tradeoff**: This sacrifices realism for speed. In a real system, each API call would be scoped to the authenticated user.

##### Service Objects for Business Logic
- Moved complex logic (e.g., setting points, redeeming rewards) into service classes, and to have a single entrypoint for changing user balance.  
- This improves testability and keeps controllers slim.
- **Tradeoff**: Slight increase in complexity, but better separation of concerns.

##### Testing
- Backend includes request specs for all major endpoints.
- **Tradeoff**: Focused testing on core flows (points update, redemption); did not mock edge cases like DB failures or race conditions.


### Frontend
- **React** 18+
- **Vite** for dev server and build tooling
- **Jest** for testing


#### Tradeoffs & Considerations

##### **Client-Side Only Routing**
- The application is rendered entirely on the client with basic conditional rendering (e.g., tabs).
- **Tradeoff**: No routing library (like React Router) was used to keep the complexity minimal. This limits deep-linking or bookmarkable views, which could be addressed in a more production-ready version.

##### **Basic Styling**
- Styling is applied inline and via basic class names.
- **Tradeoff**: This keeps the visual layer lightweight and easy to inspect, but lacks scalability and consistency you’d get from a utility framework like Tailwind or component libraries like Material UI.

##### Error & Loading States
- API failures are handled locally within components (e.g., setting error messages on failed fetch).
- A global `ErrorBoundary` component is included to catch and display fallback UI for uncaught rendering errors.
- **Tradeoff**: While render-time errors are handled globally, async errors and loading states are managed manually in each component. In a production app, you'd likely add centralized loading indicators, toast notifications, and consistent error display patterns.

##### **Manual Pagination & Sorting**
- Pagination and sorting are handled via URL parameters and manual button rendering.
- **Tradeoff**: While functional, it lacks polish compared to libraries like `react-table`, but provides transparency into data fetching logic for evaluation.

##### **Component Separation**
- The UI is broken down into modular components by responsibility (e.g., `PointsBalance`, `RewardsList`, `RedemptionHistory`).
- **Tradeoff**: This keeps the app composable and easy to reason about without over engineering the structure for a small app.


##### Testing

- Tests are included, but not comprehensive
- **Tradeoff**: Due to time constraints several conditions are not tested.  


## Limitations and Future Improvements

- Add authentication and multi-user support
- Snapshot reward cost in redemptions for historical accuracy
- Improve frontend UI polish and accessibility
- Expand automated test coverage, especially on the frontend
- Introduce user-facing loading indicators and success/error toasts


## Deployment

While this application is not deployed, it is designed to be easily deployable on any container-based hosting provider (e.g., Render, Railway, Heroku with Docker support).

Environment-specific values (like `VITE_API_URL`) can be configured via environment variables.
