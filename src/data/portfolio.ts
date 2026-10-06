// Single source of truth for every piece of content on the site.
// Components read only from this file.

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type IconName =
  | 'Building2' | 'ShoppingCart' | 'Truck' | 'Megaphone'
  | 'Terminal' | 'MousePointer2' | 'Github' | 'Code2'
  | 'Bot' | 'DatabaseZap' | 'Layers' | 'Workflow' | 'ShieldCheck'
  | 'GraduationCap' | 'BadgeCheck'
  | 'Mail' | 'Phone' | 'MessageCircle' | 'Linkedin' | 'FileDown'
  | 'Monitor' | 'Server' | 'Database' | 'BrainCircuit' | 'Boxes' | 'Cloud' | 'Wrench';

export interface Person {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  specialities: string[];
  headline: string;
  city: string;
  country: string;
  countryCode: string;
  cityCode: string;
  timezone: string;
  utcLabel: string;
  sinceYear: number;
  clientRegion: string;
}

export interface NavLink {
  label: string;
  href: string;
  index: string;
}

export type HeadlineStyle = 'solid' | 'stroke' | 'accent';

export interface HeroData {
  label: string;
  headlineLines: { text: string; style: HeadlineStyle }[];
  headlineAria: string;
  availability: string;
  helloLabel: string;
  tagline: string;
  intro: string;
  quickFacts: { value: string; label: string }[];
  bottomRight: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Industry {
  title: string;
  icon: IconName;
  blurb: string;
}

export interface GovernanceTier {
  code: string;
  name: string;
  description: string;
  oversight: number;
}

export type BrandName = 'claudecode' | 'cursor' | 'githubcopilot' | 'openai';

export interface DailyDriver {
  title: string;
  /** Official logo (Simple Icons) shown in the tile. */
  brand: BrandName;
  /** Tile background, logo colour and hover glow — the tool's real brand colours. */
  color: string;
  fg: string;
  glow: string;
}

export interface AboutData {
  label: string;
  statement: string;
  stats: Stat[];
  industries: Industry[];
  governance: GovernanceTier[];
  dailyDrivers: DailyDriver[];
  quote: { text: string; author: string };
}

export interface Service {
  number: string;
  title: string;
  iconName: IconName;
  description: string;
  tags: string[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  highlights: string[];
  tags: string[];
  image: string;
  gradientFallback: string;
  liveUrl: string;
  repoUrl: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  isCurrent: boolean;
  initial: string;
  summary: string;
  bullets: string[];
}

export interface Tool {
  name: string;
  role: string;
  monogram: string;
  color: string;
  textColor: string;
}

export interface SkillCategory {
  title: string;
  icon: IconName;
  /** Accent colour for this category's row. */
  color: string;
  items: string[];
}

export type PillVariant = 'violet' | 'white' | 'outline';

export interface SkillPill {
  name: string;
  variant: PillVariant;
}

export interface Education {
  institution: string;
  location: string;
  program: string;
  duration: string;
  period: string;
  badge: string;
  credentialUrl: string;
  icon: IconName;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  icon: IconName;
  download?: boolean;
}

export interface ContactData {
  headline: [string, string];
  inboxLabel: string;
  channels: ContactChannel[];
  locationLine: string;
  reachLine: string;
}

/* ------------------------------------------------------------------ */
/* 5.1 Person & links                                                  */
/* ------------------------------------------------------------------ */

export const PERSON: Person = {
  fullName: 'Syed Sami Ullah',
  firstName: 'Syed Sami',
  lastName: 'Ullah',
  initials: 'SSU',
  role: 'Full Stack AI Engineer',
  specialities: ['Agentic AI', 'RAG Systems', 'Multi-Agent Workflows'],
  headline: 'Full Stack AI Engineer | AI Product Development | Generative AI & Agentic Systems',
  city: 'Lahore',
  country: 'Pakistan',
  countryCode: 'PK',
  cityCode: 'LHR',
  timezone: 'Asia/Karachi',
  utcLabel: 'UTC+5',
  sinceYear: 2023,
  clientRegion: 'UAE',
};

export const PORTFOLIO_LINKS = {
  email: 'mailto:syedsamiullah596@gmail.com',
  emailAddress: 'syedsamiullah596@gmail.com',
  phone: 'tel:+923134304258',
  phoneDisplay: '+92 313 4304258',
  whatsapp: 'https://wa.me/923134304258',
  github: 'https://github.com/SyedSamiUllah21',
  githubHandle: '@SyedSamiUllah21',
  linkedin: 'https://www.linkedin.com/in/syed-sami-ullah-bbbb7338b/',
  datacampCert: 'https://www.datacamp.com/certificate/AIEDA0018246475759',
  cv: '/Syed_Sami_Ullah_CV.pdf',
} as const;

// Section order mirrors the CV: summary → skills → experience → projects → education.
export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about', index: '01' },
  { label: 'Skills', href: '#skills', index: '02' },
  { label: 'Experience', href: '#experience', index: '03' },
  { label: 'Projects', href: '#work', index: '04' },
  { label: 'Education', href: '#education', index: '05' },
  { label: 'Services', href: '#services', index: '06' },
  { label: 'Contact', href: '#contact', index: '07' },
];

/** Section number shown in each "(0N) — LABEL" header, taken from NAV_LINKS. */
export const sectionIndex = (href: string) => NAV_LINKS.find((l) => l.href === href)?.index ?? '';

/* ------------------------------------------------------------------ */
/* 5.2 Hero                                                            */
/* ------------------------------------------------------------------ */

export const HERO_DATA: HeroData = {
  label: 'Full Stack AI Engineer · Lahore, PK',
  headlineLines: [
    { text: 'SMART', style: 'solid' },
    { text: 'AGENTS', style: 'solid' },
    { text: 'THAT', style: 'stroke' },
    { text: 'SHIP.', style: 'accent' },
  ],
  headlineAria: 'Smart agents that ship.',
  availability: 'Available for freelance & full-time roles',
  helloLabel: "(HELLO, I'M)",
  tagline: 'Production AI where agents execute and humans govern.',
  intro:
    'I build end-to-end AI products — multi-agent workflows, RAG systems and full-stack apps with Next.js and FastAPI — shipped with guardrails, evals and monitoring. Currently building AI-native ERP & CRM platforms for UAE-based clients.',
  quickFacts: [
    { value: '3+', label: 'Years' },
    { value: 'UAE', label: 'Clients' },
    { value: 'LHR', label: 'Based in' },
  ],
  bottomRight: 'BUILDING SINCE 2023',
};

/* ------------------------------------------------------------------ */
/* 5.3 Marquee                                                         */
/* ------------------------------------------------------------------ */

export const MARQUEE_ROW_1 = ['AGENTIC AI', 'RAG SYSTEMS', 'LANGGRAPH', 'MULTI-AGENT', 'AUTOMATION'];
export const MARQUEE_ROW_2 = ['NEXT.JS', 'FASTAPI', 'GUARDRAILS', 'LLM EVALS', 'MCP SERVERS'];

/* ------------------------------------------------------------------ */
/* 5.4 About — (01)                                                    */
/* ------------------------------------------------------------------ */

export const ABOUT_DATA: AboutData = {
  label: '(01) — ABOUT ME',
  statement:
    "Hi, I'm Syed Sami Ullah — a Full Stack AI Engineer with 3+ years of building production-ready AI agents, RAG systems and multi-agent workflows. Today I build AI-native ERP and CRM platforms for UAE-based clients, with human-in-the-loop controls, enterprise guardrails and monitoring baked in.",
  stats: [
    { value: '3+', label: 'Years Experience' },
    { value: '3', label: 'Companies + Freelance' },
    { value: '25+', label: 'Hours Saved Weekly' },
  ],
  industries: [
    { title: 'Enterprise ERP & CRM', icon: 'Building2', blurb: 'AI-native sales, inventory, procurement, finance and HR for UAE-based clients.' },
    { title: 'E-Commerce', icon: 'ShoppingCart', blurb: 'Multi-agent ops for pricing, sales, dispatch, marketing and WhatsApp support.' },
    { title: 'Finance & Supply Chain', icon: 'Truck', blurb: 'Invoice reconciliation, purchase orders and supply-chain agents.' },
    { title: 'Sales & Marketing', icon: 'Megaphone', blurb: 'AI lead scoring, personalized outreach and CRM automation.' },
  ],
  governance: [
    { code: 'T1', name: 'Autonomous', description: 'Low-risk actions run on their own, fully logged.', oversight: 25 },
    { code: 'T2', name: 'Notify', description: 'Agent acts, then a human is notified.', oversight: 50 },
    { code: 'T3', name: 'Approval Required', description: 'Agent pauses at a HITL checkpoint until approved.', oversight: 75 },
    { code: 'T4', name: 'Human Decision', description: 'Agent prepares context; a human decides.', oversight: 100 },
  ],
  dailyDrivers: [
    { title: 'Claude Code', brand: 'claudecode', color: '#D97757', fg: '#FFFFFF', glow: '#D97757' },
    { title: 'Cursor', brand: 'cursor', color: '#000000', fg: '#FFFFFF', glow: '#F5F5F5' },
    { title: 'GitHub Copilot', brand: 'githubcopilot', color: '#FFFFFF', fg: '#000000', glow: '#A371F7' },
    { title: 'Codex', brand: 'openai', color: '#10A37F', fg: '#FFFFFF', glow: '#10A37F' },
  ],
  quote: {
    text: 'AI executes. Humans govern. Every decision stays explainable and auditable.',
    author: 'Syed Sami Ullah — how I build agents',
  },
};

/* ------------------------------------------------------------------ */
/* 5.5 Services — (02)                                                 */
/* ------------------------------------------------------------------ */

export const SERVICES_INTRO = 'From prototype to production: agents, retrieval and the full stack around them.';

export const SERVICES_DATA: Service[] = [
  {
    number: '01', title: 'Agentic AI Systems', iconName: 'Bot',
    description: 'Multi-agent workflows with LangGraph and LangChain — tool calling, structured outputs, supervisor hierarchies and human-in-the-loop approvals for high-impact actions.',
    tags: ['LangGraph', 'CrewAI', 'HITL'],
  },
  {
    number: '02', title: 'RAG & Knowledge Retrieval', iconName: 'DatabaseZap',
    description: 'Production RAG pipelines with embeddings, pgvector/Qdrant, hybrid search and reranking — natural-language answers over records, contracts and SOPs with citations.',
    tags: ['pgvector', 'LlamaIndex', 'Reranking'],
  },
  {
    number: '03', title: 'Full-Stack AI Products', iconName: 'Layers',
    description: 'End-to-end apps with Next.js/React frontends and FastAPI/Node.js backends, integrating OpenAI GPT and Anthropic Claude into real user-facing features.',
    tags: ['Next.js', 'FastAPI', 'PostgreSQL'],
  },
  {
    number: '04', title: 'AI-Native ERP & CRM', iconName: 'Building2',
    description: 'Multi-tenant ERP/CRM platforms with role-based access, AI lead scoring, conversation summaries and next-best-action recommendations.',
    tags: ['Multi-tenant', 'RBAC', 'Lead Scoring'],
  },
  {
    number: '05', title: 'Automation & Integrations', iconName: 'Workflow',
    description: 'n8n workflows and MCP servers connecting legacy systems, WhatsApp, WooCommerce and CRMs to AI services — replacing hours of manual work.',
    tags: ['n8n', 'MCP', 'Webhooks'],
  },
  {
    number: '06', title: 'Evals, Guardrails & Observability', iconName: 'ShieldCheck',
    description: 'RAGAS/DeepEval regression evals in CI/CD, PII redaction, prompt-injection defense, LangSmith tracing, cost and latency dashboards, and audit logs.',
    tags: ['RAGAS', 'LangSmith', 'Guardrails'],
  },
];

/* ------------------------------------------------------------------ */
/* 5.6 Work — (03)                                                     */
/* ------------------------------------------------------------------ */

export const WORK_CATEGORIES = ['All', 'Agentic AI', 'RAG', 'AI Products', 'Automation'];

// Images: vid-scout / virtual-fit are screenshots of the live demos; the rest are
// illustrative architecture covers. Replace any of them with real screenshots in
// public/images/projects/<id>.jpg.
// Per-project repo links are not connected yet — an empty repoUrl hides the
// "View on GitHub" button. Fill them in later (e.g. `${PORTFOLIO_LINKS.github}/repo-name`).
export const PROJECTS_DATA: Project[] = [
  {
    id: 'ecom-ai-os', number: '01', title: 'Multi-Agent AI Operating System for E-Commerce', category: 'Agentic AI', year: '',
    description: 'A production-grade, self-hosted multi-agent OS automating end-to-end e-commerce operations — product management, pricing, sales, marketing, finance, dispatch and customer support.',
    highlights: [
      'Hierarchical LangGraph orchestration: a CEO supervisor coordinating 8+ departmental agents with human-in-the-loop approvals',
      '4-tier governance model (Autonomous → Notify → Approval Required → Human Decision) with audit trails for every decision',
      'Custom PostgreSQL observability for LLM telemetry (tokens, latency, cost), real-time monitoring and anomaly detection',
      'pgvector RAG over 100K+ embeddings with low-latency, context-aware retrieval',
      'WhatsApp Cloud API, WooCommerce, Meta Marketing API and courier integrations via HMAC-validated webhooks',
      '<3s end-to-end WhatsApp response latency on self-hosted PostgreSQL, Redis and Docker',
    ],
    tags: ['LangGraph', 'FastAPI', 'Celery', 'pgvector', 'Redis', 'Next.js', 'Docker'],
    image: '/images/projects/ecom-ai-os.jpg', gradientFallback: 'linear-gradient(135deg, #1A1530 0%, #5530A7 55%, #7B5CFF 100%)',
    liveUrl: '', repoUrl: '',
  },
  {
    id: 'vid-scout', number: '02', title: 'YouTube Research & Automation Agent', category: 'Agentic AI', year: '',
    description: 'An autonomous AI workflow for channel trend analysis, competitor research and topic discovery — turning hours of research into a single run.',
    highlights: [
      'Automated trend, competitor and topic research in one workflow execution',
      'RESTful API wrapper for easy integration into content-team workflows',
    ],
    tags: ['AI Agents', 'REST API', 'Automation'],
    image: '/images/projects/vid-scout.jpg', gradientFallback: 'linear-gradient(135deg, #0E0E0E 0%, #3A1F7A 50%, #B49CFF 100%)',
    liveUrl: 'https://vid-scout-ai.vercel.app/', repoUrl: '',
  },
  {
    id: 'virtual-fit', number: '03', title: 'E-Commerce Size & Fit Solution', category: 'AI Products', year: '',
    description: 'An AI recommendation engine matching customer biometrics to brand-specific sizing charts, combining computer vision with LLM logic.',
    highlights: [
      'Multimodal system: computer vision + LLM reasoning for personalized size recommendations',
      'Virtual try-on API integration and size prediction for better fit accuracy',
    ],
    tags: ['Computer Vision', 'LLMs', 'Multimodal', 'Next.js'],
    image: '/images/projects/virtual-fit.jpg', gradientFallback: 'linear-gradient(135deg, #2B1F55 0%, #7B5CFF 60%, #C9BCFF 100%)',
    liveUrl: 'https://virtual-fit-ai-mocha.vercel.app/', repoUrl: '',
  },
  {
    id: 'medical-rag', number: '04', title: 'Medical AI Chatbot with RAG', category: 'RAG', year: '',
    description: 'A retrieval-augmented assistant over medical documents that answers with citations, built for accuracy and concurrency.',
    highlights: [
      'Vector database retrieval with hybrid search',
      'Structured citations and confidence-based filtering to cut hallucinations',
      'React frontend + FastAPI backend serving concurrent users with fast responses',
    ],
    tags: ['RAG', 'FastAPI', 'React', 'Vector DB'],
    image: '/images/projects/medical-rag.jpg', gradientFallback: 'linear-gradient(135deg, #141414 0%, #2B1F55 45%, #7B5CFF 100%)',
    liveUrl: '', repoUrl: '',
  },
  {
    id: 'ghost-ai', number: '05', title: 'Ghost AI Meeting Assistant', category: 'AI Products', year: '',
    description: 'An invisible AI overlay for video calls that gives real-time contextual guidance using live transcription and on-screen OCR.',
    highlights: [
      'Speech recognition for meeting transcription + OCR for screen content',
      'Persistent memory recalling previous meeting context across sessions',
      'High accuracy across multiple languages',
    ],
    tags: ['Speech-to-Text', 'OCR', 'Memory', 'LLMs'],
    image: '/images/projects/ghost-ai.jpg', gradientFallback: 'linear-gradient(135deg, #0B0D12 0%, #5530A7 70%, #7B5CFF 100%)',
    liveUrl: '', repoUrl: '',
  },
  {
    id: 'lead-gen', number: '06', title: 'AI Lead Generation & Outreach Automation', category: 'Automation', year: '',
    description: 'An end-to-end n8n workflow tying lead sources, AI-written emails and CRM updates together for hyper-personalized outreach.',
    highlights: [
      'Automated lead scoring and personalized outreach, reducing manual sales work',
      'Self-hosted on AWS, significantly cutting monthly tool costs',
    ],
    tags: ['n8n', 'AWS', 'CRM', 'LLMs'],
    image: '/images/projects/lead-gen.jpg', gradientFallback: 'linear-gradient(135deg, #1F1F1F 0%, #5530A7 50%, #B49CFF 100%)',
    liveUrl: '', repoUrl: '',
  },
  {
    id: 'support-bot', number: '07', title: 'Multi-Channel AI Support Bot', category: 'Automation', year: '',
    description: 'One AI support system answering on WhatsApp, Telegram and email at the same time, with per-user memory across channels.',
    highlights: [
      'Coherent multi-turn conversations with memory across all channels',
      'n8n orchestration for message routing and per-user context',
    ],
    tags: ['n8n', 'WhatsApp', 'Telegram', 'Memory'],
    image: '/images/projects/support-bot.jpg', gradientFallback: 'linear-gradient(135deg, #161616 0%, #3A1F7A 55%, #7B5CFF 100%)',
    liveUrl: '', repoUrl: '',
  },
];

/* ------------------------------------------------------------------ */
/* 5.7 Experience — (04)                                               */
/* ------------------------------------------------------------------ */

export const EXPERIENCE_DATA: Experience[] = [
  {
    id: 'gulf-desk', company: 'GULF DESK SERVICES', role: 'Full Stack AI Engineer', period: '2026 — Present',
    location: 'Serving UAE-based clients', isCurrent: true, initial: 'G',
    summary: 'Building AI-native ERP and CRM platforms with agentic workflows, RAG and human-in-the-loop controls for UAE-based enterprise clients.',
    bullets: [
      'Working exclusively with UAE-based clients, translating their enterprise operations into AI-powered ERP and CRM solutions and managing delivery end to end',
      'Architecting and developing full-stack ERP and CRM systems (Next.js, FastAPI, PostgreSQL) covering sales pipeline, inventory, procurement, finance, and HR modules with role-based access control and multi-tenant architecture',
      'Designing agentic AI workflows using LangGraph and LangChain with tool calling, function calling, and structured outputs to automate lead qualification, quotation generation, purchase orders, and invoice processing',
      'Implementing human-in-the-loop (HITL) approval checkpoints with LangGraph interrupts, so high-impact agent actions (financial entries, customer communications, record updates) require human review before execution',
      'Building production RAG pipelines with embeddings, vector databases (pgvector/Qdrant), hybrid search, and reranking, enabling natural-language querying over ERP records, contracts, SOPs, and customer history',
      'Establishing LLM evaluation frameworks using RAGAS, DeepEval, and LangSmith to measure retrieval precision, faithfulness, answer relevance, and agent task success, with regression evals in CI/CD before every release',
      'Implementing AI guardrails including input/output validation, PII redaction, prompt injection defense, and constrained action spaces to ensure safe, compliant agent behavior',
      'Integrating LLMs (OpenAI GPT, Anthropic Claude) into CRM features including AI lead scoring, conversation summarization, sentiment analysis, and next-best-action recommendations for sales teams',
      'Developing Model Context Protocol (MCP) servers and REST APIs to expose ERP/CRM data and actions securely to AI agents',
      'Setting up LLM observability and monitoring with LangSmith tracing, token cost tracking, latency dashboards, and audit logs for every agent decision',
      'Deploying containerized services with Docker and CI/CD pipelines on AWS/Azure, with async task processing via Redis and Celery for scalable agent execution',
    ],
  },
  {
    id: 'rank-arrow', company: 'RANK ARROW', role: 'Agentic AI Engineer', period: 'Jan 2026 — Aug 2026',
    location: '', isCurrent: false, initial: 'R',
    summary: 'Architecting and deploying intelligent agentic systems with enterprise-grade guardrails for reliable automation at scale.',
    bullets: [
      'Designed and implemented multi-agent systems using LangChain and LangGraph with built-in safety guardrails, reducing manual intervention by 70% while maintaining 99.2% accuracy',
      'Developed sophisticated AI agents for e-commerce automation, finance process optimization, and supply chain management with constrained action spaces and validation layers',
      'Built intelligent agentic systems with error handling, fallback mechanisms, and audit trails for compliance and monitoring across critical business processes',
      'Implemented enterprise CRM automation integrating AI-driven insights with human approval workflows, improving response time by 3.5x',
      'Created RAG pipelines with LlamaIndex for context-aware agent decision-making, reducing hallucination-related errors by 85%',
      'Orchestrated n8n automation workflows connecting legacy systems with AI services, accelerating end-to-end process execution by 60%',
      'Set up LangSmith monitoring infrastructure for production agentic systems with real-time performance tracking and anomaly detection',
      'Automated recurring manual processes including order processing, invoice reconciliation, and customer data management, saving 25+ hours weekly across teams',
    ],
  },
  {
    id: 'accelerate-ai', company: 'ACCELERATE AI', role: 'Full Stack AI Engineer', period: '2024 — 2026',
    location: '', isCurrent: false, initial: 'A', summary: '',
    bullets: [
      'Built production RAG systems with LangChain and vector databases, significantly reducing hallucination and improving accuracy for domain-specific queries',
      'Developed high-performance APIs using FastAPI and Node.js handling concurrent requests with minimal latency',
      'Created full-stack applications with Next.js frontend and Python backend integrating LLM inference',
      'Implemented multi-agent workflows using LangGraph, reducing manual work and improving efficiency',
      'Fine-tuned language models using PEFT on specialized datasets, optimizing both performance and computational costs',
      'Built and deployed n8n automation workflows replacing manual processes across support and sales operations',
      'Set up LLM monitoring and observability for production systems using debugging tools',
    ],
  },
  {
    id: 'freelance', company: 'FIVERR & UPWORK', role: 'Freelance Full Stack Developer', period: '2023 — 2024',
    location: 'International clients', isCurrent: false, initial: 'F', summary: '',
    bullets: [
      'Delivered multiple GenAI solutions for international clients with strong feedback and repeat business',
      'Created automated content research and e-commerce AI integrations saving clients significant time',
      'Built multi-source research agents and web automation workflows using modern frameworks',
      'Designed lead generation and CRM automation systems improving client conversion rates',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 5.8 Skills — (05)                                                   */
/* ------------------------------------------------------------------ */

export const TOOLS_DATA: Tool[] = [
  { name: 'Claude Code', role: 'Agentic coding', monogram: 'CC', color: '#D97757', textColor: '#1A1A1A' },
  { name: 'Cursor', role: 'AI code editor', monogram: 'Cu', color: '#0B0B0B', textColor: '#F5F5F5' },
  { name: 'LangGraph', role: 'Agent orchestration', monogram: 'LG', color: '#1C3C3C', textColor: '#F5F5F5' },
  { name: 'n8n', role: 'Workflow automation', monogram: 'n8n', color: '#EA4B71', textColor: '#FFFFFF' },
  { name: 'Docker', role: 'Containers & deploy', monogram: 'Dk', color: '#1D63ED', textColor: '#FFFFFF' },
];

// Core skills by category — worded exactly as in the CV's CORE SKILLS block.
export const SKILL_CATEGORIES: SkillCategory[] = [
  { title: 'Frontend', icon: 'Monitor', color: '#60A5FA', items: ['React', 'Next.js', 'TypeScript', 'HTML/CSS', 'Tailwind CSS', 'responsive design'] },
  { title: 'Backend', icon: 'Server', color: '#34D399', items: ['Python (FastAPI, Django)', 'Node.js', 'Express', 'REST APIs', 'authentication'] },
  { title: 'Databases', icon: 'Database', color: '#FBBF24', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'vector databases for embeddings'] },
  { title: 'AI & ML', icon: 'BrainCircuit', color: '#A78BFA', items: ['LLM integration', 'RAG pipelines', 'fine-tuning', 'PyTorch', 'HuggingFace'] },
  { title: 'Frameworks', icon: 'Boxes', color: '#F472B6', items: ['LangChain', 'LangGraph', 'LlamaIndex', 'n8n for workflow automation'] },
  { title: 'DevOps', icon: 'Cloud', color: '#22D3EE', items: ['Docker', 'AWS', 'Vercel deployment', 'GitHub', 'CI/CD pipelines'] },
  { title: 'Tools', icon: 'Wrench', color: '#FB923C', items: ['Claude Code', 'GitHub Copilot', 'LLM debugging and optimization', 'n8n', 'CrewAI', 'Codex'] },
];

export const SKILLS_PLAYGROUND_LIST: SkillPill[] = [
  'LangChain', 'LangGraph', 'LlamaIndex', 'CrewAI', 'RAG Pipelines', 'Multi-Agent Systems',
  'Human-in-the-Loop', 'MCP Servers', 'Tool Calling', 'Structured Outputs', 'LLM Integration', 'Hybrid Search',
  'Reranking', 'Vector Databases', 'pgvector', 'Qdrant', 'Fine-tuning (PEFT)', 'PyTorch', 'HuggingFace',
  'OpenAI GPT', 'Anthropic Claude', 'RAGAS', 'DeepEval', 'LangSmith', 'LLM Debugging', 'Guardrails',
  'PII Redaction', 'Prompt Injection Defense', 'React', 'Next.js', 'TypeScript', 'HTML/CSS', 'Tailwind CSS',
  'Responsive Design', 'Python', 'FastAPI', 'Django', 'Node.js', 'Express', 'REST APIs', 'Authentication',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Celery', 'n8n', 'Docker', 'AWS', 'Azure', 'Vercel', 'GitHub',
  'CI/CD', 'Claude Code', 'GitHub Copilot', 'Codex',
].map((name, i) => ({ name, variant: (['violet', 'white', 'outline'] as const)[i % 3] }));

/* ------------------------------------------------------------------ */
/* 5.9 Education — (06)                                                */
/* ------------------------------------------------------------------ */

export const EDUCATION_QUOTE = 'The AI stack changes every quarter — so I never stop learning.';

export const EDUCATION_DATA: Education[] = [
  {
    institution: 'Superior University', location: 'Pakistan', program: 'Bachelor of Science in Artificial Intelligence',
    duration: '', period: '', badge: 'DEGREE', credentialUrl: '', icon: 'GraduationCap',
  },
  {
    institution: 'DataCamp', location: 'Online', program: 'AI Engineer Associate Certification',
    duration: '', period: '', badge: 'VERIFIED', credentialUrl: 'https://www.datacamp.com/certificate/AIEDA0018246475759', icon: 'BadgeCheck',
  },
];

/* ------------------------------------------------------------------ */
/* 5.10 Contact — (07)                                                 */
/* ------------------------------------------------------------------ */

export const CONTACT_DATA: ContactData = {
  headline: ["LET'S BUILD", 'SOMETHING SMART.'],
  inboxLabel: 'PRIMARY DIRECT INBOX',
  channels: [
    { label: 'Email', value: 'syedsamiullah596@gmail.com', href: 'mailto:syedsamiullah596@gmail.com', icon: 'Mail' },
    { label: 'Phone', value: '+92 313 4304258', href: 'tel:+923134304258', icon: 'Phone' },
    { label: 'WhatsApp', value: '+92 313 4304258', href: 'https://wa.me/923134304258', icon: 'MessageCircle' },
    { label: 'GitHub', value: '@SyedSamiUllah21', href: 'https://github.com/SyedSamiUllah21', icon: 'Github' },
    { label: 'LinkedIn', value: 'Syed Sami Ullah', href: 'https://www.linkedin.com/in/syed-sami-ullah-bbbb7338b/', icon: 'Linkedin' },
    { label: 'Resume', value: 'Download CV (PDF)', href: '/Syed_Sami_Ullah_CV.pdf', icon: 'FileDown', download: true },
  ],
  locationLine: 'LAHORE, PAKISTAN (UTC+5)',
  reachLine: 'Working with UAE & international clients',
};

/* ------------------------------------------------------------------ */
/* 5.11 Metadata                                                       */
/* ------------------------------------------------------------------ */

export const META = {
  title: 'Syed Sami Ullah — Full Stack AI Engineer | Agentic AI, RAG & Multi-Agent Systems',
  description:
    'Full Stack AI Engineer in Lahore building production-ready AI agents, RAG systems and multi-agent workflows with LangGraph, Next.js and FastAPI — currently delivering AI-native ERP & CRM platforms for UAE-based clients.',
};
