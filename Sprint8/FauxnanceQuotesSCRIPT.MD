# Slide 4 — A price snapshot with context

Diagram: [FauxnanceQuotes.MMD](FauxnanceQuotes.MMD)

## Slide bullets

- Load on page entry; refresh on demand
- Price, movement and source shown together
- Educational data with freshness warnings

## Commentary script — about 60 seconds

“The quote gives the client a snapshot of a stock's price. Opening the stock's market page requests the latest quote, and the Refresh button lets the client request another snapshot.

The website sends the stock identifier and the client's access pass to our backend. The backend checks access, prepares the stock identifier consistently, and contacts Fauxnance using the project's service credential. That credential stays in the backend.

Fauxnance returns the price and supporting information. The backend passes that information to the website, where the client sees the price, any available change from the previous close, buying and selling quote details, the time of the quote, and its source.

If the provider flags a quote as stale, the website displays a warning. Failed requests also display an error. The quote is requested when the page opens or the client refreshes it; it is a snapshot rather than a continuously updating feed. The educational-use notice is displayed alongside the information.”

## Presenter notes — keep off the slide

- Quote retrieval does not write to the project database.
- Quote and candle requests start separately on entry to the market page; refreshing the quote does not reload the chart.
- The backend uses a Fauxnance API key; the client's signed pass and the provider credential serve different purposes.
- Missing optional values are shown as unavailable, and freshness warnings depend on provider metadata.
- Source check: `frontend/src/app/core/api/market-data.service.ts`, `frontend/src/app/features/trade/trade.component.ts`, its HTML template, and backend `FauxnanceQuoteController.java` / `FauxnanceQuoteServiceImpl.java`.
