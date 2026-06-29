import React from 'react';
import { Shield, Zap, Cpu, Power, ArrowRight, ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

interface StackLayerProps {
  level: string;
  title: string;
  description: string;
  footerLabel: string;
  icon: React.ReactNode;
  colorBorder: string;
  colorBg: string;
  colorText: string;
}

const StackLayer = ({
  level,
  title,
  description,
  footerLabel,
  icon,
  colorBorder,
  colorBg,
  colorText,
}: StackLayerProps) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs transition-all duration-300 flex flex-col justify-between hover:border-${colorBorder}-500 hover:-translate-y-1 relative group`}
    >
      <div>
        <div className={`w-10 h-10 rounded-lg ${colorBg} flex items-center justify-center ${colorText} mb-4 font-extrabold text-sm`}>
          {level}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
      </div>
      <div className={`mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold ${colorText}`}>
        <span>{footerLabel}</span>
        {icon}
      </div>
    </div>
  );
};

export const GovernanceStack = () => {
  const { lang } = useLanguage();
  const t = translations[lang];

  const layers = lang === 'vi' ? [
    {
      level: 'L1',
      title: 'Nền Tảng Định Chuẩn',
      description:
        'Mỏ neo đạo đức nền tảng. Thiết lập các giá trị cốt lõi và nghĩa vụ tín thác (ví dụ: nhân loại trên lợi nhuận, quyền hiến định) để định hướng mọi ưu tiên điều hành.',
      footerLabel: 'Google, Anthropic, OpenAI',
      icon: <Shield className="w-4 h-4" />,
      colorBorder: 'blue',
      colorBg: 'bg-blue-50',
      colorText: 'text-blue-600',
    },
    {
      level: 'L2',
      title: 'Kích Hoạt Theo Năng Lực',
      description:
        'Các dấu hiệu rủi ro động (CBRN, an ninh mạng, tự sao chép) kích hoạt tăng cường bảo mật và rào cản pháp lý lập tức, không thể thương lượng khi mô hình đạt các mốc an toàn.',
      footerLabel: 'RSP / Sự Chuẩn Bị',
      icon: <Zap className="w-4 h-4" />,
      colorBorder: 'amber',
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-600',
    },
    {
      level: 'L3',
      title: 'Nhúng Trực Tiếp Vào Mô Hình',
      description:
        'Quản trị được mã hóa trực tiếp vào trọng số mô hình và các mô hình suy luận. Truyền tải các rào cản hệ thống trực tiếp như Constitutional AI và Đặc tả Mô hình.',
      footerLabel: 'Constitutional AI / Đặc tả',
      icon: <Cpu className="w-4 h-4" />,
      colorBorder: 'purple',
      colorBg: 'bg-purple-50',
      colorText: 'text-purple-600',
    },
    {
      level: 'L4',
      title: 'Cầu Dao Nhân Sự',
      description:
        'Quyền phủ quyết dứt khoát. Đảm bảo các nhà phát triển, ban tín thác và người đánh giá pháp lý duy trì sự can thiệp thủ công hoàn toàn đối với quy trình phát triển và phân phối.',
      footerLabel: 'LTBT / Ban Chỉ Huy Sứ Mệnh',
      icon: <Power className="w-4 h-4" />,
      colorBorder: 'emerald',
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-600',
    },
  ] : [
    {
      level: 'L1',
      title: 'Normative Foundation',
      description:
        'The bedrock moral anchor. Establishes the core values and fiduciary duties (e.g., humanity over profit, constitutional rights) to steer all executive priorities.',
      footerLabel: 'Google, Anthropic, OpenAI',
      icon: <Shield className="w-4 h-4" />,
      colorBorder: 'blue',
      colorBg: 'bg-blue-50',
      colorText: 'text-blue-600',
    },
    {
      level: 'L2',
      title: 'Capability-Triggered',
      description:
        'Dynamic risk markers (CBRN, cybersecurity, replication) that trigger immediate, non-negotiable security increases and legal holds as models pass safety milestones.',
      footerLabel: 'RSP / Preparedness',
      icon: <Zap className="w-4 h-4" />,
      colorBorder: 'amber',
      colorBg: 'bg-amber-50',
      colorText: 'text-amber-600',
    },
    {
      level: 'L3',
      title: 'In-Model Embedding',
      description:
        'Governance directly coded into model weights and inference patterns. Instills direct systemic guardrails like Constitutional AI and Model Specifications.',
      footerLabel: 'Constitutional AI / Spec',
      icon: <Cpu className="w-4 h-4" />,
      colorBorder: 'purple',
      colorBg: 'bg-purple-50',
      colorText: 'text-purple-600',
    },
    {
      level: 'L4',
      title: 'Human Circuit-Breaker',
      description:
        'Definitive veto power. Ensures developers, trust boards, and legal reviewers maintain complete manual override of development and distribution pipelines.',
      footerLabel: 'LTBT / Board Mission Control',
      icon: <Power className="w-4 h-4" />,
      colorBorder: 'emerald',
      colorBg: 'bg-emerald-50',
      colorText: 'text-emerald-600',
    },
  ];

  return (
    <section id="synthesis" className="scroll-mt-24 mb-24 relative px-4">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t.governance.stackTitle}
        </h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          {t.governance.stackSubtitle}
        </p>
      </div>

      {/* Stack Flow Grid */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 relative">
        {layers.map((layer, index) => {
          return (
            <React.Fragment key={layer.level}>
              {/* Layer Card */}
              <div className="flex-1">
                <StackLayer {...layer} />
              </div>

              {/* Connecting Arrows */}
              {index < layers.length - 1 && (
                <div className="flex items-center justify-center text-slate-300 lg:self-center">
                  {/* Desktop chevron right */}
                  <ArrowRight className="hidden lg:block w-6 h-6 animate-pulse" />
                  {/* Mobile chevron down */}
                  <ArrowDown className="lg:hidden w-6 h-6 my-2 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
export default GovernanceStack;
