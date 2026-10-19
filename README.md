Creating an instruction

Create an in-depth instruction to refactor the current state of the project, assume this instruction is fed to codex or copilot:

The instructions should include
Remove the support for “Synthetic” instruments
Determine if some of the schema can be merged based on impDocs/…/ClientPageCrashCourse.md’s description on each schema
Still split the schema creation and insertions queries into different files.
There should only be one mode for trading; legacy and simulation mode cannot coexists.
In theory, Fauxnance API is pretty much the “provider” in terms of instruments and the platform is technically the broker too; meaning this project handles the transactions just retrieves the instrument feed from Fauxnance.
Brainstorm and create diagrams regarding the account arrangements, execution/reconciliation and settlement semantics, currency and instrument controls, operational readiness (if necessary)
Also think about this when selling a position as well.
Make sure to preexisting tickers are converted/reformatted so it can be traded right after initializing the project via docker compose.
Remove the CASH ticker and any currency and synthetic tickers based off the simulation mode.
For now, only support USD. Unless the business requirements based on HailMary.MD says otherwise
I feel like the platform shouldn’t need to support all three, what do you think of just having the ability to see the value conversion for currencies other than USD
This should be a drop down menu.
Create a “Withdraw” and “Deposit” feature
It should require the user to type in a properly formatted account nickname, routing, and account number.
Users should have the ability to have no banking setup yet at account creation, but should be required when attempting to place a trade.
It should allow to modify, add, or delete accounts.
Follow the settlement procedure from prior bullet point.
Additional quality of life 
Determine which specific role is supposed to allow/add/remove specific instruments that Client can trade in the platform.
If found, create a component in that specific roles page where it can
Add/Modify/Delete Instruments of the Market
There should be a tester, where it determine if the instrument typed in is valid within Fauxnance API.
This should be like a button right next to the “Enter Ticker/Instrument”
Fix some styling inconsistencies
The buy button text when buying a specific instrument seems unreadable due to the color.
Update client role
Make sure one of the demo client account has at least $10,000 as its cash balance for test purposes.
Update chart component
Is it possible to use TradingView candle to allow flexibility in terms of candle bar intervals and potential chart analysis tools.
Fauxnance API only supports daily candles, so no need for intraday, just daily.
\
The instruction should CLEARLY state:
Test test test, Use TTD approach
Keep each of the refactor request above within the business requirement rules
Analyze the entire codebase and Utilize all documentations ranging from HailMary.md, all MD file in impDocs/…/ClientPageImplementation and impDocs/…/SeparatePageImplementation
Document the all implementation, thoughts, and reasonings behind all the request from above in a file in impDocs/…/ClientPageImplementation/ClientRefactorCommentary.MD
Provide a in depth “how-to” and informational documentation regarding the refactor from whats changed (and the reasoning behind them) and how to use these features in impDocs/…/<YourFeature>IImplmentation/ClientRefactorCrashCourse.MD
Feel free to modify the backend/db, but retain the consistency in terms of project structure and design.
Regarding UI changes, you should ask yourself if it this usable/intuitive for casual users. If not, refactor
Save this instruction in impDocs/.../<YourFeature>Implmentation/ClientRefactorInstructions.MD

Executing an instruction

Read and execute the instruction in tadpoles/impDocs/Frontend/<YourDirectory>/<Name>.MD
