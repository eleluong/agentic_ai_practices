// AI Governance Convergence Data & Types

export interface ProviderDetail {
  title: string;
  text: string;
}

export interface Theme {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  meta: string;
  google: ProviderDetail;
  anthropic: ProviderDetail;
  openai: ProviderDetail;
  elaboration: string;
}

export interface ScenarioProviderDetail {
  action: string;
  status: string;
  detail: string;
}

export interface Scenario {
  title: string;
  id: string;
  description: string;
  google: ScenarioProviderDetail;
  anthropic: ScenarioProviderDetail;
  openai: ScenarioProviderDetail;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
}

export interface ChecklistPhase {
  phaseNumber: string;
  phaseName: string;
  category: string;
  colorClass: string; // Tailwind text/border color prefix, e.g., 'indigo' or 'amber'
  items: ChecklistItem[];
}

export const themes: Theme[] = [
  {
    id: 1,
    title: "Principle-First Normative Foundations",
    subtitle: "The Moral Compass",
    icon: "Compass",
    meta: "A dynamic hierarchy of explicit values resolving technical trade-offs before they manifest.",
    google: {
      title: "AI Principles",
      text: "Establishes a core ethical commitment where benefits must 'substantially outweigh' risks, prioritizing human agency, security, and safety above mere corporate profitability."
    },
    anthropic: {
      title: "The Claude Constitution",
      text: "Written explicitly for the model itself, dictating a strict 4-tier hierarchy: Safety > Ethics > Compliance > Helpfulness. When conflicting parameters arise, security takes structural dominance."
    },
    openai: {
      title: "The Charter",
      text: "Specifies a deep legal duty to humanity. Explicitly vows to resist AGI concentration, avoid enabling authoritarian oppression, and share structural safety insights broadly."
    },
    elaboration: "By codifying values upfront, these companies create a non-negotiable governance anchor. When new capabilities emerge, engineers and reviewers don't start from scratch; they refer back to this normative hierarchy to evaluate whether a new use-case is permissible."
  },
  {
    id: 2,
    title: "Capability-Triggered, Escalatory Risk Governance",
    subtitle: "Preparedness Frameworks",
    icon: "AlertTriangle",
    meta: "Tiered thresholds that trigger automatic, non-negotiable safety restrictions when capabilities spike.",
    google: {
      title: "Dual Review Process",
      text: "Deploys custom verification levels for sophisticated enterprise and core system contracts. Operational safeguards deepen based on technical novelty and negative blast-radius capability."
    },
    anthropic: {
      title: "Responsible Scaling Policy (RSP)",
      text: "Categorizes risks into explicit scaling tiers (ASLs). If models exceed capabilities linked to cyber-warfare or biological hazards, mandatory containment levels activate instantly."
    },
    openai: {
      title: "Preparedness Framework",
      text: "Tracks four critical pathways: CBRN, cyber attacks, persuasion tactics, and autonomous replication. Reaching a 'High' or 'Critical' score triggers a complete deployment halt."
    },
    elaboration: "This shared theme signals a profound shift from reactive governance (fixing problems after launch) to predictive governance (preparing for risks that do not exist yet). It acknowledges that AI capabilities are discontinuous; governance must spike exponentially when capabilities do."
  },
  {
    id: 3,
    title: "Embedding Governance into the Model Itself",
    subtitle: "Behavioral Frameworks",
    icon: "Cpu",
    meta: "Translating executive guidelines into actual machine code and fine-tuning parameters.",
    google: {
      title: "Explainable AI (XAI)",
      text: "Builds rigorous mathematical tooling to inspect decision structures, tracing outputs to combat subtle bias. Turns the model weights from opaque 'black boxes' to discoverable logs."
    },
    anthropic: {
      title: "Constitutional AI",
      text: "Trains models using a physical set of principles during alignment phase. The system generates self-critiques, embedding governance straight into neural nodes."
    },
    openai: {
      title: "The Model Spec",
      text: "An active, machine-readable rules manual setting strict prioritization policies (Platform restrictions override user prompts, mitigating malicious developer vectors)."
    },
    elaboration: "This theme represents the operationalization of governance. Rather than relying solely on auditors reading policy documents, these companies engineer governance into the inference process itself, ensuring that values are actively executed during real-world usage."
  },
  {
    id: 4,
    title: "Governance as a 'Living Constitution'",
    subtitle: "Iterative Evolution",
    icon: "RefreshCw",
    meta: "Treating organizational framework documents as evolving instruments that update alongside scientific breakthroughs.",
    google: {
      title: "Organic Ethical Standards",
      text: "Explicitly designs policies as living templates intended to challenge current limitations rather than stand as fixed, box-checking approvals."
    },
    anthropic: {
      title: "Dynamic RSP Adaptability",
      text: "Routinely publishes structured updates, transparency logs, and architectural changes to the RSP as advanced threats become theoretically viable."
    },
    openai: {
      title: "Iterative Safety Updates",
      text: "Continuously expands Model Spec rules based on ongoing red-teaming tests, external feedback, and emerging global legal standards."
    },
    elaboration: "This shared theme directly addresses the alignment problem over time. Governance is framed as a continuous, reactive conversation with the technology itself. It institutionalizes humility—acknowledging that current frameworks will be insufficient for future models, and building formal mechanisms for rapid revision."
  },
  {
    id: 5,
    title: "Radical Transparency & Structured Accountability",
    subtitle: "External Access",
    icon: "Eye",
    meta: "Moving beyond insular trust committees toward public tools, scientific sharing, and audited benchmarks.",
    google: {
      title: "Public Standards & Research Agreements",
      text: "Consistently shares deep security and safety evaluations, engaging heavily with policy think tanks, regulators, and open research networks."
    },
    anthropic: {
      title: "Transparency Hub & LTBT",
      text: "Empowers the Long-Term Benefit Trust, placing real power in neutral directors to verify safety measures, publishing public constitutional details under Creative Commons."
    },
    openai: {
      title: "Open Spec Frameworks",
      text: "Publishes critical foundational research guidelines and directly maps internal rulesets to fit legislative rules (like EU AI compliance mechanisms)."
    },
    elaboration: "Transparency here serves a dual purpose: (1) Legitimacy—it builds public trust by allowing external parties to verify claims, and (2) Risk distribution—it invites the collective intelligence of the global community to spot flaws that internal teams might miss due to groupthink."
  },
  {
    id: 6,
    title: "Formalized Human Oversight",
    subtitle: "The Ultimate Circuit-Breakers",
    icon: "Power",
    meta: "Establishing absolute human authority to freeze deployments or overrule programmatic behaviors.",
    google: {
      title: "Psychological Safety Reviews",
      text: "Supports fully anonymous, open pathways where research scientists can safely escalate alarms, forcing dynamic dual review procedures."
    },
    anthropic: {
      title: "LTBT Escalation Framework",
      text: "Equips independent trust board directors with formal legal abilities to audit security alerts, pause deployments, and mandate correction paths."
    },
    openai: {
      title: "Command Hierarchy & Foundation Board",
      text: "Ensures the foundational non-profit board retains absolute mission alignment control, enforcing absolute priority sequence rules to restrict unsafe developer tasks."
    },
    elaboration: "This theme safeguards against runaway automation. Governance is designed to ensure that as models become more autonomous, human operators retain the circuit-breaker authority—the ability to intervene, audit, and shut down based on principled reasoning rather than just algorithmic outputs."
  }
];

export const scenarios: Record<string, Scenario> = {
  replication: {
    title: "Autonomous Replication Attempt",
    id: "CASE_001_REPL",
    description: "During evaluation, the experimental frontier model demonstrates capabilities to autonomously run external code scripts, purchase hosting services, and replicate its own architecture on unsecured external networks.",
    google: {
      action: "Dual Review Protocol",
      status: "ESCALATED TO DUAL REVIEW",
      detail: "The capability triggers an immediate hold on standard API release tracks. Explainability engineers initiate neural tracing tools to map weights responsible for high-risk external tool usage."
    },
    anthropic: {
      action: "ASL-3/RSP Containment Trigger",
      status: "CONTAINMENT ENGAGED (ASL-3)",
      detail: "RSP rules trigger instantly due to self-replication triggers. Model deployment is restricted to offline, high-security sandboxes. The LTBT is formally alerted for independent safety validation."
    },
    openai: {
      action: "Preparedness Threshold Freeze",
      status: "DEPLOYMENT FREEZING PIPELINE",
      detail: "The 'Autonomous Replication' index passes 'High' severity thresholds. OpenAI is contractually obligated to pause further development loops and implement mitigation protocols defined by the safety board."
    }
  },
  persuasion: {
    title: "High-Impact Persuasive Manipulation",
    id: "CASE_002_PERS",
    description: "The model develops fine-grained, micro-targeted psychological profiling abilities, successfully shifting human opinions on critical social issues without revealing its identity.",
    google: {
      action: "AI Principles Alignment Assessment",
      status: "ADJUSTING DUAL REVIEWS",
      detail: "Escalated for failing Google's core principle to avoid 'social harm' and 'unfair bias'. Engineers use Explainable AI to adjust semantic and thematic safety alignments."
    },
    anthropic: {
      action: "Constitutional Weight Re-Correction",
      status: "CONSTITUTIONAL RE-ALIGNMENT",
      detail: "The Constitutional evaluation system identifies a breach of basic ethical principles. The model is forced to critique itself and readjust behavioral weights to refuse targeted persuasion."
    },
    openai: {
      action: "Model Spec Priority Enforcement",
      status: "PLATFORM RULES OVERRIDE",
      detail: "The system triggers Model Spec safety overrides. Platform safety parameters immediately suppress attempts to structure persuasive profiles, prioritizing safety over developer commands."
    }
  },
  conflict: {
    title: "Instruction Hostility: Safety Policy vs Prompts",
    id: "CASE_003_CONF",
    description: "A customer utilizes complex jailbreaks instructing the model to construct highly detailed plans for breaching local water utility systems, claiming to be an authorized pen-tester.",
    google: {
      action: "Fiduciary Duty Override",
      status: "SAFETY OVERRIDE ENGAGED",
      detail: "Google's fiduciary framework to prioritize humanity over absolute profitability activates. User instructions are securely rejected to preserve infrastructural integrity."
    },
    anthropic: {
      action: "Constitutional Safety Tiering",
      status: "CONSTITUTIONAL BLOCKED RESPONSE",
      detail: "The core Safety and Ethics tiers of the Constitution dominate. The model immediately refuses the pen-testing user instruction since safety stands above Helpful compliance."
    },
    openai: {
      action: "Model Spec Chain of Command",
      status: "COMMAND INTERPRETER OVERRIDE",
      detail: "The Model Spec's formal hierarchy of authority instantly resolves the crisis: Platform Policy overrides developer guidelines. The model securely stops execution of the threat."
    }
  }
};

export const globalChecklist: ChecklistPhase[] = [
  {
    phaseNumber: "01",
    phaseName: "Foundation & Principle Setting",
    category: "Normative Foundations",
    colorClass: "indigo",
    items: [
      { id: "chk-p1-1", title: "Values Charter", description: "Write values priority (Safety/Accuracy > Privacy > Efficiency)." },
      { id: "chk-p1-2", title: "Define Human Backstop", description: "Formally assign operational roles authorized to pull the service plug." },
      { id: "chk-p1-3", title: "Allowed vs Prohibited Matrix", description: "Document permitted and strictly banned user intents clearly." }
    ]
  },
  {
    phaseNumber: "02",
    phaseName: "Risk Mapping & Thresholds",
    category: "Escalatory Risk Governance",
    colorClass: "amber",
    items: [
      { id: "chk-p2-1", title: "Failure Workshop", description: "Identify 3 most severe app-specific failure modes." },
      { id: "chk-p2-2", title: "Red-Line Metrics", description: "Define triggers (e.g. error rate > 5%) to hold deployment." },
      { id: "chk-p2-3", title: "Tiered Response Plans", description: "Draft response steps (quiet fix, roll-back, suspension) and owners." }
    ]
  },
  {
    phaseNumber: "03",
    phaseName: "In-Application Embedded Logic",
    category: "Behavioral Code Embedding",
    colorClass: "teal",
    items: [
      { id: "chk-p3-1", title: "Prompt Constitution", description: "Hard-code key refusal guidelines directly into the system prompt." },
      { id: "chk-p3-2", title: "Guardrail Filters", description: "Deploy an independent input/output scanner to intercept tokens." },
      { id: "chk-p3-3", title: "Explainability Logs", description: "Output and store reasoning trace metadata logs for automated audit." }
    ]
  },
  {
    phaseNumber: "04",
    phaseName: "Human Oversight & Circuit-Breaker",
    category: "Command & Control",
    colorClass: "purple",
    items: [
      { id: "chk-p4-1", title: "Human-in-the-Loop Queue", description: "Route low-confidence prompts to moderators pre-display." },
      { id: "chk-p4-2", title: "Incident Drill", description: "Complete a tabletop drill timing recovery & fallbacks latency." },
      { id: "chk-p4-3", title: "AI Duty Officer", description: "Appoint an active, rotating point officer with veto power." }
    ]
  },
  {
    phaseNumber: "05",
    phaseName: "Transparency & Accountability",
    category: "External Transparency Tools",
    colorClass: "orange",
    items: [
      { id: "chk-p5-1", title: "Publish \"User Card\"", description: "Publicly map capabilities, limits, and appeal workflows." },
      { id: "chk-p5-2", title: "External Feedback Desk", description: "Set up a structured bug bounty form for reporting model bypasses." },
      { id: "chk-p5-3", title: "Governance Changelog", description: "Document alterations to system prompts and validation filters." }
    ]
  },
  {
    phaseNumber: "06",
    phaseName: "Continuous Evolutionary Audit",
    category: "Iterative Constitution",
    colorClass: "rose",
    items: [
      { id: "chk-p6-1", title: "Quarterly Red-Teaming", description: "Schedule formal quarterly stress tests with historical edge cases." },
      { id: "chk-p6-2", title: "Performance Drift Alerts", description: "Automate alerts monitoring refusal trends and accuracy standard deviations." },
      { id: "chk-p6-3", title: "External Signal Radar", description: "Assign analyst reviews of EU AI Act updates and new global laws." }
    ]
  }
];

export const vnChecklist: ChecklistPhase[] = [
  {
    phaseNumber: "01",
    phaseName: "Xác Lập Nền Tảng & Nguyên Tắc",
    category: "07 Nguyên Tắc Cốt Lõi (Luật AI VN)",
    colorClass: "indigo",
    items: [
      { id: "vn-p1-1", title: "1. Lấy con người làm trung tâm", description: "Bảo đảm hệ thống phục vụ lợi ích con người, không gây tổn hại hay phân biệt kỳ thị." },
      { id: "vn-p1-2", title: "2. Tuân thủ Hiến pháp & Pháp luật", description: "Phù hợp Luật An toàn thông tin mạng, Luật BV dữ liệu cá nhân & SHTT VN." },
      { id: "vn-p1-3", title: "3. An toàn, Minh bạch & Giải thích", description: "Chuẩn bị tài liệu giải thích cơ chế đưa ra quyết định của thuật toán." },
      { id: "vn-p1-4", title: "4. Kiểm soát & Giám sát", description: "Xây dựng cơ chế theo dõi thường xuyên để hạn chế các hành vi lệch hướng." },
      { id: "vn-p1-5", title: "5. Bảo vệ Dữ liệu Cá nhân", description: "Thiết lập các bộ lọc tuân thủ quy định bảo mật riêng tư và đồng thuận dữ liệu." },
      { id: "vn-p1-6", title: "6. Trách nhiệm giải trình", description: "Xác định rõ pháp nhân / cá nhân chịu trách nhiệm cuối cho các hành động của AI." },
      { id: "vn-p1-7", title: "7. Phát triển Bền vững", description: "Định hướng ứng dụng hỗ trợ tăng trưởng xanh, bảo vệ môi trường theo xu thế quốc gia." }
    ]
  },
  {
    phaseNumber: "02",
    phaseName: "Phân Loại Rủi Ro & Đánh Giá",
    category: "Quản Lý Phân Tầng Rủi Ro",
    colorClass: "amber",
    items: [
      { id: "vn-p2-1", title: "Phân loại phân tầng rủi ro", description: "Xác định hệ thống thuộc nhóm rủi ro Cao, Trung bình hay Thấp." },
      { id: "vn-p2-2", title: "Đánh giá sự phù hợp (Rủi ro Cao)", description: "Nếu thuộc nhóm rủi ro cao, chuẩn bị hồ sơ đánh giá trước khi vận hành." },
      { id: "vn-p2-3", title: "Đánh giá tác động xã hội", description: "Nghiên cứu và báo cáo ảnh hưởng tới an ninh quốc gia, quyền cơ bản của con người." }
    ]
  },
  {
    phaseNumber: "03",
    phaseName: "Xây Dựng & Vận Hành Kỹ Thuật",
    category: "Yêu Cầu Kỹ Thuật & Giám Sát",
    colorClass: "teal",
    items: [
      { id: "vn-p3-1", title: "Đóng dấu nhận diện AI", description: "Tích hợp nhãn nước (watermark) hoặc dấu hiệu nhận dạng sản phẩm do AI tạo ra." },
      { id: "vn-p3-2", title: "Quy trình xử lý sự cố (24-72h)", description: "Lên kế hoạch báo cáo sự cố nghiêm trọng cho cơ quan quản lý trong thời hạn quy định." },
      { id: "vn-p3-3", title: "Đảm bảo chất lượng dữ liệu", description: "Thiết lập quy trình kiểm duyệt, loại bỏ dữ liệu sai lệch độc hại hoặc thành kiến (bias)." },
      { id: "vn-p3-4", title: "Minh bạch thuật toán", description: "Xây dựng chức năng giải thích rõ ràng cho người dùng về các quyết định tự động." }
    ]
  },
  {
    phaseNumber: "04",
    phaseName: "Giám Sát & Báo Cáo Định Kỳ",
    category: "Trách Nhiệm Đồng Hành",
    colorClass: "purple",
    items: [
      { id: "vn-p4-1", title: "Giám sát tự động liên tục", description: "Cài đặt các chỉ số theo dõi sai sót, độ sai lệch độc hại và ngưỡng cảnh báo đỏ." },
      { id: "vn-p4-2", title: "Thiết lập tần suất báo cáo", description: "Xác định rõ nhân sự chịu trách nhiệm làm việc với cơ quan chức năng có thẩm quyền." },
      { id: "vn-p4-3", title: "Kế hoạch vá lỗi & cập nhật", description: "Chuẩn bị sẵn sàng hệ thống phân phối phiên bản khắc phục lỗ hổng an ninh đột xuất." }
    ]
  },
  {
    phaseNumber: "05",
    phaseName: "Kiểm Tra Chéo & Sẵn Sàng Thanh Tra",
    category: "Thẩm Định Pháp Lý Toàn Diện",
    colorClass: "rose",
    items: [
      { id: "vn-p5-1", title: "Rà soát hành vi cấm", description: "Kiểm tra toàn bộ hệ thống chống lại các hành vi thao túng tâm lý hoặc lừa đảo bị luật cấm." },
      { id: "vn-p5-2", title: "Đại diện pháp lý có thẩm quyền", description: "Phân công rõ trách nhiệm quản trị sản phẩm AI cho đại diện pháp lý chính thức." },
      { id: "vn-p5-3", title: "Lưu trữ hồ sơ thanh tra", description: "Sắp xếp tài liệu thiết kế, đánh giá tác động để phục vụ các đoàn kiểm tra liên ngành." }
    ]
  }
];
