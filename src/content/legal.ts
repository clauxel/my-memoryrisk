export type LegalSection = {
  title: string
  paragraphs: string[]
}

export const legalPrivacySections: LegalSection[] = [
  {
    title: 'What we collect',
    paragraphs: [
      'MemoryRisk collects information reasonably needed to operate the website, create checkout sessions, measure page and funnel performance, prevent abuse, provide support, and generate procurement reports that users request.',
      'This may include page views, clicks, referral and UTM data, browser and device information, approximate location derived from network data, checkout metadata, support emails, and information intentionally uploaded or submitted by a user.',
      'Uploaded BOMs, server lists, supplier quote fields, prices, lead times, cloud fallback notes, purchase history, and report notes may contain business information. Users are responsible for removing secrets and information they are not authorized to process before uploading.',
    ],
  },
  {
    title: 'What not to upload',
    paragraphs: [
      'Do not upload passwords, API keys, private keys, seed phrases, card numbers, bank credentials, regulated personal data, export-controlled information, confidential third-party information, or data you are not allowed to process.',
      'The public planner is intended for procurement planning data such as part, supplier, quantity, unit cost, lead time, memory type, cloud fallback, and notes. It is not a secure document vault for highly sensitive data unless a separate written agreement says otherwise.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use analytics to understand which pages, plan choices, uploads, and checkout actions help visitors make a confident purchase decision.',
      'We use uploaded or submitted procurement data to score memory shortage exposure, suggest alternatives, simulate budget sensitivity, rank purchase priority, compare suppliers, and generate reports requested by users.',
      'We use checkout metadata to create payment sessions, confirm purchases, return users to the homepage, provide onboarding, prevent fraud, handle disputes, and support accounting, tax, security, and legal obligations.',
    ],
  },
  {
    title: 'Service providers',
    paragraphs: [
      'Cloudflare supports hosting, routing, security, analytics infrastructure, edge execution, and related site operations. Creem supports hosted checkout and payment processing.',
      'Payment details are handled by the payment provider. MemoryRisk does not ask users to send card numbers, passwords, supplier portal credentials, or private procurement credentials by email or through the public planner.',
      'Third-party services process information under their own terms and privacy practices. Do not proceed with checkout or external services if you do not accept those practices.',
    ],
  },
  {
    title: 'Security, retention, and deletion',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational safeguards appropriate for a SaaS marketing, analytics, checkout, and procurement-planning site.',
      'No internet service can be guaranteed perfectly secure. Users remain responsible for redacting secrets, limiting uploaded data, controlling access to their own systems, and verifying that they have permission to submit business information.',
      'We retain information only as long as reasonably needed for the purposes described here, including support, reporting, tax, accounting, fraud prevention, security, dispute handling, legal compliance, and product operations.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
      'California and other privacy laws may provide additional rights when their thresholds and conditions apply. We will not discriminate against users for exercising applicable privacy rights.',
      'To make a privacy or support request, email support@aigeamy.com. We may need to verify the request before acting on it.',
    ],
  },
  {
    title: 'Children, changes, and contact',
    paragraphs: [
      'MemoryRisk is intended for business, procurement, MSP, developer, and infrastructure audiences and is not directed to children under 13.',
      'We may update this policy when the product, providers, laws, or operations change. The version posted on this page controls from the time it is published.',
      'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
    ],
  },
]

export const legalTermsSections: LegalSection[] = [
  {
    title: 'Acceptance and service scope',
    paragraphs: [
      'By accessing MemoryRisk, using the planner, uploading a file, opening checkout, purchasing a plan, or continuing to use the service, you agree to these Terms.',
      'MemoryRisk provides a website, BOM and server-list risk planner, rule-based procurement scoring, substitute suggestions, budget scenarios, supplier comparison, purchase calendar output, hosted checkout, analytics, and related onboarding.',
      'The service is a procurement planning aid. It is not an official supplier quote, supply guarantee, allocation commitment, engineering approval, tax advice, legal advice, investment advice, securities recommendation, or promise that any supplier, cloud provider, part, price, lead time, or substitute will be available.',
    ],
  },
  {
    title: 'User responsibility for data and decisions',
    paragraphs: [
      'You are solely responsible for the BOMs, server lists, supplier quotes, cloud prices, purchase history, customer data, notes, files, permissions, and business decisions you provide, upload, authorize, or rely on.',
      'You must have all rights and permissions needed to upload or process the information you submit. Do not upload secrets, credentials, regulated data, export-controlled information, third-party confidential information, or data you are not allowed to process.',
      'You are responsible for verifying all output before using it in purchase orders, customer reports, supplier negotiations, financial approvals, operational commitments, or any other business decision.',
    ],
  },
  {
    title: 'Procurement output and AI-assisted content',
    paragraphs: [
      'Risk scores, substitute suggestions, budget sensitivity, supplier comparison, purchase priority, calendar actions, and reports may be incomplete, inaccurate, delayed, biased, unsuitable, or wrong.',
      'Rule-based or AI-assisted output does not replace supplier confirmation, engineering validation, finance approval, legal review, tax review, contract review, security review, or professional judgment.',
      'You remain solely responsible for confirming part compatibility, warranty terms, supplier terms, cloud pricing, delivery dates, compliance requirements, customer commitments, and any financial or operational impact.',
    ],
  },
  {
    title: 'Payments, renewals, and refunds',
    paragraphs: [
      'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the MemoryRisk homepage or checkout completion route.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan. Prices, plan names, features, limits, and availability may change before purchase.',
      'Unless a separate written agreement says otherwise, purchases are final to the maximum extent permitted by law. If the payment provider, consumer law, or a written policy requires a refund, that required rule controls.',
      'Chargebacks, payment abuse, account sharing, unauthorized resale, or attempted circumvention of checkout may result in suspension, cancellation, refusal of service, evidence preservation, or collection of amounts owed.',
    ],
  },
  {
    title: 'Prohibited use',
    paragraphs: [
      'You may not use MemoryRisk to violate law, infringe rights, misappropriate confidential information, evade sanctions, bypass access controls, distribute malware, spam, impersonate others, scrape where prohibited, overload the service, or process data without authority.',
      'You may not reverse engineer, copy, frame, resell, sublicense, benchmark publicly, or exploit the service except as expressly permitted in writing.',
      'We may suspend or terminate access, refuse checkout, preserve evidence, or cooperate with lawful requests when we believe use is unsafe, abusive, fraudulent, infringing, unlawful, or inconsistent with these Terms.',
    ],
  },
  {
    title: 'Third-party services and external data',
    paragraphs: [
      'Cloudflare, Creem, suppliers, distributors, cloud providers, quote providers, price indexes, data providers, spreadsheet tools, and other third-party services may be involved in hosting, checkout, references, integrations, or customer workflows.',
      'We are not responsible for third-party services, third-party outages, payment provider decisions, quote changes, supplier behavior, allocation decisions, cloud pricing, rate limits, import errors, data quality, or third-party terms.',
      'Your use of third-party services is governed by the applicable third-party terms, privacy policies, account rules, pricing, and fees.',
    ],
  },
  {
    title: 'No warranties',
    paragraphs: [
      'MemoryRisk is provided as is and as available. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise.',
      'We do not warrant uninterrupted service, error-free operation, complete security, merchantability, fitness for a particular purpose, non-infringement, quote accuracy, supplier availability, price accuracy, lead-time accuracy, substitute compatibility, report accuracy, conversion results, savings, or business outcomes.',
      'You use the service at your own risk and remain responsible for backups, testing, review, procurement controls, compliance, provider bills, supplier contracts, customer commitments, and production decisions.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, MemoryRisk and its operators, affiliates, suppliers, and service providers will not be liable for lost profits, lost revenue, lost savings, lost opportunities, lost data, replacement procurement costs, delayed projects, customer claims, indirect, incidental, special, consequential, exemplary, or punitive damages.',
      'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount you paid for MemoryRisk in the three months before the event giving rise to the claim.',
      'These limits apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, equity, or any other theory, even if a remedy fails of its essential purpose.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      'You agree to defend, indemnify, and hold harmless MemoryRisk and its operators, affiliates, suppliers, and service providers from claims, damages, liabilities, losses, costs, and fees arising from your use of the service.',
      'This includes claims arising from your data, files, BOMs, quotes, customer information, procurement decisions, supplier disputes, cloud purchases, third-party accounts, violation of law, infringement, breach of these Terms, or unauthorized use of credentials, systems, or information.',
    ],
  },
  {
    title: 'Disputes',
    paragraphs: [
      'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
      'To the maximum extent permitted by law, disputes must be resolved individually and not as a class, collective, consolidated, private attorney general, or representative action.',
      'To the maximum extent permitted by law, disputes will be resolved by binding arbitration or the courts with proper jurisdiction for the operator, and you waive jury trial where that waiver is enforceable.',
      'If any part of these dispute terms is unenforceable, the remaining provisions continue to apply to the maximum extent permitted by law.',
    ],
  },
  {
    title: 'Changes, termination, and contact',
    paragraphs: [
      'We may update these Terms, change or discontinue features, refuse transactions, suspend access, or terminate service when reasonably necessary for security, legal, operational, abuse-prevention, regulatory, or business reasons.',
      'If a provision is unenforceable, the rest of these Terms remains effective. A failure to enforce a provision is not a waiver.',
      'Questions, notices, support requests, and dispute notices should be sent to support@aigeamy.com.',
    ],
  },
]
