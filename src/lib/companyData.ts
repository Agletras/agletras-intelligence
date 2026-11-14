export interface CompanyData {
  name: string
  legalName: string
  registration: {
    authority: string
    classification: string
    incorporationDate: string
    location: string
  }
  positioning: {
    eyebrow: string
    tagline: string
    subheading: string
    corePhilosophy: string
    longTermVision: string
    initialPriority: string
  }
  trustPillars: Array<{
    title: string
    description: string
  }>
  contacts: {
    corporateEmail: string
    alternativeEmail: string
    registeredOwnerEmail: string
    jurisdiction: string
    domain: string
    socials: {
      github: string
      linkedin: string
      instagram: string
    }
  }
  principles: Array<{
    label: string
    description: string
  }>
}

export const companyData: CompanyData = {
  name: 'AGLETRAS',
  legalName: 'AGLETRAS',
  registration: {
    authority: 'Ministry of Micro, Small and Medium Enterprises, Government of India',
    classification: 'Micro Enterprise (Services)',
    incorporationDate: '2026-08-01',
    location: 'Nashik, Maharashtra, India, PIN 422003',
  },
  positioning: {
    eyebrow: 'EVIDENCE-FIRST RESEARCH INTELLIGENCE // LAWFUL PUBLIC-RECORD INVESTIGATIONS',
    tagline: 'Turn Fragmented Data Into Structured Intelligence.',
    subheading:
      'Agletras conducts rigorous, lawful open-source investigations into commercial counterparties, corporate lineage, executive backgrounds, and online digital exposure. We replace speculation and fragmented data with verified evidence, clear attribution, and well-supported findings.',
    corePhilosophy: 'From commercial uncertainty to attributed, well-supported findings.',
    longTermVision:
      'A standardized research intelligence operating methodology that transforms fragmented public data into structured, traceable, decision-ready intelligence.',
    initialPriority:
      'Investigative Commercial Due Diligence & Corporate Public-Record Research.',
  },
  trustPillars: [
    {
      title: 'Systematic Public Collection',
      description:
        'Automated, rate-controlled ingestion and normalization across primary public registries, official gazettes, archives, and Certificate Transparency logs.',
    },
    {
      title: 'Evidence-First Rigor',
      description:
        'Every material finding is anchored to primary public sources, verified with capture timestamps, cryptographic hashes, and explicit confidence classifications.',
    },
    {
      title: 'Human Analytical Oversight',
      description:
        'Experienced intelligence researchers evaluate competing hypotheses, eliminate false positives, challenge assumptions, and contextualize all findings.',
    },
  ],
  contacts: {
    corporateEmail: 'info.agletras@gmail.com',
    alternativeEmail: 'info.agletras@gmail.com',
    registeredOwnerEmail: 'info.agletras@gmail.com',
    jurisdiction: 'Nashik, Maharashtra, India',
    domain: 'https://agletras.com',
    socials: {
      github: 'https://github.com/Agletras',
      linkedin: 'https://www.linkedin.com/company/agletras/',
      instagram: 'https://www.instagram.com/agletras.ai/',
    },
  },
  principles: [
    {
      label: 'Lawful & Ethical Boundaries',
      description:
        'All research strictly relies on lawfully available public records and client-authorized parameters. We never engage in unauthorized network intrusion, credential harvesting, or clandestine surveillance.',
    },
    {
      label: 'Traceable Epistemic Standards',
      description:
        'We categorize every observation into verified Facts, empirical Indicators, logical Inferences, stated Assumptions, or disclosed Unresolved gaps with transparent confidence assessments.',
    },
    {
      label: 'Human Analytical Governance',
      description:
        'Automated pipelines accelerate data discovery, but seasoned intelligence analysts evaluate context, resolve ambiguities, and ensure defensible conclusions.',
    },
    {
      label: 'Strict Scope & Confidentiality',
      description:
        'Confidentiality expectations and information-handling requirements are discussed and agreed before an engagement, where applicable.',
    },
  ],
}

export interface ResearchDomain {
  id: string
  code: string
  title: string
  secondaryTitle?: string
  scopeTag: string
  summary: string
  scope: string
  technicalFeatures: string[]
  epistemicFocus: string
  category?: 'primary' | 'supporting'
}

export const researchDomains: ResearchDomain[] = [
  {
    id: 'due-diligence',
    code: 'RES-01',
    title: 'Business Partner & Company Checks',
    secondaryTitle: 'Corporate Due Diligence & Counterparty Intelligence',
    scopeTag: 'COMMERCIAL & VENDOR RISK',
    category: 'primary',
    summary:
      'Independent public-record checks on prospective partners, major suppliers, joint ventures, and acquisition targets to verify their corporate standing and identify recorded business risks before signing contracts.',
    scope: 'Official international corporate registries, court dockets, statutory filings, regulatory enforcement notices, and government procurement archives.',
    technicalFeatures: [
      'Verification of corporate registration history, statutory standing, and reported office locations',
      'Identification of recorded commercial litigation, bankruptcy proceedings, and regulatory actions',
      'Review of public procurement records and reported operational history',
      'Cross-referencing declared corporate disclosures against independent public archives',
    ],
    epistemicFocus: 'Helps executive leadership, investment teams, and procurement officers evaluate counterparty reliability with verified facts before committing capital.',
  },
  {
    id: 'beneficial-ownership',
    code: 'RES-02',
    title: 'Company Ownership & Relationships',
    secondaryTitle: 'Beneficial Ownership & Corporate Lineage',
    scopeTag: 'OWNERSHIP & GOVERNANCE',
    category: 'primary',
    summary:
      'Multi-jurisdiction corporate research to trace recorded ownership structures, map parent-subsidiary hierarchies, and document shared directorships across public registers.',
    scope: 'Official company registries, statutory gazette notices, beneficial ownership disclosures, and cross-border commercial registers.',
    technicalFeatures: [
      'Tracing holding company and operating subsidiary connections across different jurisdictions',
      'Identifying shared directors, recurring corporate officers, and common registered agents',
      'Reviewing historical changes in shareholders and directors across successive official filings',
      'Standardizing corporate and personal names across multilingual international records',
    ],
    epistemicFocus: 'Surfaces opaque corporate structures, undisclosed holding relationships, and potential commercial conflicts of interest that may not be apparent in single-jurisdiction filings.',
  },
  {
    id: 'executive-exposure',
    code: 'RES-03',
    title: 'Leadership Background & Online Exposure',
    secondaryTitle: 'Executive Background & Digital Exposure',
    scopeTag: 'EXECUTIVE INTEGRITY',
    category: 'primary',
    summary:
      'Objective verification of executive backgrounds, active directorships, professional history, and publicly visible security exposure indicators for key leaders.',
    scope: 'Official directorship registers, regulatory disqualification lists, published institutional archives, and public breach notification metadata.',
    technicalFeatures: [
      'Corroborating active and past directorships across domestic and international public registers',
      'Checking for recorded business insolvencies, director disqualifications, or regulatory fines',
      'Confirming published educational and professional credentials against institutional records',
      'Identifying public corporate email addresses or credential metadata that may indicate social engineering vulnerabilities',
    ],
    epistemicFocus: 'Supports organizations during executive recruitment, board appointments, and partnerships by confirming that public representations match verifiable historical records.',
  },
  {
    id: 'brand-threat',
    code: 'RES-04',
    title: 'Online Threats & Brand Impersonation',
    secondaryTitle: 'Brand Impersonation & External Digital Threat Intelligence',
    scopeTag: 'BRAND & FRAUD PREVENTION',
    category: 'primary',
    summary:
      'Non-intrusive monitoring to identify newly registered lookalike domains, deceptive brand permutations, and staging infrastructure targeting your brand, customers, or employees.',
    scope: 'Public Certificate Transparency log streams, historical domain name records, passive DNS databases, and new domain registration archives.',
    technicalFeatures: [
      'Detecting newly registered domains that mimic your company name, brand variations, or common typos',
      'Checking resolving IP addresses, mail exchange (MX) records, and hosting setups for lookalike domains',
      'Spotting test or staging servers configured to mirror corporate portals or login interfaces',
      'Finding deceptive domains set up with active mail servers before fraud or phishing campaigns launch',
    ],
    epistemicFocus: 'Provides early visibility into deceptive digital infrastructure, supporting timely registrar notifications and defensive protections before campaigns launch.',
  },
  {
    id: 'digital-asset-research',
    code: 'RES-05',
    title: 'Public Website & Technical Footprint',
    secondaryTitle: 'External Digital Asset Research',
    scopeTag: 'PERIMETER RECONNAISSANCE',
    category: 'supporting',
    summary:
      'Non-intrusively mapping an organization’s publicly visible website addresses, forgotten subdomains, and expired security certificates to understand its technical footprint.',
    scope: 'Public DNS archives, Certificate Transparency logs, autonomous system routing records, and publicly resolvable DNS zones.',
    technicalFeatures: [
      'Listing publicly resolvable corporate subdomains without active port scanning or network probing',
      'Identifying dangling DNS records (e.g., CNAME records pointing to decommissioned third-party cloud services)',
      'Reviewing public SSL/TLS certificate lifecycles, configuration metadata, and Subject Alternative Names',
      'Documenting historical changes in hosting providers and IP network allocations',
    ],
    epistemicFocus: 'Provides researchers with technical context regarding a target’s public digital footprint without generating intrusive network traffic.',
  },
  {
    id: 'document-intelligence',
    code: 'RES-06',
    title: 'Document & Filing Analysis',
    secondaryTitle: 'Document Intelligence & Disclosure Analysis',
    scopeTag: 'DOCUMENT INTELLIGENCE',
    category: 'supporting',
    summary:
      'Careful extraction and comparative review of complex statutory filings, annual disclosures, and financial reports to spot timeline inconsistencies and factual gaps.',
    scope: 'Official gazette publications, statutory balance sheet filings, corporate annual reports, and regulatory announcements.',
    technicalFeatures: [
      'Extracting text and tables from scanned public documents and official PDF filings',
      'Spotting chronological contradictions across successive annual filings and disclosures',
      'Extracting recurring entity names, addresses, and officer titles from unstructured filings',
      'Cross-referencing disclosed figures across international regulatory filings',
    ],
    epistemicFocus: 'Enables analysts to review high-volume public filings systematically, identifying timeline gaps and conflicting statements.',
  },
  {
    id: 'research-infrastructure',
    code: 'RES-07',
    title: 'Research Infrastructure & Verification Tools',
    secondaryTitle: 'Research Infrastructure & Verification Tooling',
    scopeTag: 'RESEARCH INFRASTRUCTURE',
    category: 'supporting',
    summary:
      'Maintaining local, secure evidence databases, digital file checksums, and disciplined cross-checks to ensure all research findings can be audited and verified.',
    scope: 'Local-first SQLite databases, SHA-256 evidence hashing, structured Markdown generation, and local CLI utilities.',
    technicalFeatures: [
      'Maintaining isolated, local evidence stores so that research data remains private and controlled on local storage',
      'Generating SHA-256 cryptographic hashes for raw retrieved files at the time of collection to record file integrity',
      'Linking analytical assertions directly to specific stored text passages and source references where supported',
      'Sharing core verification methods with our open-source software project, the Agletras MCP Server',
    ],
    epistemicFocus: 'Supports research reproducibility by maintaining documented source references and capture timestamps for evidence used in deliverables.',
  },
]

export interface EpistemicStandard {
  type: 'FACT' | 'INDICATOR' | 'INFERENCE' | 'ASSUMPTION' | 'UNRESOLVED'
  label: string
  simpleName: string
  code: string
  definition: string
  example: string
  confidenceRange: string
  badgeClass: string
}

export const epistemicStandards: EpistemicStandard[] = [
  {
    type: 'FACT',
    label: 'FACT',
    simpleName: 'Documented Fact',
    code: 'EVD-FACT',
    definition:
      'Information directly verified through primary, authoritative public records or official filings. Must cite a specific source.',
    example:
      'Synthetic Reference Corp was incorporated in Delaware on April 12, 2021, under File Number 5829104, with a registered office in Wilmington.',
    confidenceRange: 'Primary Statutory Record — Highest Reliability',
    badgeClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
  },
  {
    type: 'INDICATOR',
    label: 'INDICATOR',
    simpleName: 'Observable Signal',
    code: 'EVD-IND',
    definition:
      'A visible, timestamped technical or operational signal that suggests a pattern or activity, requiring further correlation.',
    example:
      'A domain "synthetic-vendor-portal[.]com" was registered on September 15, 2026, and resolved to IP address 198.51.100.42.',
    confidenceRange: 'Observable Signal — Requires Corroboration',
    badgeClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
  },
  {
    type: 'INFERENCE',
    label: 'INFERENCE',
    simpleName: 'Reasoned Conclusion',
    code: 'EVD-INF',
    definition:
      'A logical deduction drawn from correlating multiple independent indicators and verified facts.',
    example:
      'Because the lookalike domain shares a unique nameserver, SSL certificate provider, and website template with known test infrastructure, it is inferred that both assets are managed by the same operator.',
    confidenceRange: 'Corroborated Analytical Deduction',
    badgeClass: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
  },
  {
    type: 'ASSUMPTION',
    label: 'ASSUMPTION',
    simpleName: 'Working Premise',
    code: 'EVD-ASM',
    definition:
      'An explicitly declared working premise required to advance research, clearly flagged for client review.',
    example:
      'It is assumed for the purpose of this analysis that the regional subsidiary handles local commercial distribution, pending statutory disclosure of operating contracts.',
    confidenceRange: 'Declared Working Premise — Flagged for Review',
    badgeClass: 'text-slate-300 border-slate-500/40 bg-slate-900/60',
  },
  {
    type: 'UNRESOLVED',
    label: 'UNRESOLVED',
    simpleName: 'Unanswered Question',
    code: 'EVD-UNR',
    definition:
      'An identified knowledge gap or open investigative question that could not be resolved within public legal boundaries.',
    example:
      'The ultimate beneficial owner of the holding company could not be identified because the jurisdiction does not maintain a public register of beneficial ownership.',
    confidenceRange: 'Investigative Limitation — Transparent Knowledge Gap',
    badgeClass: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
  },
]

export interface MethodologyStage {
  step: string
  phase: string
  shortLabel: string
  title: string
  summary: string
  purpose: string
  whatHappens: string
  inputs: string
  verificationChecks: string
  expectedArtifact: string
  deliverableOutcome: string
}

export const methodologyStages: MethodologyStage[] = [
  {
    step: '01',
    phase: 'Define',
    shortLabel: 'Understand',
    title: 'Understand the Question',
    summary:
      'Agree on the commercial research questions, define factual target anchors, and establish lawful research boundaries under mutual confidentiality.',
    purpose:
      'Ensure every investigation has a bounded objective, preventing scope creep and maintaining strict adherence to lawful public boundaries.',
    whatHappens:
      'Researchers review inquiry objectives with client stakeholders, document specific target parameters (entity names, registration jurisdictions, executive identifiers), and establish agreed research parameters. Confidentiality expectations and information-handling requirements are discussed and agreed before an engagement, where applicable.',
    inputs: 'Commercial inquiry objectives, target entity identifiers, specified jurisdictions, confidentiality guidelines.',
    verificationChecks: 'Confirm public accessibility of data sources; verify legal boundaries; ensure no intrusive access is required.',
    expectedArtifact: 'Agreed Research Scope & Target Register',
    deliverableOutcome: 'Agreed research scope with explicit legal and operational boundaries.',
  },
  {
    step: '02',
    phase: 'Collect',
    shortLabel: 'Find',
    title: 'Find Relevant Information',
    summary:
      'Gather public records from official corporate registries, gazettes, regulatory filings, Certificate Transparency feeds, and passive DNS records.',
    purpose:
      'Obtain unaltered public records while recording timestamps and capture details, establishing a verifiable record of what was publicly observable at the time of inquiry.',
    whatHappens:
      'Researchers and automated retrieval tools gather relevant filings, historical domain registrations, regulatory notices, and technical indicators from public repositories without altering source material.',
    inputs: 'Target anchors, corporate registry indexes, Certificate Transparency streams, passive DNS archives.',
    verificationChecks: 'Generate SHA-256 cryptographic hashes for retrieved raw files to record file integrity at the time of collection; log source URLs and capture timestamps.',
    expectedArtifact: 'Timestamped Evidence Archive with Source Provenance',
    deliverableOutcome: 'Timestamped evidence collection with verifiable source provenance.',
  },
  {
    step: '03',
    phase: 'Verify',
    shortLabel: 'Check',
    title: 'Check the Information',
    summary:
      'Cross-examine gathered records against independent secondary sources, separate official records from operational signals, and identify contradictory information.',
    purpose:
      'Prevent decisions from being made on outdated directory caches, typographical registry errors, or uncorroborated third-party claims.',
    whatHappens:
      'Analysts evaluate each collected record against our 5-tier classification standard, checking whether assertions are supported by authoritative primary filings.',
    inputs: 'Raw collected evidence, cross-registry databases, historical archive records, corporate regulatory disclosures.',
    verificationChecks: 'Require independent secondary confirmation for material assertions; assign clear evidentiary classifications to every recorded observation.',
    expectedArtifact: 'Verified Evidence Register with Source Citations',
    deliverableOutcome: 'Attributed evidence register with primary source citations.',
  },
  {
    step: '04',
    phase: 'Correlate',
    shortLabel: 'Connect',
    title: 'Connect the Information',
    summary:
      'Connect verified entities into relational graphs to document corporate parentage, shared directorships, registered agent associations, and technical infrastructure.',
    purpose:
      'Transform separate pieces of information into a coherent structural map, helping clients understand multi-jurisdiction ownership structures and indirect relationships.',
    whatHappens:
      'Relational analysis maps connections between individuals, corporate entities, registered addresses, IP allocations, and domain registrations.',
    inputs: 'Verified entity filings, director disclosures, registered agent listings, SSL certificate metadata, WHOIS records.',
    verificationChecks: 'Distinguish documented legal associations from coincidental shared service providers (such as shared hosting or common registered office addresses).',
    expectedArtifact: 'Entity Relationship Map & Association Graph',
    deliverableOutcome: 'Clear relationship diagram showing how entities and individuals connect across jurisdictions.',
  },
  {
    step: '05',
    phase: 'Analyze',
    shortLabel: 'Weigh',
    title: 'Understand What It Means',
    summary:
      'Systematically evaluate findings, test alternative explanations for observed patterns, weigh the consistency of collected information, and document remaining research limits.',
    purpose:
      'Reduce confirmation bias and ensure that findings represent disciplined, reasoned interpretation rather than speculative or superficial assumptions.',
    whatHappens:
      'Analysts examine competing interpretations of the evidence, evaluate alternative explanations for observed findings, and document what the evidence supports versus what remains unproven.',
    inputs: 'Relationship maps, chronological evidence timelines, verified evidence register, competing explanations.',
    verificationChecks: 'Systematic cross-examination of assertions against cited source records; assessment of evidence weight; explicit identification of investigative boundaries and unresolved questions.',
    expectedArtifact: 'Analytical Synthesis & Findings Matrix',
    deliverableOutcome: 'Structured analytical synthesis with defensible conclusions.',
  },
  {
    step: '06',
    phase: 'Deliver',
    shortLabel: 'Present',
    title: 'Present the Findings',
    summary:
      'Synthesize verified findings into a structured executive dossier featuring clear summaries, visual relationship charts, explicit citations, and actionable considerations.',
    purpose:
      'Provide leadership, legal counsel, and risk teams with clear, defensible documentation that can be directly applied to strategic commercial decisions.',
    whatHappens:
      'Analysts prepare the final dossier, ensuring all factual statements cite specific public sources, analytical inferences are clearly designated, and limitations are transparently stated.',
    inputs: 'Analytical synthesis, relationship diagrams, evidentiary register, strategic risk context.',
    verificationChecks: 'Citation audit ensuring every factual statement links to a documented public record; review of limitation disclosures.',
    expectedArtifact: 'Executive Intelligence Dossier & Strategic Advisory',
    deliverableOutcome: 'Decision-ready intelligence dossier prepared for executive decision-makers.',
  },
]

export interface McpProductData {
  name: string
  version: string
  toolCount: number
  pythonRequirement: string
  transport: string
  repositoryUrl: string
  costQualification: string
  capabilities: Array<{
    title: string
    description: string
  }>
  architecture: {
    storage: string
    search: string
    hashing: string
    cli: string
  }
}

export const mcpProductData: McpProductData = {
  name: 'Agletras MCP',
  version: '0.2.0',
  toolCount: 40,
  pythonRequirement: 'Python 3.11+',
  transport: 'stdio (JSON-RPC 2.0)',
  repositoryUrl: 'https://github.com/Agletras/Agletras-mcp.git',
  costQualification:
    'The core engine supports local document processing and public web retrieval without requiring paid search API keys. Optional external integrations may have their own costs and provider requirements.',
  capabilities: [
    {
      title: 'Public Web Retrieval',
      description:
        'Open-web search and web page extraction with SSRF network protections.',
    },
    {
      title: 'Local Document Processing',
      description:
        'Local document processing from PDF, DOCX, XLSX, CSV, and Markdown files.',
    },
    {
      title: 'Deterministic Passage Processing & Hashing',
      description:
        'Deterministic passage chunking with character offsets and SHA-256 cryptographic hashes.',
    },
    {
      title: 'SQLite & FTS5 Evidence Storage',
      description:
        'SQLite storage with foreign key integrity and FTS5 full-text search.',
    },
    {
      title: 'Claim Verification',
      description:
        'Claim verification against retrieved passages with explicit consistency statuses.',
    },
    {
      title: 'CLI & Doctor Diagnostics',
      description:
        'Model-free command-line interface with agletras doctor diagnostics.',
    },
  ],
  architecture: {
    storage: 'SQLite with WAL mode and foreign key integrity',
    search: 'SQLite FTS5 full-text passage index',
    hashing: 'SHA-256 cryptographic passage-level hashing',
    cli: 'Standalone agletras CLI with doctor diagnostics',
  },
}
