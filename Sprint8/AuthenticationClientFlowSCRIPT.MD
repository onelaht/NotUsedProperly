# Slide 3 — The client's account and sign-in journey

Diagram: [AuthenticationClientFlow.MMD](AuthenticationClientFlow.MMD)

## Slide bullets

- Create account, then complete profile
- Returning clients reuse their credentials
- Backend checks every protected request

## Commentary script — about 90 seconds

“There are two ways into this journey. At the top left, a new client creates an account with their email, password, and name. The backend saves the account, assigns the client role, and returns a signed access pass. Passwords are stored as a protected one-way representation, rather than readable text.

The new client then completes their personal details and investment preferences. The backend saves this profile and creates or updates the linked client record. The website then takes them to the main client experience. Account creation and profile completion are separate steps, so simply creating credentials does not mean the profile is complete.

On the returning-client path, the backend checks the email and password against the saved account and issues an access pass if they match. The website takes clients with unfinished profiles back to onboarding; clients with completed profiles can continue to the main site.

Once signed in, the website includes that pass with protected requests automatically. The backend checks that it is valid and applies any permissions required for the requested action. An invalid or expired pass, or insufficient permission, prevents access.

The outcome is a connected journey from self-registration to a linked client profile, with access checks in the backend.”

## Presenter notes — keep off the slide

- “Signed access pass” means JWT. Current login/signup tokens expire after one hour.
- Signup creates a user, CLIENT role, and incomplete placeholder profile; the main client record is created during onboarding if absent.
- Profile-completion routing is enforced by the website guard. Do not describe it as a blanket backend restriction on every endpoint.
- The backend verifies token validity and applies endpoint-specific permission and ownership checks. The website stores its session locally and attaches the token to requests.
- Invalid credentials stop at the verification step; the diagram emphasizes the successful journey.
- Source check: `frontend/src/app/core/auth/`, `frontend/src/app/onboarding.ts`, and backend `AuthServiceImpl.java`, `UserServiceImpl.java`, `ClientOnboardingServiceImpl.java`, and `config/SecurityConfig.java`.
