import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

/* ───────────────────── Code Block with Copy ───────────────────── */
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700/50">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code body */}
      <pre className="bg-[#0d1117] text-[#e6edf3] p-5 overflow-x-auto text-sm leading-relaxed font-mono scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* ───────────────────── Sidebar ───────────────────── */
const Sidebar = ({
  mainTitle,
  description,
  navItems,
  selectedTopicIndex,
  onSelectTopic,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-2xl lg:shadow-none lg:h-screen overflow-hidden`}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
                Docs
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">
            {mainTitle}
          </h2>
          {description && (
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          {navItems.map((item, index) => {
            const isActive = index === selectedTopicIndex;
            return (
              <button
                key={index}
                onClick={() => onSelectTopic(index)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-purple-600/20 text-purple-300 border-l-2 border-purple-400"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isActive
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="truncate">{item.navTitle}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="text-[10px] text-slate-500 text-center">
            AI-Generated Documentation
          </div>
        </div>
      </aside>
    </>
  );
};

/* ───────────────────── Mobile Header ───────────────────── */
const MobileHeader = ({ onBack, onOpenSidebar, mainTitle }) => (
  <header className="lg:hidden sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
    <button
      onClick={onBack}
      className="text-slate-600 p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <ArrowLeft size={20} />
    </button>
    <h2 className="text-sm font-bold text-slate-800 truncate max-w-[60%]">
      {mainTitle}
    </h2>
    <button
      onClick={onOpenSidebar}
      className="text-slate-600 p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <Menu size={20} />
    </button>
  </header>
);

/* ─────────────────── Section Pill ──────────────────── */
const SectionPill = ({ icon: Icon, label, color }) => (
  <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${color} mb-3`}>
    <Icon size={14} />
    {label}
  </div>
);

/* ───────────────────── Content Display ───────────────────── */
const ContentDisplay = ({ content, sectionIndex, totalSections, onPrev, onNext }) => {
  if (!content) {
    return (
      <main className="flex-1 flex items-center justify-center p-12">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 mb-2">
            No Content Available
          </h2>
          <p className="text-slate-500">
            Please go back and generate documentation first.
          </p>
        </div>
      </main>
    );
  }

  const {
    contentTitle,
    overview,
    syntax,
    parameters,
    codeExample,
    codeLanguage,
    explanation,
    commonMistakes,
    bestPractices,
  } = content;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-10 md:px-10 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <span>Docs</span>
          <ChevronRight size={12} />
          <span className="text-slate-600 font-medium">{contentTitle}</span>
          <span className="ml-auto text-slate-400 tabular-nums">
            {sectionIndex + 1} / {totalSections}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
          {contentTitle}
        </h1>

        {/* Overview */}
        {overview && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8">
            <p className="text-slate-700 leading-relaxed text-[15px]">
              {overview}
            </p>
          </div>
        )}

        {/* Syntax */}
        {syntax && (
          <section className="mb-8">
            <SectionPill icon={Code2} label="Syntax" color="text-blue-600" />
            <CodeBlock code={syntax} language={codeLanguage} />
          </section>
        )}

        {/* Parameters */}
        {parameters && parameters.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Parameters</h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-purple-700 font-medium whitespace-nowrap">
                        {param.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Code Example */}
        {codeExample && (
          <section className="mb-8">
            <SectionPill icon={Code2} label="Example" color="text-emerald-600" />
            <CodeBlock code={codeExample} language={codeLanguage} />
          </section>
        )}

        {/* Explanation */}
        {explanation && (
          <section className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-3">
              How It Works
            </h3>
            <div className="text-slate-600 leading-relaxed text-[15px] space-y-3">
              {explanation.split("\n").filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes */}
        {commonMistakes && commonMistakes.length > 0 && (
          <section className="mb-8">
            <SectionPill
              icon={AlertTriangle}
              label="Common Mistakes"
              color="text-amber-600"
            />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2.5">
              {commonMistakes.map((mistake, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <AlertTriangle
                    size={15}
                    className="text-amber-500 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-amber-900">{mistake}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Best Practices */}
        {bestPractices && bestPractices.length > 0 && (
          <section className="mb-8">
            <SectionPill
              icon={CheckCircle2}
              label="Best Practices"
              color="text-emerald-600"
            />
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2.5">
              {bestPractices.map((practice, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={15}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-emerald-900">{practice}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-200">
          <button
            onClick={onPrev}
            disabled={sectionIndex === 0}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm hover:bg-slate-50 hover:shadow transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={sectionIndex === totalSections - 1}
            className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
};

/* ───────────────────── Main Wmiro Component ───────────────────── */
export default function Wmiro() {
  const location = useLocation();
  const navigate = useNavigate();

  const { content: contentData, topic, format } = location.state || {};

  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Build display data from API response
  const docsData = useMemo(() => {
    if (contentData && contentData.navItems && contentData.content) {
      return {
        mainTitle: contentData.mainTitle || topic || "Documentation",
        description: contentData.description || "",
        navItems: contentData.navItems,
        content: contentData.content.map((item) => ({
          contentTitle: item.contentTitle || "Untitled",
          overview: item.overview || "",
          syntax: item.syntax || "",
          parameters: Array.isArray(item.parameters) ? item.parameters : [],
          codeExample: item.codeExample || item.codeExamples || "",
          codeLanguage: item.codeLanguage || "javascript",
          explanation: item.explanation || "",
          commonMistakes: Array.isArray(item.commonMistakes) ? item.commonMistakes : [],
          bestPractices: Array.isArray(item.bestPractices) ? item.bestPractices : [],
        })),
      };
    }

    // Fallback if navigated without data
    return {
      mainTitle: topic || "Documentation",
      description: "No content loaded.",
      navItems: [{ navTitle: "Getting Started" }],
      content: [
        {
          contentTitle: "Getting Started",
          overview: "No documentation has been generated yet. Please go back and generate content first.",
          syntax: "",
          parameters: [],
          codeExample: "",
          codeLanguage: "javascript",
          explanation: "",
          commonMistakes: [],
          bestPractices: [],
        },
      ],
    };
  }, [contentData, topic]);

  const currentContent = docsData.content[selectedTopicIndex] || null;

  const handleSelectTopic = (index) => {
    setSelectedTopicIndex(index);
    setIsSidebarOpen(false);
  };

  const handlePrev = () => {
    if (selectedTopicIndex > 0) setSelectedTopicIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (selectedTopicIndex < docsData.content.length - 1)
      setSelectedTopicIndex((i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col lg:flex-row">
      {/* Desktop back button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden lg:flex fixed top-4 left-[300px] z-50 items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600 font-medium px-3 py-2 rounded-lg hover:bg-purple-50 transition-all"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <Sidebar
        mainTitle={docsData.mainTitle}
        description={docsData.description}
        navItems={docsData.navItems}
        selectedTopicIndex={selectedTopicIndex}
        onSelectTopic={handleSelectTopic}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader
          onBack={() => navigate(-1)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          mainTitle={docsData.mainTitle}
        />
        <ContentDisplay
          content={currentContent}
          sectionIndex={selectedTopicIndex}
          totalSections={docsData.content.length}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}