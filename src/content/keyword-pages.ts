export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

const sharedShortageSignals = [
  'Quote age and whether the supplier will hold allocation.',
  'Lead-time movement by part family, not only by supplier average.',
  'HBM, DDR5 RDIMM, GPU bundle, NAND, and cloud fallback exposure.',
  'Budget sensitivity if memory pricing moves before the purchase order is approved.',
]

export const keywordPages: KeywordPage[] = [
  {
    path: '/ai-memory-shortage-update',
    eyebrow: 'Market update',
    title: 'AI Memory Shortage Update',
    description:
      'A practical AI memory shortage update for procurement teams tracking HBM, DDR5, GPU server bundles, cloud fallback pricing, and six-month buying risk.',
    h1: 'AI memory shortage update for buyers who need decisions, not more noise',
    lede:
      'AI memory shortage coverage can sound abstract until a BOM, server list, and cloud fallback budget are on the table. MemoryRisk turns the update into a six-month action plan.',
    intent: 'For procurement, MSP, and infrastructure teams turning market headlines into purchase timing and substitution choices.',
    ctaLabel: 'Score my BOM',
    sections: [
      {
        heading: 'What changed for AI infrastructure buyers',
        paragraphs: [
          'HBM, server DDR5, SSD capacity, advanced packaging, and GPU allocation now interact as one procurement problem. A buyer can secure GPUs and still miss delivery because the memory stack or server bill of materials moved.',
          'The useful update is not just whether prices are up. It is which lines in your BOM have allocation risk, which suppliers are concentrated, and which substitutes are already approved.',
        ],
        bullets: sharedShortageSignals,
      },
      {
        heading: 'How to translate an update into a risk score',
        paragraphs: [
          'MemoryRisk weights part category, memory type, quoted lead time, supplier concentration, unit cost, quantity, and fallback availability. The score is designed for the next six months because that is where quotes, approval cycles, and delivery promises usually collide.',
          'The output is intentionally commercial: exposed spend, priority order, substitute suggestions, budget scenarios, and a procurement calendar.',
        ],
      },
      {
        heading: 'Where the team plan helps',
        paragraphs: [
          'The middle plan fits teams that need repeatable uploads, MSP client reports, and a shared view of supplier risk. Annual billing is selected by default because shortage monitoring is a recurring workflow.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this a news page?',
        answer: 'No. It is a buyer workflow page. Use it to convert public AI memory shortage signals into BOM risk, budget sensitivity, and purchase priority.',
      },
      {
        question: 'Does MemoryRisk predict exact prices?',
        answer: 'No. It models exposure and scenarios from your BOM, quotes, lead times, cloud fallback options, and public index direction.',
      },
      {
        question: 'What should I upload first?',
        answer: 'Start with a CSV or XLSX containing part, category, supplier, quantity, unit cost, lead weeks, memory type, and any cloud fallback.',
      },
    ],
  },
  {
    path: '/memory-shortage-2026',
    eyebrow: '2026 planning',
    title: 'Memory Shortage 2026 Planning',
    description:
      'Plan around the 2026 memory shortage with BOM risk scoring, HBM and DDR5 exposure checks, quote aging, and procurement calendar guidance.',
    h1: 'Memory shortage 2026 planning starts with the parts already in your buying queue',
    lede:
      'The 2026 memory shortage is not one uniform problem. HBM, DDR5 RDIMM, enterprise SSD, cloud instance pricing, and server bundle availability move differently.',
    intent: 'For teams building a 2026 infrastructure budget while memory supply remains tight.',
    ctaLabel: 'Build 2026 risk plan',
    sections: [
      {
        heading: 'Why a single market view is not enough',
        paragraphs: [
          'A generic shortage headline will not tell you whether to pull forward an order, approve an alternate part, or move a workload into cloud capacity for one quarter.',
          'A 2026 memory plan should connect three layers: market pressure, supplier quote behavior, and workload criticality.',
        ],
      },
      {
        heading: 'The six-month planning model',
        paragraphs: [
          'MemoryRisk scores the next six months because it is long enough to matter for server delivery and short enough for quotes, approvals, and cloud prices to stay actionable.',
          'The model highlights exposed spend, weighted lead time, HBM share, top supplier concentration, and the parts that should be handled before lower-risk replenishment.',
        ],
        bullets: [
          'Freeze high-risk quantities before supplier quotes age out.',
          'Approve alternates before a procurement committee needs them.',
          'Compare cloud fallback cost against delayed hardware delivery.',
          'Produce an MSP client report when customers need a simple decision memo.',
        ],
      },
      {
        heading: 'What a good report should contain',
        paragraphs: [
          'A useful shortage report should not bury the buyer in market commentary. It should show the top risk lines, substitutions, budget deltas, supplier comparison, and a dated purchase calendar.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Will the memory shortage end in 2026?',
        answer: 'Some segments may improve, but planning should assume uneven relief. HBM and server-grade memory can remain constrained even when a consumer segment loosens.',
      },
      {
        question: 'Should I buy everything early?',
        answer: 'No. Pull forward only the lines with high risk, high business dependency, or expiring allocation. MemoryRisk ranks those lines.',
      },
      {
        question: 'Can I compare cloud pricing too?',
        answer: 'Yes. The first version accepts cloud fallback fields, and later versions can connect cloud price APIs.',
      },
    ],
  },
  {
    path: '/global-memory-shortage',
    eyebrow: 'Global supply',
    title: 'Global Memory Shortage Procurement Guide',
    description:
      'Understand global memory shortage exposure across HBM, DDR5, NAND, server bundles, suppliers, cloud regions, and customer delivery calendars.',
    h1: 'The global memory shortage becomes local the moment it hits your server list',
    lede:
      'Global memory supply pressure reaches teams through quotes, lead times, allocation rules, regional cloud pricing, and delayed customer projects.',
    intent: 'For buyers who need a global shortage view translated into local procurement actions.',
    ctaLabel: 'Map my exposure',
    sections: [
      {
        heading: 'Where global pressure enters the BOM',
        paragraphs: [
          'AI demand can tighten HBM and advanced packaging first, but the effect can spill into conventional DRAM, server memory, and SSDs when suppliers shift capacity toward higher-value lines.',
          'That is why a global view should be connected to actual quantities and suppliers. Otherwise it is hard to tell which customer, region, or project is exposed.',
        ],
      },
      {
        heading: 'Supplier concentration matters',
        paragraphs: [
          'Two BOMs with the same memory type can have different risk if one relies on a single supplier and the other has validated alternates. Supplier share is a practical conversion of market risk into purchasing risk.',
        ],
        bullets: [
          'Track spend by supplier and by memory family.',
          'Flag lines where the top supplier controls most of exposed spend.',
          'Separate technical validation from commercial availability.',
          'Keep cloud fallback options visible for critical workloads.',
        ],
      },
      {
        heading: 'MSP client reporting',
        paragraphs: [
          'MSPs need a clean way to tell clients why a server refresh should be pulled forward, split across suppliers, or temporarily moved into cloud capacity. MemoryRisk creates a buyer-friendly report instead of a spreadsheet argument.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does global memory shortage mean every part is high risk?',
        answer: 'No. Risk depends on memory type, supplier behavior, quantity, lead time, and whether substitutes or cloud fallbacks are realistic.',
      },
      {
        question: 'How often should a global shortage report be refreshed?',
        answer: 'Refresh whenever a quote expires, a lead time changes, a supplier allocation moves, or a cloud fallback price changes materially.',
      },
      {
        question: 'Can this work for multiple customers?',
        answer: 'Yes. The partner plan is designed around customer workspaces and repeatable client reporting.',
      },
    ],
  },
  {
    path: '/when-will-the-memory-shortage-end',
    eyebrow: 'Timing',
    title: 'When Will the Memory Shortage End',
    description:
      'A practical answer to when the memory shortage will end, with planning signals for HBM, DDR5, cloud fallback capacity, and procurement timing.',
    h1: 'When will the memory shortage end? The safer question is which line eases first',
    lede:
      'Memory shortages rarely end everywhere at once. Procurement teams should track easing by part family, supplier, quote age, and workload urgency.',
    intent: 'For teams asking the timing question but needing a purchase plan before the market gives a clean answer.',
    ctaLabel: 'Create a timing plan',
    sections: [
      {
        heading: 'Shortage relief is uneven',
        paragraphs: [
          'HBM can remain tight while some conventional memory improves, and regional cloud availability can move differently from hardware delivery. A single end date is less useful than a staged procurement plan.',
          'MemoryRisk treats the next six months as the decision window and keeps the end-date question tied to actual BOM lines.',
        ],
      },
      {
        heading: 'Signals that matter before relief arrives',
        paragraphs: [
          'Look for quote validity shortening, lead-time extensions, supplier minimum commitments, reservation requests, and sudden cloud fallback price changes. These signals usually affect buyers before broad market commentary catches up.',
        ],
        bullets: [
          'Lead weeks by SKU family',
          'Supplier quote expiration',
          'Allocation hold terms',
          'Cloud reserved capacity pricing',
          'Substitute validation status',
        ],
      },
      {
        heading: 'What to do while waiting',
        paragraphs: [
          'Do not wait for the shortage to end before approving alternates. The teams that convert fastest are usually the teams that can open checkout, upload a BOM, and get a ranked procurement plan the same day.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is there a single end date for the memory shortage?',
        answer: 'No. HBM, DDR5, NAND, and cloud capacity can loosen or tighten on different schedules.',
      },
      {
        question: 'How does MemoryRisk handle uncertainty?',
        answer: 'It shows scenarios and priorities rather than pretending to forecast one exact price or end date.',
      },
      {
        question: 'Why a six-month score?',
        answer: 'Six months is a practical horizon for quote cycles, delivery dates, approvals, and cloud fallback budgeting.',
      },
    ],
  },
  {
    path: '/memory-chip-shortage',
    eyebrow: 'Chip shortage',
    title: 'Memory Chip Shortage Risk Scoring',
    description:
      'Score memory chip shortage exposure across HBM, DDR5, NAND, supplier quotes, lead times, substitutes, and purchase priority.',
    h1: 'Memory chip shortage risk should be scored at the part level',
    lede:
      'A memory chip shortage becomes expensive when a high-dependency line has no approved substitute, no quote hold, and no cloud fallback.',
    intent: 'For buyers who need to convert memory chip shortage research into BOM-level risk.',
    ctaLabel: 'Score chip exposure',
    sections: [
      {
        heading: 'The part-level view',
        paragraphs: [
          'MemoryRisk starts with the part list because category averages hide the real purchase decision. Quantity, unit cost, supplier, lead time, and memory type create different risk even within the same product family.',
        ],
      },
      {
        heading: 'Substitutes need two approvals',
        paragraphs: [
          'A substitute needs technical approval and commercial approval. The alternate may fit the server, but if allocation is unavailable or the supplier will not hold terms, it is not a real fallback.',
        ],
        bullets: [
          'Validate electrical, thermal, firmware, and platform requirements.',
          'Record supplier quote owner and expiration.',
          'Compare alternative hardware against temporary cloud capacity.',
          'Keep the chosen fallback visible in the report.',
        ],
      },
      {
        heading: 'Why checkout follows the score',
        paragraphs: [
          'Procurement teams convert when the risk is concrete. The site keeps the middle Team annual plan selected because most buyers need collaboration, uploads, and reports rather than a one-off calculator.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What fields are needed for memory chip shortage scoring?',
        answer: 'Part, category, supplier, quantity, unit cost, lead weeks, memory type, cloud fallback, and notes are enough for a useful first pass.',
      },
      {
        question: 'Can I score a server list without individual chip SKUs?',
        answer: 'Yes. Use server bundles as line items and mark the memory type or GPU bundle exposure in the memory type field.',
      },
      {
        question: 'Does MemoryRisk replace supplier negotiations?',
        answer: 'No. It gives the buyer a ranked plan and a better supplier conversation.',
      },
    ],
  },
  {
    path: '/memory-chip-shortage-2026',
    eyebrow: '2026 chip risk',
    title: 'Memory Chip Shortage 2026 Buyer Checklist',
    description:
      'A 2026 memory chip shortage checklist for AI server buyers, MSPs, procurement teams, and finance teams managing HBM and DDR5 cost exposure.',
    h1: 'Memory chip shortage 2026: the buyer checklist before budget approval',
    lede:
      'A 2026 memory chip shortage plan should show which orders must be pulled forward, which can wait, and what the budget looks like if prices move again.',
    intent: 'For finance and procurement teams preparing 2026 server and AI infrastructure budgets.',
    ctaLabel: 'Run the checklist',
    sections: [
      {
        heading: 'Checklist before approval',
        paragraphs: [
          'Before approving a server or AI cluster budget, confirm the quote date, allocation terms, lead time, supplier concentration, and substitute readiness for every high-spend memory line.',
        ],
        bullets: [
          'Quote created in the last 30 days',
          'Lead time captured in weeks',
          'Top supplier share visible',
          'Fallback approved or clearly missing',
          'Budget scenario with at least one memory price shock',
        ],
      },
      {
        heading: 'What finance wants to see',
        paragraphs: [
          'Finance teams need a clean view of exposed spend and scenario deltas. MemoryRisk separates base quote, memory price change, HBM-heavy change, and delay penalty so the budget conversation is less vague.',
        ],
      },
      {
        heading: 'How MSPs can use it',
        paragraphs: [
          'An MSP can upload a customer server list and generate a client-facing report that explains why a purchase order should move now or why a cloud fallback is financially safer for a few months.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should memory chip shortage planning be owned by IT or finance?',
        answer: 'Both. IT owns technical substitutes and workload fit; finance owns budget sensitivity and approval timing.',
      },
      {
        question: 'What is the most common blind spot?',
        answer: 'Teams often track price but miss quote validity, supplier concentration, and substitute readiness.',
      },
      {
        question: 'Can I export reports?',
        answer: 'The MVP focuses on on-page reporting. Team and partner workflows are designed for saved and client-ready reports.',
      },
    ],
  },
  {
    path: '/hbm-memory-shortage',
    eyebrow: 'HBM',
    title: 'HBM Memory Shortage Procurement Plan',
    description:
      'Plan for HBM memory shortage risk with AI server BOM scoring, GPU bundle exposure, cloud fallback choices, and allocation timing.',
    h1: 'HBM memory shortage planning needs a fallback that is not another HBM fantasy',
    lede:
      'HBM is deeply tied to accelerator platforms and advanced packaging, so substitutions are often operational rather than pin-compatible.',
    intent: 'For AI infrastructure teams buying GPU servers and trying to manage HBM shortage exposure.',
    ctaLabel: 'Plan HBM fallback',
    sections: [
      {
        heading: 'Why HBM is different',
        paragraphs: [
          'HBM is not a simple commodity memory swap inside a standard server. It is packaged close to accelerators and tied to platform roadmaps, supplier qualification, and allocation.',
          'That is why a practical HBM shortage plan often compares supplier allocation, server bundle timing, cloud GPU reservations, and workload scheduling.',
        ],
      },
      {
        heading: 'What to capture in the BOM',
        paragraphs: [
          'Mark every HBM-heavy line clearly, including GPU generation, memory stack generation if known, system integrator, lead weeks, and the cloud fallback that can cover training or inference capacity.',
        ],
        bullets: [
          'HBM3E or HBM4 exposure',
          'GPU server bundle quantity',
          'Integrator and distributor quote owner',
          'Cloud fallback region and instance family',
          'Last acceptable delivery date',
        ],
      },
      {
        heading: 'How MemoryRisk scores HBM',
        paragraphs: [
          'The scoring model assigns higher pressure to HBM lines, then adjusts for lead time, supplier concentration, spend, and fallback availability. The goal is to put HBM-heavy lines at the top when they can block a project.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can HBM be substituted like DDR5?',
        answer: 'Usually no. HBM is tied to accelerator packaging, so fallback planning often means alternate server bundles, cloud GPU capacity, or workload rescheduling.',
      },
      {
        question: 'Does the tool handle HBM4?',
        answer: 'Yes. Mark HBM4 in the memory type field and the scoring model treats it as a high-pressure line.',
      },
      {
        question: 'Why include cloud instance prices?',
        answer: 'Cloud capacity can be the practical bridge when hardware allocation is delayed or too expensive.',
      },
    ],
  },
  {
    path: '/memory-supply',
    eyebrow: 'Supply view',
    title: 'Memory Supply Dashboard for Procurement',
    description:
      'Build a memory supply dashboard from BOMs, supplier quotes, public price indexes, lead times, cloud prices, and purchase history.',
    h1: 'Memory supply risk is easiest to manage when quotes, lead times, and fallbacks live together',
    lede:
      'A useful memory supply dashboard combines the buyer data you already have with public market pressure and procurement timing.',
    intent: 'For teams that want a lightweight supply dashboard before building a full procurement system.',
    ctaLabel: 'Open supply dashboard',
    sections: [
      {
        heading: 'Data that belongs together',
        paragraphs: [
          'BOM lines, supplier quotes, public price indexes, lead times, cloud instance prices, and historical purchases are often kept in separate spreadsheets. The risk appears only when they are combined.',
        ],
        bullets: [
          'BOM and server list',
          'Supplier quote and expiration',
          'Public memory price index direction',
          'Lead-time history',
          'Cloud fallback price',
          'User purchase history',
        ],
      },
      {
        heading: 'The first dashboard view',
        paragraphs: [
          'The MVP starts with CSV/XLSX import and rule scoring. That is enough to show risk score, substitutes, budget sensitivity, purchase calendar, supplier comparison, and an MSP-friendly report.',
        ],
      },
      {
        heading: 'The next integrations',
        paragraphs: [
          'Later integrations can connect Octopart or channel quotes, cloud price APIs, team approvals, and saved customer workspaces. The first conversion goal is to prove the decision workflow quickly.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need an ERP integration first?',
        answer: 'No. Start with CSV or XLSX. Integrations should come after the team proves the report is useful.',
      },
      {
        question: 'Can historical purchases improve scoring?',
        answer: 'Yes. Purchase history helps identify normal spend, normal lead time, and supplier behavior before the shortage cycle.',
      },
      {
        question: 'Is this only for HBM?',
        answer: 'No. HBM is important, but the dashboard also covers DDR5, NAND, server bundles, and cloud fallback choices.',
      },
    ],
  },
  {
    path: '/hbm-shortage-reddit',
    eyebrow: 'Chatter check',
    title: 'HBM Shortage Reddit Signal Guide',
    description:
      'Use HBM shortage Reddit discussion carefully by separating buyer anecdotes, investor chatter, supplier claims, and BOM-level procurement evidence.',
    h1: 'HBM shortage Reddit threads can be useful, but only after you separate chatter from evidence',
    lede:
      'Reddit can surface buyer anecdotes and investor sentiment early. It should not replace supplier quotes, lead-time checks, and a ranked BOM risk model.',
    intent: 'For teams seeing HBM shortage Reddit chatter and wanting a calmer procurement filter.',
    ctaLabel: 'Filter the chatter',
    sections: [
      {
        heading: 'What Reddit can show',
        paragraphs: [
          'Anecdotes can reveal how buyers feel about lead times, retail memory availability, GPU server queues, or investor expectations. Those signals are useful as prompts, not as proof.',
        ],
      },
      {
        heading: 'What Reddit cannot prove',
        paragraphs: [
          'A thread cannot tell you whether your distributor will hold allocation, whether your server bundle is validated, or whether your customer delivery date is protected.',
          'MemoryRisk turns the conversation into a checklist: quote owner, lead weeks, supplier concentration, fallback, budget scenario, and priority.',
        ],
        bullets: [
          'Do not treat anonymous claims as supplier confirmation.',
          'Do not use stock chatter as procurement evidence.',
          'Do compare recurring anecdotes against your own quote data.',
          'Do document which risk changed after a source check.',
        ],
      },
      {
        heading: 'How to use community signals responsibly',
        paragraphs: [
          'Use public chatter to decide what to verify next. Then score the BOM with actual supplier data before making a purchase recommendation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Should Reddit influence procurement?',
        answer: 'Only as an early warning signal. Procurement decisions should rely on quotes, lead times, allocation terms, and validated alternatives.',
      },
      {
        question: 'Can investor threads help with HBM demand?',
        answer: 'They can surface topics to investigate, but they should be separated from buyer evidence and technical validation.',
      },
      {
        question: 'What should I do after seeing a concerning thread?',
        answer: 'Refresh supplier quotes, update lead weeks, mark affected BOM lines, and rerun the risk score.',
      },
    ],
  },
  {
    path: '/semianalysis-hbm',
    eyebrow: 'Research workflow',
    title: 'SemiAnalysis HBM Procurement Workflow',
    description:
      'Turn SemiAnalysis HBM research and other analyst commentary into procurement fields: allocation risk, supplier exposure, cloud fallback, and budget sensitivity.',
    h1: 'SemiAnalysis HBM research is most useful when it changes a procurement field',
    lede:
      'Deep analyst research can sharpen an HBM view, but buyers still need to translate it into quotes, lead times, substitutes, and calendar actions.',
    intent: 'For technical buyers who read SemiAnalysis HBM coverage and need a practical purchasing workflow.',
    ctaLabel: 'Translate research to risk',
    sections: [
      {
        heading: 'From research note to action',
        paragraphs: [
          'Analyst coverage can improve your understanding of HBM generations, GPU roadmaps, supplier positioning, and advanced packaging constraints.',
          'The procurement question is narrower: which lines in the BOM changed risk because of that information?',
        ],
      },
      {
        heading: 'Fields to update after reading',
        paragraphs: [
          'After a research update, update memory type, supplier exposure, lead weeks, fallback feasibility, and the budget scenario most likely to matter.',
        ],
        bullets: [
          'HBM generation and platform dependency',
          'Supplier or foundry bottleneck named in the research',
          'Likely effect on delivery timing',
          'Cloud capacity or alternate accelerator path',
          'Customer report note written in plain language',
        ],
      },
      {
        heading: 'Keep evidence and recommendations separate',
        paragraphs: [
          'A strong MSP report distinguishes what came from market research, what came from supplier quotes, and what recommendation follows from the buyer data.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is MemoryRisk affiliated with SemiAnalysis?',
        answer: 'No. This page describes a workflow for turning analyst research into procurement fields.',
      },
      {
        question: 'Should analyst research override supplier quotes?',
        answer: 'No. Research helps frame risk, but quotes and allocation terms decide the immediate purchase path.',
      },
      {
        question: 'What is the output?',
        answer: 'A ranked risk plan with affected lines, substitute paths, budget sensitivity, and a purchase calendar.',
      },
    ],
  },
  {
    path: '/hbm-demand',
    eyebrow: 'Demand',
    title: 'HBM Demand and AI Server Buying Risk',
    description:
      'Track HBM demand through AI server BOM exposure, GPU bundle timing, supplier concentration, cloud fallback pricing, and six-month procurement priority.',
    h1: 'HBM demand matters most when it blocks a server delivery or blows up a budget',
    lede:
      'High HBM demand is a market story. Your buying decision depends on which workloads, suppliers, and delivery dates are exposed.',
    intent: 'For infrastructure and finance teams connecting HBM demand to purchase timing.',
    ctaLabel: 'Quantify HBM demand risk',
    sections: [
      {
        heading: 'Demand signals to watch',
        paragraphs: [
          'AI training, inference growth, GPU platform transitions, and hyperscaler commitments can all increase HBM pressure. The buyer should track how those signals affect their own quote and delivery windows.',
        ],
      },
      {
        heading: 'Demand does not equal risk by itself',
        paragraphs: [
          'A team with secured allocation, approved substitutes, and a non-critical delivery date may have lower risk than a smaller buyer with one urgent HBM-heavy order and no fallback.',
        ],
        bullets: [
          'Business criticality',
          'Allocation status',
          'Supplier concentration',
          'Lead-time trend',
          'Cloud fallback price',
        ],
      },
      {
        heading: 'How to brief leadership',
        paragraphs: [
          'Leadership needs a number, a dollar range, and a date. MemoryRisk gives a six-month score, exposed spend, scenario spend, and the actions that should happen first.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can HBM demand raise normal DRAM risk?',
        answer: 'Yes. When suppliers prioritize high-value HBM and server memory, conventional DRAM supply can tighten too.',
      },
      {
        question: 'What is a good HBM fallback?',
        answer: 'Often cloud GPU capacity, a different accelerator bundle, or workload scheduling. True component swaps are limited.',
      },
      {
        question: 'How fast can I get a first score?',
        answer: 'Upload a CSV or XLSX and the first score appears immediately in the browser.',
      },
    ],
  },
  {
    path: '/sk-hynix-stock',
    eyebrow: 'Market signal',
    title: 'SK Hynix Stock as a Procurement Signal',
    description:
      'Use SK Hynix stock and memory maker market signals carefully by connecting them to supplier quotes, HBM exposure, lead times, and procurement risk.',
    h1: 'SK Hynix stock can be a signal, but supplier quotes decide the purchase order',
    lede:
      'Stock movement and investor commentary can show sentiment around HBM demand. Procurement still needs a BOM-level answer.',
    intent: 'For buyers who monitor SK Hynix stock or memory maker performance and want to avoid confusing market sentiment with allocation.',
    ctaLabel: 'Separate signal from purchase',
    sections: [
      {
        heading: 'What stock signals can suggest',
        paragraphs: [
          'Memory maker performance can reflect expectations about HBM demand, margins, capacity, and customer commitments. Those signals can help a team know what to verify.',
        ],
      },
      {
        heading: 'What stock signals cannot tell you',
        paragraphs: [
          'They cannot confirm your lead time, pricing hold, supplier allocation, platform validation, or customer delivery risk. Those details must come from your quotes and supplier relationships.',
        ],
        bullets: [
          'Use stock signals as a watchlist input.',
          'Do not use them as investment or procurement advice.',
          'Update the BOM when supplier terms actually change.',
          'Keep financial-market commentary out of customer purchase recommendations unless it is clearly labeled.',
        ],
      },
      {
        heading: 'A calmer workflow',
        paragraphs: [
          'MemoryRisk helps the team keep market signals, supplier evidence, and purchase recommendations in separate lanes so the report stays credible.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this investment advice about SK Hynix stock?',
        answer: 'No. This page is about procurement signal handling and does not provide investment advice.',
      },
      {
        question: 'Should procurement track memory maker stocks?',
        answer: 'They can be a useful watchlist input, but purchase decisions should rely on supplier quotes and BOM risk.',
      },
      {
        question: 'Can MemoryRisk include supplier comparison?',
        answer: 'Yes. The report groups spend, share, lead time, and risk by supplier.',
      },
    ],
  },
  {
    path: '/why-is-there-a-chip-shortage',
    eyebrow: 'Root causes',
    title: 'Why Is There a Chip Shortage for AI Memory',
    description:
      'Explain why there is a chip shortage around AI memory, HBM, DDR5, advanced packaging, server demand, and slow capacity expansion.',
    h1: 'Why is there a chip shortage? For AI buyers, memory is one of the tightest answers',
    lede:
      'Chip shortages can come from demand shocks, limited fab capacity, packaging constraints, qualification delays, and supplier allocation choices.',
    intent: 'For buyers who need a clear explanation before asking finance to approve earlier purchasing.',
    ctaLabel: 'Turn causes into a plan',
    sections: [
      {
        heading: 'The AI memory bottleneck',
        paragraphs: [
          'AI systems need high memory bandwidth, large memory capacity, and fast storage around expensive accelerators. That pulls demand toward HBM, DDR5 server memory, SSDs, substrates, and advanced packaging.',
        ],
      },
      {
        heading: 'Why capacity cannot instantly catch up',
        paragraphs: [
          'Memory and packaging capacity require capital, cleanroom space, equipment, process ramps, qualification, and customer commitments. Even when suppliers invest, output does not appear overnight.',
        ],
        bullets: [
          'Fab and cleanroom expansion lead time',
          'Advanced packaging bottlenecks',
          'HBM validation and yield learning',
          'Competing demand from hyperscalers',
          'Supplier allocation toward higher-margin products',
        ],
      },
      {
        heading: 'The buyer response',
        paragraphs: [
          'The right response is not panic buying. It is ranking risk, approving alternatives, comparing cloud fallback cost, and making purchase timing explicit.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is AI the only reason for chip shortage?',
        answer: 'No. AI is a major demand driver for memory and packaging, but shortages can also reflect capacity, qualification, logistics, and supplier strategy.',
      },
      {
        question: 'Why does HBM affect other memory?',
        answer: 'Suppliers may shift resources toward HBM and high-end server products, which can tighten conventional DRAM supply.',
      },
      {
        question: 'How do I explain this to a client?',
        answer: 'Show the exposed BOM lines, the budget scenario, and the purchase calendar rather than a long market essay.',
      },
    ],
  },
  {
    path: '/silicon-shortage',
    eyebrow: 'Semiconductor supply',
    title: 'Silicon Shortage and AI Memory Planning',
    description:
      'Connect silicon shortage concerns to AI memory procurement, HBM allocation, advanced packaging, supplier comparison, and cloud fallback planning.',
    h1: 'Silicon shortage planning should include memory, packaging, and server delivery in one view',
    lede:
      'The phrase silicon shortage can hide several different risks. AI infrastructure buyers need to know whether the bottleneck is memory, packaging, GPU supply, server integration, or cloud capacity.',
    intent: 'For teams using silicon shortage research to prepare a practical infrastructure purchase plan.',
    ctaLabel: 'Check silicon exposure',
    sections: [
      {
        heading: 'Name the bottleneck',
        paragraphs: [
          'A bottleneck in wafers, advanced nodes, packaging, substrates, HBM stacks, DDR5, SSDs, or server assembly can all delay the same project. Naming the bottleneck makes the fallback more realistic.',
        ],
      },
      {
        heading: 'Why the BOM is the truth source',
        paragraphs: [
          'A BOM shows which bottlenecks matter to the buyer. It links technical shortage categories to spend, supplier ownership, delivery dates, and customer impact.',
        ],
        bullets: [
          'Part family and memory type',
          'Supplier and quote owner',
          'Lead weeks and delivery dependency',
          'Substitute and cloud fallback',
          'Budget sensitivity and approval date',
        ],
      },
      {
        heading: 'How the report supports conversion',
        paragraphs: [
          'A credible report turns a broad silicon shortage concern into a specific purchasing action. That is the moment a team plan becomes easier to justify.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is silicon shortage the same as memory shortage?',
        answer: 'No. Memory is one important category within broader semiconductor supply risk, and each bottleneck needs its own fallback.',
      },
      {
        question: 'Can MemoryRisk score non-memory parts?',
        answer: 'Yes, but the model is tuned for memory, AI server bundles, and related cloud fallback decisions.',
      },
      {
        question: 'Why include packaging in a memory workflow?',
        answer: 'HBM and accelerators depend on advanced packaging, so packaging constraints can affect memory-heavy server delivery.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}
