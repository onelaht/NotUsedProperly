# Slide 5 — From daily prices to a readable chart

Diagram: [FauxnanceCandles.MMD](FauxnanceCandles.MMD)

## Slide bullets

- Up to 30 daily trading sessions
- One candle summarizes four prices
- Direction and daily range visible at a glance

## Commentary script — about 100 seconds

“The candle chart adds price history to the latest quote. When a client opens a stock's market page, the website requests daily history through our backend. The backend checks access and the date range, then asks Fauxnance for the daily prices. It returns those values and any data notices to the website.

The lower part of the diagram shows how the chart is actually drawn. The website puts the days in chronological order and keeps up to the latest thirty trading sessions. Dates run from left to right. All prices use the same vertical scale, so the heights can be compared across days.

For each day, the website takes four prices: the opening price, the highest price, the lowest price, and the closing price. It draws a rectangle between the opening and closing prices. That is the candle's body. A thin vertical line stretches from the day's lowest to highest price. That is the wick, and it shows the full daily range.

Days that close at or above their opening price use a filled green body. Days that close below their opening price use a red outline. For example, if a stock opens at one hundred, closes at one hundred and five, reaches one hundred and eight, and falls as low as ninety-eight, the body spans one hundred to one hundred and five, while the wick spans ninety-eight to one hundred and eight.

The browser draws these shapes from the numbers it receives. The website also provides a legend, a table of daily values, and notices for partial or stale history when reported. This lets the client see both the pattern and the figures behind it.”

## Presenter notes — keep off the slide

- The chart is drawn directly with SVG shapes in Angular's `CandleChartComponent`; this candle component does not use Chart.js.
- The website requests the preceding 90 calendar days to allow for weekends and holidays, then sorts and selects up to 30 returned sessions. Thirty sessions are not guaranteed.
- Each candle uses open, high, low, and close; adjusted close and volume do not set the candle shape. Volume and the synthetic/stored label appear in the table.
- The price scale includes padding. Very small or equal opening/closing differences get a minimum visible body height.
- History is returned from Fauxnance without saving it to the project database. The backend supplies data; the browser renders the chart.
- The chart has its own loading, retry, empty, and error states. Partial/stale notices and the educational-use disclaimer appear below it.
- Source check: `frontend/src/app/core/api/market-data.service.ts`, `frontend/src/app/features/trade/trade.component.ts`, `candle-chart.component.ts`, `trade.component.html`, and backend `FauxnanceDailyCandleServiceImpl.java`.
