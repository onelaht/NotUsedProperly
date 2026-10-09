# Slide 2 — From demo accounts to client signup

Diagram: [AuthenticationRefactor.MMD](AuthenticationRefactor.MMD)

## Slide bullets

- Clients create their own credentials
- Existing backend functionality retained
- Targeted refactor supports the client journey

## Commentary script — about 60 seconds

“The earlier authentication setup worked with a fixed set of demonstration accounts listed in a server file. That let us demonstrate access for different roles, but a new client could not create their own credentials through the application and then sign in using that setup.

A move to NestJS was recommended for authentication. By that point, the team had already built functionality in the existing backend. We chose to extend that backend so we could support the client journey while retaining the work already completed.

The refactor connects registration and sign-in to accounts stored in the database. A client can now create an account, complete their profile, and return using their own credentials. We kept the signed access-pass approach, known as JWT, and brought it into the database-backed flow.

This slide explains why the change was needed and the decision we made. The next slide shows what the client actually experiences.”

## Presenter notes — keep off the slide

- NestJS recommendation and the team's prior investment are presentation context supplied by the team; the repository confirms the implemented backend is Spring Boot.
- The old `auth-stub/server.js` includes a fixed CLIENT demo account. The limitation was dynamic client registration and linkage, not the absence of any client-labelled account.
- The stub still exists; describe the client flow as refactored, rather than claiming the stub was deleted.
- Source check: `auth-stub/server.js`, `backend/src/main/java/com/neueda/leap/service/impl/AuthServiceImpl.java`, and `UserServiceImpl.java` in the same directory.
