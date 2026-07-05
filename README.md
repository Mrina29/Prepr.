Prepr — Persistent Memory Copilot for Placement Prep

Built for The Hangover Part AI: Where's My Context? (Cognee x WeMakeDevs) — Best Use of Cognee Cloud track.

The problem

Every CS student juggling internships, hackathons, and placements loses context constantly:


"Have I already solved a DP problem like this one, and what pattern did I use?"
"What did I tell this recruiter about my projects last time?"
"What feedback did I get last interview that I should not repeat?"
Old resume versions pile up with no way to know which are stale.


Today this lives scattered across DOCX files, memory, and vibes. Prepr gives it a real, queryable memory.

What it does — full Cognee memory lifecycle

OperationWhere it's usedrememberIngest DSA solutions, resume versions, and job descriptions into the knowledge graphrecallAsk natural questions ("have I solved something like this before?") and get graph-grounded answersimprove (runs automatically inside remember)Logging interview/OA feedback re-cognifies the graph, linking mistakes to the pattern they belong to, so future recalls on that pattern surface the warningforgetPrune outdated resume versions or JDs once a company outcome is final

Tech


Cognee Cloud (cognee.serve(), remember, recall, forget) — no self-hosted infra
Streamlit for the UI (app.py)
seed_data.py to bulk-load real DSA solutions / resumes / JDs before the demo


Run it

bashpip install -r requirements.txt
export COGNEE_URL="https://your-tenant.aws.cognee.ai"
export COGNEE_API_KEY="your-api-key"      # get free credit with code COGNEE-35
streamlit run app.py

Optionally seed real data first: python seed_data.py
