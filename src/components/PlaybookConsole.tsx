import { useState, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, CheckSquare, ChevronDown, ChevronUp, AlertCircle, FileText } from 'lucide-react';
import { globalChecklist, vnChecklist } from '../data/governanceData';

export const PlaybookConsole = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'vn'>('global');

  // Interactive state for checklists
  const [globalChecked, setGlobalChecked] = useState<Record<string, boolean>>({});
  const [vnChecked, setVnChecked] = useState<Record<string, boolean>>({});

  // Interactive state for gates
  const [globalGates, setGlobalGates] = useState<Record<string, boolean>>({
    safety: false,
    oversight: false,
    transparency: false,
  });
  const [vnGates, setVnGates] = useState<Record<string, boolean>>({
    risk: false,
    watermark: false,
    rep: false,
  });

  // Keep track of which phases are expanded in mobile/accordion view
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    '01': true, // Keep first phase open by default
  });

  const togglePhase = (phaseNumber: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber],
    }));
  };

  // Toggle checks helper
  const handleCheck = (id: string, tab: 'global' | 'vn') => {
    if (tab === 'global') {
      setGlobalChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    } else {
      setVnChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  // Toggle gates helper
  const handleGateCheck = (gateKey: string, tab: 'global' | 'vn') => {
    if (tab === 'global') {
      setGlobalGates((prev) => ({ ...prev, [gateKey]: !prev[gateKey] }));
    } else {
      setVnGates((prev) => ({ ...prev, [gateKey]: !prev[gateKey] }));
    }
  };

  // Calculate totals and statistics
  const stats = useMemo(() => {
    if (activeTab === 'global') {
      const totalTasks = globalChecklist.reduce((acc, phase) => acc + phase.items.length, 0);
      const checkedTasks = Object.values(globalChecked).filter(Boolean).length;
      const gatesChecked = Object.values(globalGates).every(Boolean);
      const isBlocked = checkedTasks < totalTasks || !gatesChecked;
      const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

      // Unresolved items for debug log
      const missingTasksCount = totalTasks - checkedTasks;
      const missingGates: string[] = [];
      if (!globalGates.safety) missingGates.push('Safety Gate');
      if (!globalGates.oversight) missingGates.push('Oversight Gate');
      if (!globalGates.transparency) missingGates.push('Transparency Gate');

      return {
        totalTasks,
        checkedTasks,
        gatesChecked,
        isBlocked,
        percentage,
        missingTasksCount,
        missingGates,
      };
    } else {
      const totalTasks = vnChecklist.reduce((acc, phase) => acc + phase.items.length, 0);
      const checkedTasks = Object.values(vnChecked).filter(Boolean).length;
      const gatesChecked = Object.values(vnGates).every(Boolean);
      const isBlocked = checkedTasks < totalTasks || !gatesChecked;
      const percentage = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

      // Unresolved items for debug log
      const missingTasksCount = totalTasks - checkedTasks;
      const missingGates: string[] = [];
      if (!vnGates.risk) missingGates.push('Khai báo Phân tầng Rủi ro');
      if (!vnGates.watermark) missingGates.push('Cơ chế kỹ thuật gán nhãn AI (Watermark)');
      if (!vnGates.rep) missingGates.push('Người đại diện Pháp lý chính thức');

      return {
        totalTasks,
        checkedTasks,
        gatesChecked,
        isBlocked,
        percentage,
        missingTasksCount,
        missingGates,
      };
    }
  }, [activeTab, globalChecked, vnChecked, globalGates, vnGates]);

  const currentChecklist = activeTab === 'global' ? globalChecklist : vnChecklist;

  return (
    <section id="playbook" className="scroll-mt-24 mb-24 px-4">
      {/* Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span className="w-2.5 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full inline-block"></span>
            <span>Interactive AI Playbook Command Center</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Translate theory into actionable compliance. Check off requirements to run localized gatekeeper analysis.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'global' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Global Enterprise Playbook
          </button>
          <button
            onClick={() => setActiveTab('vn')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              activeTab === 'vn' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Bản đồ Tuân thủ VN (Vietnam AI Act)
          </button>
        </div>
      </div>

      {/* Console Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left/Center Panel: Progress Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between lg:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'global' ? 'System Deployment Status' : 'Trạng Thái Kiểm Định Cấp Phép AI (VN)'}
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                  stats.isBlocked
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    stats.isBlocked ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'
                  }`}
                ></span>
                {stats.isBlocked
                  ? activeTab === 'global'
                    ? 'STAGE-GATE BLOCKED'
                    : 'CHƯA ĐỦ ĐIỀU KIỆN'
                  : activeTab === 'global'
                  ? 'DEPLOYMENT READY'
                  : 'ĐỦ ĐIỀU KIỆN LƯU HÀNH'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {activeTab === 'global'
                ? 'Complete all 18 checklist actions across 6 development phases and obtain affirmative sign-off on the final Gatekeeper criteria to safely enable production release permissions.'
                : 'Hoàn thành đầy đủ 17 nội dung kiểm tra thuộc 5 giai đoạn vòng đời phát triển và phê duyệt 3 chốt chặn bắt buộc trước khi chính thức lưu hành sản phẩm AI tại Việt Nam.'}
            </p>
          </div>

          {/* Sticky/Responsive Progress Trackers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>{activeTab === 'global' ? 'Verification Tasks:' : 'Tiến độ Đánh giá:'}</span>
                <span className="font-bold text-slate-900">{stats.checkedTasks}</span> / <span>{stats.totalTasks}</span>
              </span>
              <span className="font-bold text-emerald-600">{stats.percentage}% Complete</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Executive Gates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>{activeTab === 'global' ? 'Final Executive Sign-Off' : 'Chốt Chặn Kiểm Duyệt Cuối'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {activeTab === 'global'
                ? 'The final binary checkpoints before production package deployment.'
                : 'Các nút thắt điều kiện bắt buộc trước khi được đóng gói phát hành.'}
            </p>

            {/* Dynamic switcher for gates */}
            {activeTab === 'global' ? (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.safety}
                    onChange={() => handleGateCheck('safety', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">1. Safety Gate</span>
                    <span className="text-[10px] text-slate-500 block">
                      Have all "Red-Line" quantitative metrics passed?
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.oversight}
                    onChange={() => handleGateCheck('oversight', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">2. Oversight Gate</span>
                    <span className="text-[10px] text-slate-500 block">
                      Is a human escalation path active for forbidden intents?
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={globalGates.transparency}
                    onChange={() => handleGateCheck('transparency', 'global')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">3. Transparency Gate</span>
                    <span className="text-[10px] text-slate-500 block">Is the system specification public?</span>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.risk}
                    onChange={() => handleGateCheck('risk', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">1. Khai báo Phân tầng Rủi ro</span>
                    <span className="text-[10px] text-slate-500 block">
                      Hệ thống đã được xác định nhóm rủi ro cụ thể?
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.watermark}
                    onChange={() => handleGateCheck('watermark', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">2. Tích hợp gán nhãn AI</span>
                    <span className="text-[10px] text-slate-500 block">
                      Đã nhúng dấu nhận diện sản phẩm do AI tạo ra?
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition select-none">
                  <input
                    type="checkbox"
                    checked={vnGates.rep}
                    onChange={() => handleGateCheck('rep', 'vn')}
                    className="w-4 h-4 rounded mt-0.5 text-indigo-600 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">3. Ủy quyền Đại diện Pháp lý</span>
                    <span className="text-[10px] text-slate-500 block">Đã chỉ định pháp nhân chịu trách nhiệm chính?</span>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic System Instruction Logs */}
      <div
        className={`p-4 rounded-xl border text-xs flex items-start gap-3 mb-8 transition duration-300 shadow-xs ${
          stats.isBlocked
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}
      >
        {stats.isBlocked ? (
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        )}
        <div className="space-y-1">
          <span className="font-bold block uppercase tracking-wide">
            {activeTab === 'global' ? 'Deployment Pipeline Message' : 'Nhật ký Hệ thống Cấp phép'}
          </span>
          <div className="text-slate-700 leading-relaxed">
            {stats.isBlocked ? (
              activeTab === 'global' ? (
                <>
                  Deployment blocked. System requires:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 font-medium">
                    {stats.missingTasksCount > 0 && (
                      <li>Complete remaining compliance checklist tasks ({stats.missingTasksCount} left)</li>
                    )}
                    {stats.missingGates.map((gate) => (
                      <li key={gate}>Approve final "{gate}" sign-off</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  Ứng dụng AI chưa đủ điều kiện lưu hành. Các điểm còn thiếu:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 font-medium">
                    {stats.missingTasksCount > 0 && (
                      <li>Chưa hoàn tất checklist tuân thủ (thiếu {stats.missingTasksCount} điểm đánh giá)</li>
                    )}
                    {stats.missingGates.map((gate) => (
                      <li key={gate}>Thiếu xác nhận: {gate}</li>
                    ))}
                  </ul>
                  Vui lòng hoàn tất trước khi đưa hệ thống vào vận hành thực tế.
                </>
              )
            ) : activeTab === 'global' ? (
              'Deployment authorized. Sandbox pipeline has compiled successfully. The compliance gatekeeper has verified all normative foundations, escalatory risk policies, and human veto path activations.'
            ) : (
              'Hệ thống đủ điều kiện vận hành. Giấy phép lưu hành AI đã được phê duyệt. Cơ chế kỹ thuật gán nhãn, phân loại rủi ro và đầu mối đại diện pháp lý đã được ghi nhận thành công.'
            )}
          </div>
        </div>
      </div>

      {/* Accordion / Responsive Checklist Grid */}
      <div className="space-y-4">
        {currentChecklist.map((phase) => {
          const isExpanded = !!expandedPhases[phase.phaseNumber];
          const phaseCheckedCount = phase.items.filter((item) =>
            activeTab === 'global' ? globalChecked[item.id] : vnChecked[item.id]
          ).length;
          const isPhaseComplete = phaseCheckedCount === phase.items.length;

          return (
            <div
              key={phase.phaseNumber}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition duration-150"
            >
              {/* Accordion Header */}
              <button
                onClick={() => togglePhase(phase.phaseNumber)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border text-${phase.colorClass}-600 bg-${phase.colorClass}-50/30 border-${phase.colorClass}-100`}>
                    Phase {phase.phaseNumber}: {phase.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{phase.phaseName}</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                      isPhaseComplete
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {phaseCheckedCount}/{phase.items.length} {activeTab === 'global' ? 'Done' : 'Đạt'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/20 divide-y divide-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {phase.items.map((item) => {
                      const isChecked = activeTab === 'global' ? !!globalChecked[item.id] : !!vnChecked[item.id];
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                            isChecked
                              ? 'border-emerald-200 bg-emerald-50/10'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheck(item.id, activeTab)}
                            className="w-4 h-4 rounded mt-0.5 text-emerald-500 bg-white border-slate-300 focus:ring-0 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className={`font-bold block transition-all ${isChecked ? 'text-slate-800 line-through decoration-slate-400/80' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                              {item.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vietnam Act specific Explanation */}
      {activeTab === 'vn' && (
        <div className="mt-16 bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs animate-in fade-in duration-300">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl relative z-10">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Giải Trình Cơ Sở Pháp Lý AI Tại Việt Nam</span>
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Môi trường pháp lý cho Trí tuệ nhân tạo (AI) tại Việt Nam đang tiến hành hoàn thiện nhanh chóng với các cột
              mốc lập pháp vững chắc, hướng tới sự cân bằng giữa phát triển công nghệ đột phá và bảo vệ người dùng cuối.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-indigo-600 font-extrabold text-sm sm:text-base">Luật CN Công Nghệ Số</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Có hiệu lực từ 01/01/2026, đặt nền móng 07 nguyên tắc lớn định hình định hướng quốc gia.
                </p>
              </div>
              <div>
                <div className="text-emerald-600 font-extrabold text-sm sm:text-base">Luật Trí Tuệ Nhân Tạo</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Luật số 134/2025/QH15, có hiệu lực từ 01/03/2026. Đạo luật chuyên ngành đầu tiên điều phối ứng dụng thực
                  tiễn.
                </p>
              </div>
              <div>
                <div className="text-amber-600 font-extrabold text-sm sm:text-base">Nghị định 142/2026/NĐ-CP</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Bắt đầu từ 01/05/2026, cung cấp hướng dẫn thi hành chi tiết và quy chế giám định hệ thống rủi ro cao.
                </p>
              </div>
              <div>
                <div className="text-purple-600 font-extrabold text-sm sm:text-base">Khung Đạo Đức Quốc Gia</div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Đồng áp dụng từ 01/03/2026 để điều chỉnh nhân văn hóa thuật toán thông minh.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default PlaybookConsole;
