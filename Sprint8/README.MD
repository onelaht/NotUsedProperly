# Sprint 8 weekly presentation

Five slides for stakeholders, with roughly six minutes of speaking time. Each `.MMD` contains a standalone Mermaid diagram. Its matching `SCRIPT.MD` contains a slide title, three short supporting bullets, a speaking script, and off-slide presenter notes.

| Slide | Diagram | Bullets and commentary |
| --- | --- | --- |
| 1. Overall architecture | [Architecture.MMD](Architecture.MMD) | [ArchitectureSCRIPT.MD](ArchitectureSCRIPT.MD) |
| 2. Authentication refactor | [AuthenticationRefactor.MMD](AuthenticationRefactor.MMD) | [AuthenticationRefactorSCRIPT.MD](AuthenticationRefactorSCRIPT.MD) |
| 3. Authentication and client journey | [AuthenticationClientFlow.MMD](AuthenticationClientFlow.MMD) | [AuthenticationClientFlowSCRIPT.MD](AuthenticationClientFlowSCRIPT.MD) |
| 4. Fauxnance quotes | [FauxnanceQuotes.MMD](FauxnanceQuotes.MMD) | [FauxnanceQuotesSCRIPT.MD](FauxnanceQuotesSCRIPT.MD) |
| 5. Fauxnance candles and rendering | [FauxnanceCandles.MMD](FauxnanceCandles.MMD) | [FauxnanceCandlesSCRIPT.MD](FauxnanceCandlesSCRIPT.MD) |

## Slide layout

Use the diagram as the main visual, with the three bullets beside or below it. Put the commentary in speaker notes. Keep implementation details and source checks off the presentation slide.

Authentication gets two slides to balance the decision with the experience: slide 2 covers the original limitation and the team's choice to extend the existing backend; slide 3 covers new and returning clients plus access checks. Avoid adding the framework discussion to slide 3.

The diagrams describe the current code at a high level. The NestJS recommendation is team-supplied background. Labels use plain language, including “signed access pass” for JWT. Fauxnance is described as educational market data, with availability and freshness notices reflected in the scripts.
