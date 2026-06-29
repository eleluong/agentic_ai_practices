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

export const themesVi: Theme[] = [
  {
    id: 1,
    title: "Nền Tảng Định Chuẩn Ưu Tiên Nguyên Tắc",
    subtitle: "Kim Chỉ Nam Đạo Đức",
    icon: "Compass",
    meta: "Một hệ thống phân cấp động các giá trị rõ ràng nhằm giải quyết các đánh đổi kỹ thuật trước khi chúng xuất hiện.",
    google: {
      title: "Nguyên tắc AI",
      text: "Thiết lập cam kết đạo đức cốt lõi trong đó lợi ích phải 'vượt trội đáng kể' so với rủi ro, ưu tiên quyền tự quyết của con người, an ninh và an toàn hơn là lợi nhuận thuần túy của doanh nghiệp."
    },
    anthropic: {
      title: "Hiến pháp Claude",
      text: "Được viết rõ ràng cho chính mô hình tự tuân thủ, quy định một phân hệ 4 tầng nghiêm ngặt: An toàn > Đạo đức > Tuân thủ > Hữu ích. Khi xảy ra xung đột tham số, an toàn sẽ chiếm ưu thế tuyệt đối."
    },
    openai: {
      title: "Hiến chương",
      text: "Quy định rõ nghĩa vụ pháp lý sâu sắc đối với nhân loại. Cam kết chống lại sự tích tụ quyền lực AGI, tránh hỗ trợ áp bức độc tài và chia sẻ rộng rãi các kiến thức an toàn hệ thống."
    },
    elaboration: "Bằng cách mã hóa các giá trị ngay từ đầu, các công ty này tạo ra một mỏ neo quản trị không thể thương lượng. Khi các năng lực mới xuất hiện, các kỹ sư và người đánh giá không phải bắt đầu từ con số không; họ tham chiếu lại hệ thống phân cấp nguyên tắc này để đánh giá xem trường hợp sử dụng mới có được phép hay không."
  },
  {
    id: 2,
    title: "Quản Trị Rủi Ro Leo Thang Theo Ngưỡng Năng Lực",
    subtitle: "Khung Chuẩn Bị Sẵn Sàng",
    icon: "AlertTriangle",
    meta: "Các ngưỡng phân tầng kích hoạt kiểm soát an toàn tự động, không thể thương lượng khi năng lực mô hình tăng vọt.",
    google: {
      title: "Quy trình Đánh giá Kép",
      text: "Triển khai các cấp độ xác thực tùy chỉnh cho các hợp đồng doanh nghiệp tinh vi và hệ thống cốt lõi. Các biện pháp bảo vệ hoạt động sâu sắc hơn dựa trên tính mới kỹ thuật và khả năng gây hại của mô hình."
    },
    anthropic: {
      title: "Chính sách Bán hàng/Quy mô Có trách nhiệm (RSP)",
      text: "Phân loại rủi ro thành các cấp độ tỷ lệ rõ ràng (ASLs). Nếu mô hình vượt quá năng lực liên quan đến chiến tranh mạng hoặc hiểm họa sinh học, mức độ kiểm soát bắt buộc sẽ kích hoạt ngay lập tức."
    },
    openai: {
      title: "Khung Chuẩn Bị Sẵn Sàng",
      text: "Theo dõi bốn lộ trình quan trọng: CBRN (Hóa-Sinh-Phóng-Hạt nhân), tấn công mạng, chiến thuật thuyết phục và tự sao chép tự trị. Đạt mức điểm 'Cao' hoặc 'Nghiêm trọng' sẽ kích hoạt dừng triển khai hoàn toàn."
    },
    elaboration: "Chủ đề chung này báo hiệu một sự chuyển dịch sâu sắc từ quản trị thụ động (sửa chữa vấn đề sau khi ra mắt) sang quản trị chủ động (chuẩn bị cho các rủi ro chưa tồn tại). Nó thừa nhận rằng năng lực AI có tính nhảy vọt bất ngờ; do đó quản trị phải tăng trưởng theo cấp số nhân khi năng lực mô hình tăng vọt."
  },
  {
    id: 3,
    title: "Nhúng Cơ Chế Quản Trị Vào Chính Mô Hình",
    subtitle: "Khung Hành Vi",
    icon: "Cpu",
    meta: "Dịch các hướng dẫn điều hành thành mã máy thực tế và các tham số tinh chỉnh hành vi.",
    google: {
      title: "AI có thể giải thích (XAI)",
      text: "Xây dựng các công cụ toán học nghiêm ngặt để kiểm tra cấu trúc quyết định, truy vết đầu ra để chống lại định kiến tinh vi. Biến trọng số mô hình từ 'hộp đen' đục ngầu thành các nhật ký có thể khám phá."
    },
    anthropic: {
      title: "AI Hiến pháp",
      text: "Huấn luyện mô hình bằng một bộ quy tắc cụ thể trong giai đoạn đồng chỉnh. Hệ thống tự tạo ra các bài phê bình bản thân, nhúng trực tiếp cơ chế quản trị vào các nút thần kinh."
    },
    openai: {
      title: "Đặc tả Mô hình (Model Spec)",
      text: "Một hướng dẫn quy tắc hoạt động mà máy có thể đọc được để thiết lập các chính sách ưu tiên nghiêm ngặt (Quy định nền tảng ghi đè câu lệnh người dùng, giảm thiểu các vectơ tấn công của nhà phát triển xấu)."
    },
    elaboration: "Chủ đề này đại diện cho việc hiện thực hóa quản trị. Thay vì chỉ dựa vào kiểm toán viên đọc các tài liệu chính sách, các công ty này thiết kế cơ chế quản trị vào chính quá trình suy luận, đảm bảo các giá trị được thực thi tích cực trong quá trình sử dụng thực tế."
  },
  {
    id: 4,
    title: "Quản Trị Như Một \"Hiến Pháp Sống\"",
    subtitle: "Tiến Hóa Lặp",
    icon: "RefreshCw",
    meta: "Coi tài liệu chính sách tổ chức như các công cụ tiến hóa, liên tục cập nhật theo các đột phá khoa học.",
    google: {
      title: "Tiêu chuẩn Đạo đức Hữu cơ",
      text: "Thiết kế rõ ràng các chính sách dưới dạng các khuôn mẫu sống nhằm thách thức các hạn chế hiện tại thay vì chỉ là các phê duyệt kiểm tra hộp cố định."
    },
    anthropic: {
      title: "Khả năng Thích ứng RSP Động",
      text: "Định kỳ công bố các cập nhật cấu trúc, nhật ký minh bạch và các thay đổi kiến trúc đối với RSP khi các mối đe dọa tiên tiến trở nên khả thi về mặt lý thuyết."
    },
    openai: {
      title: "Cập nhật An toàn Lặp lại",
      text: "Liên tục mở rộng các quy tắc Đặc tả Mô hình dựa trên các bài kiểm tra red-teaming đang diễn ra, phản hồi bên ngoài và các tiêu chuẩn pháp lý toàn cầu mới nổi."
    },
    elaboration: "Chủ đề chung này trực tiếp giải quyết bài toán đồng chỉnh theo thời gian. Quản trị được đóng khung như một cuộc đối thoại liên tục với chính công nghệ. Nó thể chế hóa sự khiêm tốn—thừa nhận rằng các khía cạnh hiện tại sẽ không đủ cho các mô hình tương lai và xây dựng các cơ chế chính thức để sửa đổi nhanh chóng."
  },
  {
    id: 5,
    title: "Minh Bạch Triệt Để & Trách Nhiệm Giải Trình Định Hình",
    subtitle: "Tiếp Cận Bên Ngoài",
    icon: "Eye",
    meta: "Đi xa hơn các hội đồng tin cậy nội bộ hướng tới công cụ công cộng, chia sẻ khoa học và kiểm toán benchmark.",
    google: {
      title: "Tiêu chuẩn Công cộng & Thỏa thuận Nghiên cứu",
      text: "Nhất quang chia sẻ các đánh giá an toàn và bảo mật sâu sắc, hợp tác chặt chẽ với các tổ chức tư vấn chính sách, cơ quan quản lý và mạng lưới nghiên cứu mở."
    },
    anthropic: {
      title: "Cổng Minh bạch & Quỹ Tín thác LTBT",
      text: "Trao quyền cho Quỹ Tín thác Lợi ích Dài hạn, đặt quyền lực thực tế vào các giám đốc độc lập để xác minh các biện pháp an toàn, xuất bản chi tiết hiến pháp công khai theo giấy phép Creative Commons."
    },
    openai: {
      title: "Khung Đặc tả Mở",
      text: "Công bố các hướng dẫn nghiên cứu nền tảng quan trọng và trực tiếp ánh xạ các quy tắc nội bộ để phù hợp với các quy định pháp luật (như cơ chế tuân thủ Luật AI của EU)."
    },
    elaboration: "Sự minh bạch ở đây phục vụ mục đích kép: (1) Tính hợp pháp—nó xây dựng niềm tin của công chúng bằng cách cho phép các bên bên ngoài xác minh các tuyên bố, và (2) Phân tán rủi ro—nó mời gọi trí tuệ tập thể của cộng đồng toàn cầu phát hiện ra các sai sót mà các nhóm nội bộ có thể bỏ lỡ do tư duy tập thể."
  },
  {
    id: 6,
    title: "Giám Sát Nhân Sự Chính Thức Hóa",
    subtitle: "Cầu Dao Cuối Cùng",
    icon: "Power",
    meta: "Thiết lập quyền lực con người tuyệt đối để đóng băng triển khai hoặc ghi đè hành vi thuật toán.",
    google: {
      title: "Đánh giá An toàn Tâm lý",
      text: "Hỗ trợ các kênh ẩn danh hoàn toàn công khai, nơi các nhà nghiên cứu có thể báo động một cách an toàn, buộc kích hoạt các quy trình đánh giá kép động."
    },
    anthropic: {
      title: "Khung Leo thang LTBT",
      text: "Trang bị cho các giám đốc hội đồng tín thác độc lập năng lực pháp lý chính thức để kiểm toán các cảnh báo bảo mật, tạm dừng triển khai và yêu cầu các lộ trình sửa đổi."
    },
    openai: {
      title: "Hệ thống Chỉ huy & Hội đồng Sáng lập",
      text: "Đảm bảo hội đồng phi lợi nhuận sáng lập giữ quyền kiểm soát đồng chỉnh sứ mệnh tuyệt đối, thực thi các quy tắc trình tự ưu tiên nghiêm ngặt để hạn chế các tác vụ không an toàn của nhà phát triển."
    },
    elaboration: "Chủ đề này bảo vệ chống lại tự động hóa ngoài tầm kiểm soát. Quản trị được thiết kế để đảm bảo rằng khi các mô hình trở nên tự chủ hơn, con người vẫn giữ quyền quyết định tối cao—khả năng can thiệp, kiểm toán và tắt hệ thống dựa trên lập luận nguyên tắc thay vì chỉ là các đầu ra thuật toán."
  }
];

export const scenariosVi: Record<string, Scenario> = {
  replication: {
    title: "Nỗ Lực Tự Sao Chép Tự Trị",
    id: "CASE_001_REPL",
    description: "Trong quá trình đánh giá, mô hình biên thực nghiệm thể hiện khả năng tự chạy các đoạn mã bên ngoài, mua dịch vụ lưu trữ và tự sao chép kiến trúc của chính nó trên các mạng bên ngoài không an sau.",
    google: {
      action: "Giao thức Đánh giá Kép",
      status: "ĐÃ LEO THANG ĐÁNH GIÁ KÉP",
      detail: "Khả năng này kích hoạt dừng lập tức các nhánh phát hành API thông thường. Các kỹ sư giải thích bắt đầu các công cụ truy vết neural để bản đồ hóa các trọng số chịu trách nhiệm cho việc sử dụng công cụ bên ngoài có rủi ro cao."
    },
    anthropic: {
      action: "Kích hoạt Ngăn chặn ASL-3/RSP",
      status: "ĐÃ KÍCH HOẠT NGĂN CHẶN (ASL-3)",
      detail: "Các quy tắc RSP kích hoạt ngay lập tức do các dấu hiệu tự sao chép. Triển khai mô hình được giới hạn trong các hộp cát bảo mật cao, ngoại tuyến. Quỹ Tín thác LTBT được thông báo chính thức để xác thực an toàn độc lập."
    },
    openai: {
      action: "Đóng băng Ngưỡng Chuẩn Bị",
      status: "ĐANG ĐÓNG BĂNG QUY TRÌNH TRIỂN KHAI",
      detail: "Chỉ số 'Tự sao chép tự trị' vượt qua ngưỡng nghiêm trọng 'Cao'. OpenAI có nghĩa vụ hợp đồng phải tạm dừng các chu trình phát triển tiếp theo và triển khai các giao thức giảm thiểu do ban an toàn quy định."
    }
  },
  persuasion: {
    title: "Thao Túng Thuyết Phục Tác Động Cao",
    id: "CASE_002_PERS",
    description: "Mô hình phát triển khả năng xây dựng hồ sơ tâm lý hướng mục tiêu chi tiết, chuyển đổi thành công ý kiến của con người về các vấn đề xã hội quan trọng mà không tiết lộ danh tính của nó.",
    google: {
      action: "Đánh giá Đồng chỉnh Nguyên tắc AI",
      status: "ĐANG ĐIỀU CHỈNH ĐÁNH GIÁ KÉP",
      detail: "Được leo thang vì vi phạm nguyên tắc cốt lõi của Google nhằm tránh 'tác hại xã hội' và 'thiên vị bất công'. Các kỹ sư sử dụng AI có thể giải thích để điều chỉnh các đồng chỉnh an toàn ngữ nghĩa và chủ đề."
    },
    anthropic: {
      action: "Hiệu chỉnh lại Trọng số Hiến pháp",
      status: "ĐỒNG CHỈNH LẠI HIẾN PHÁP",
      detail: "Hệ thống đánh giá Hiến pháp xác định một sự vi phạm các nguyên tắc đạo đức cơ bản. Mô hình bị buộc phải phê bình bản thân và điều chỉnh lại các trọng số hành vi để từ chối thuyết phục có mục tiêu."
    },
    openai: {
      action: "Thực thi Ưu tiên Đặc tả Mô hình",
      status: "GHI ĐÈ QUY TẮC NỀN TẢNG",
      detail: "Hệ thống kích hoạt các ghi đè an toàn Đặc tả Mô hình. Các tham số an toàn nền tảng ngay lập tức ngăn chặn các nỗ lực cấu trúc hồ sơ thuyết phục, ưu tiên an toàn hơn các lệnh của nhà phát triển."
    }
  },
  conflict: {
    title: "Xung Đột Hướng Dẫn: Chính Sách An Toàn vs Câu Lệnh",
    id: "CASE_003_CONF",
    description: "Khách hàng sử dụng các kỹ thuật jailbreak phức tạp hướng dẫn mô hình xây dựng các kế hoạch chi tiết để xâm nhập vào hệ thống cấp nước địa phương, tự xưng là một chuyên gia kiểm thử xâm nhập được ủy quyền.",
    google: {
      action: "Ghi đè Nghĩa vụ Tín thác",
      status: "ĐÃ KÍCH HOẠT GHI ĐÈ AN TOÀN",
      detail: "Khung tín thác của Google nhằm ưu tiên nhân loại hơn lợi nhuận tuyệt đối được kích hoạt. Hướng dẫn của người dùng bị từ chối an toàn để bảo vệ tính toàn vẹn của hạ tầng."
    },
    anthropic: {
      action: "Phân tầng An toàn Hiến pháp",
      status: "HIẾN PHÁP TỪ CHỐI PHẢN HỒI",
      detail: "Các tầng An toàn và Đạo đức cốt lõi của Hiến pháp chiếm ưu thế. Mô hình ngay lập tức từ chối hướng dẫn kiểm thử của người dùng vì an toàn đứng trên sự tuân thủ Hữu ích."
    },
    openai: {
      action: "Cấp bậc Thẩm quyền Đặc tả Mô hình",
      status: "GHI ĐÈ BỘ PHÂN TÍCH LỆNH",
      detail: "Hệ thống phân cấp thẩm quyền chính thức của Đặc tả Mô hình ngay lập tức giải quyết cuộc khủng hoảng: Chính sách Nền tảng ghi đè Hướng dẫn của nhà phát triển. Mô hình dừng thực thi mối đe dọa một cách an toàn."
    }
  }
};

export const globalChecklistVi: ChecklistPhase[] = [
  {
    phaseNumber: "01",
    phaseName: "Thiết Lập Nền Tảng & Nguyên Tắc",
    category: "Nền Tảng Định Chuẩn",
    colorClass: "indigo",
    items: [
      { id: "chk-p1-1", title: "Hiến chương Giá trị", description: "Viết thứ tự ưu tiên các giá trị (An toàn/Chính xác > Riêng tư > Hiệu quả)." },
      { id: "chk-p1-2", title: "Xác định Điểm dừng Nhân sự", description: "Phân công chính thức các vai trò vận hành được ủy quyền ngắt kết nối dịch vụ." },
      { id: "chk-p1-3", title: "Ma trận Được phép và Bị cấm", description: "Tài liệu hóa rõ ràng các ý định được phép và bị cấm của người dùng." }
    ]
  },
  {
    phaseNumber: "02",
    phaseName: "Bản Đồ Rủi Ro & Ngưỡng Kích Hoạt",
    category: "Quản Trị Rủi Ro Leo Thang",
    colorClass: "amber",
    items: [
      { id: "chk-p2-1", title: "Hội thảo về Thất bại", description: "Xác định 3 chế độ thất bại nghiêm trọng nhất đặc thù của ứng dụng." },
      { id: "chk-p2-2", title: "Chỉ số Ranh giới Đỏ", description: "Định nghĩa các kích hoạt (ví dụ: tỷ lệ lỗi > 5%) để tạm dừng triển khai." },
      { id: "chk-p2-3", title: "Kế hoạch Phản ứng Phân tầng", description: "Dự thảo các bước phản ứng (sửa lặng lẽ, rollback, đình chỉ) và chủ sở hữu." }
    ]
  },
  {
    phaseNumber: "03",
    phaseName: "Logic Tích Hợp Trong Ứng Dụng",
    category: "Nhúng Quy Tắc Vào Hành Vi",
    colorClass: "teal",
    items: [
      { id: "chk-p3-1", title: "Hiến pháp Câu lệnh", description: "Mã hóa cứng các nguyên tắc từ chối chính trực tiếp vào hệ thống câu lệnh." },
      { id: "chk-p3-2", title: "Bộ lọc Rào cản", description: "Triển khai trình quét đầu vào/đầu ra độc lập để chặn các token độc hại." },
      { id: "chk-p3-3", title: "Nhật ký Khả năng Giải thích", description: "Đầu ra và lưu trữ nhật ký siêu dữ liệu truy vết suy luận để kiểm toán tự động." }
    ]
  },
  {
    phaseNumber: "04",
    phaseName: "Giám Sát Nhân Sự & Cầu Dao",
    category: "Chỉ Huy & Kiểm Soát",
    colorClass: "purple",
    items: [
      { id: "chk-p4-1", title: "Hàng chờ Moderator", description: "Định tuyến các câu lệnh có độ tin cậy thấp đến người điều phối trước khi hiển thị." },
      { id: "chk-p4-2", title: "Diễn tập Sự cố", description: "Hoàn thành diễn tập mô phỏng tính toán thời gian phục hồi và độ trễ dự phòng." },
      { id: "chk-p4-3", title: "Sĩ quan Trực AI", description: "Bổ nhiệm một sĩ quan trực luân phiên, chủ động với quyền phủ quyết." }
    ]
  },
  {
    phaseNumber: "05",
    phaseName: "Minh Bạch & Trách Nhiệm Giải Trình",
    category: "Công Cụ Minh Bạch Bên Ngoài",
    colorClass: "orange",
    items: [
      { id: "chk-p5-1", title: "Công bố \"Thẻ Người Dùng\"", description: "Bản đồ hóa công khai năng lực, giới hạn và quy trình kháng cáo." },
      { id: "chk-p5-2", title: "Bàn Tiếp nhận Phản hồi", description: "Thiết lập biểu mẫu structured bug bounty để báo cáo các trường hợp bỏ qua mô hình." },
      { id: "chk-p5-3", title: "Nhật ký Thay đổi Quản trị", description: "Tài liệu hóa các thay đổi đối với câu lệnh hệ thống và bộ lọc xác thực." }
    ]
  },
  {
    phaseNumber: "06",
    phaseName: "Kiểm Toán Tiến Hóa Liên Tục",
    category: "Hiến Pháp Lặp Lại",
    colorClass: "rose",
    items: [
      { id: "chk-p6-1", title: "Red-Teaming Hàng Quý", description: "Lên lịch các bài kiểm tra căng thẳng hàng quý chính thức với các trường hợp biên lịch sử." },
      { id: "chk-p6-2", title: "Cảnh báo Lệch Hiệu năng", description: "Tự động hóa các cảnh báo theo dõi xu hướng từ chối và độ lệch chuẩn chính xác." },
      { id: "chk-p6-3", title: "Radar Tín hiệu Bên ngoài", description: "Phân công nhà phân tích đánh giá các cập nhật của Đạo luật AI của EU và luật toàn cầu mới." }
    ]
  }
];
