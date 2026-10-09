# Slide 1 — How Tadpoles fits together

Diagram: [Architecture.MMD](Architecture.MMD)

## Slide bullets

- One place for client and portfolio activity
- Access controlled by user role
- Account records and market data have separate sources

## Commentary script — about 60 seconds

“Tadpoles brings the client experience and portfolio operations together in one application. Start on the left: clients and staff use the website to view their dashboard, profile, and market information.

The website sends requests to our application services. This is where sign-in is handled, permissions are checked, and the rules for client and portfolio activity are applied. The database holds the records the project manages, including accounts, client profiles, portfolios, and trades.

On the right is Fauxnance, the external service that provides educational market prices and daily price history. Our application requests that information and returns it to the website. These quote and candle requests do not save market data into our database.

The key takeaway is that the website presents the experience, the application services handle access and operations, and each type of information comes from its appropriate source.”

## Presenter notes — keep off the slide

- This is a logical architecture, with implementation layers grouped for readability.
- The website is Angular, the backend is Java Spring Boot, and the database is PostgreSQL. Name these only if asked.
- The current web login calls the backend directly. The earlier Node authentication stub remains in the repository and Docker Compose, but is not part of that client login path.
- Source check: `frontend/src/app/app.routes.ts`, `frontend/src/app/core/api/api-url.ts`, `backend/pom.xml`, `docker-compose.yml`, and the quote/candle service implementations.
