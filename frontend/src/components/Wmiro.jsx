import React from "react";
import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Sidebar Component ---
const Sidebar = ({
  navItems,
  selectedTopicIndex,
  onSelectTopic,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-400 via-purple-300 to-purple-400 p-6 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 rounded-r-2xl lg:rounded-none shadow-2xl lg:shadow-none`}
      >
        <nav className="mt-10 flex-1">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = index === selectedTopicIndex;
              return (
                <li key={index}>
                  <button
                    onClick={() => onSelectTopic(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.navTitle}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

// --- Mobile Header ---
const MobileHeader = ({ onBack, onOpenSidebar, mainTitle }) => {
  return (
    <header className="lg:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between">
      <button
        onClick={onBack}
        className="text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-lg font-semibold text-purple-700">{mainTitle}</h2>
      <button
        onClick={onOpenSidebar}
        className="text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
};

// --- Content Display with Navigation Buttons ---
const ContentDisplay = ({
  content,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}) => {
  if (!content) {
    return (
      <main className="flex-1 p-8 md:p-12 lg:p-20 relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-purple-700 mb-6">
            Content Not Available
          </h1>
          <p className="text-lg text-gray-600">No content found for this topic.</p>
        </div>
      </main>
    );
  }

  // Combine explanation and code examples
  const fullContent = `${content.explanation}\n\n${content.codeExamples}`;
  const parts = fullContent.split(/`([^`]+)`/g);

  return (
    <main className="flex-1 p-8 md:p-12 lg:p-20 relative">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-bold text-purple-700 mb-6">
          {content.contentTitle}
        </h1>

        <div className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-20 space-y-4">
          {parts.map((part, index) =>
            index % 2 === 1 ? (
              <pre
                key={index}
                className="bg-gray-900 text-purple-100 font-mono p-4 rounded-lg overflow-x-auto shadow-md text-sm md:text-base"
              >
                <code>{part}</code>
              </pre>
            ) : (
              <p key={index} className="whitespace-pre-line">{part}</p>
            )
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-x-0 bottom-10 flex justify-between px-6 md:px-16">
        <button
          onClick={onPrev}
          disabled={disablePrev}
          className={`flex items-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={disableNext}
          className={`flex items-center gap-2 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </main>
  );
};

// --- Main App ---
export default function Wmiro() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state
  const { content: contentData, topic, format } = location.state || {};
  
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use dynamic data or fallback to mock data
  const dynamicData = useMemo(() => {
    if (contentData && contentData.navItems && contentData.content) {
      return {
        mainTitle: contentData.mainTitle || topic || "JavaScript Tutorial",
        navItems: contentData.navItems,
        content: contentData.content
      };
    }
    
    // Fallback mock data if no dynamic data is provided
    return {
      mainTitle: topic || "JavaScript Tutorial",
      navItems: [
        { navTitle: "Introduction" },
        { navTitle: "Syntax" },
        { navTitle: "Variables" },
        { navTitle: "Data Types" },
        { navTitle: "Operators" },
        { navTitle: "Functions" },
        { navTitle: "Objects" },
        { navTitle: "Arrays" },
        { navTitle: "Loops" },
        { navTitle: "Conditionals" },
        { navTitle: "Events" },
        { navTitle: "DOM Manipulation" }
      ],
      content: [
        {
          contentTitle: "Introduction",
          explanation: "No content available. Please go back and generate content first.",
          codeExamples: ""
        }
      ]
    };
  }, [contentData, topic]);

  const currentContent = useMemo(() => 
    dynamicData.content[selectedTopicIndex], 
    [dynamicData.content, selectedTopicIndex]
  );

  const handleSelectTopic = (index) => {
    setSelectedTopicIndex(index);
    setIsSidebarOpen(false);
  };

  const handlePrev = () => {
    if (selectedTopicIndex > 0) setSelectedTopicIndex(selectedTopicIndex - 1);
  };

  const handleNext = () => {
    if (selectedTopicIndex < dynamicData.content.length - 1) 
      setSelectedTopicIndex(selectedTopicIndex + 1);
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col lg:flex-row relative">
      <button
        onClick={handleBack}
        className="hidden lg:block absolute top-6 left-6 z-50 text-purple-600 p-2 rounded-full hover:bg-purple-100 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <Sidebar
        navItems={dynamicData.navItems}
        selectedTopicIndex={selectedTopicIndex}
        onSelectTopic={handleSelectTopic}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader
          onBack={handleBack}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          mainTitle={dynamicData.mainTitle}
        />
        <ContentDisplay
          content={currentContent}
          onPrev={handlePrev}
          onNext={handleNext}
          disablePrev={selectedTopicIndex === 0}
          disableNext={selectedTopicIndex === dynamicData.content.length - 1}
        />
      </div>
    </div>
  );
}