import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    Background,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Clock, Download, Share2, ChevronDown, Bot, Code, Database, Layers3, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScheduleModal from './ScheduleModal';
import axios from 'axios';

// --- MOCK DATA STORE (Simulating AI Generation) ---


// In a real application, this would come from an API call to your AI backend.
const roadmapData = {
    "Frontend Developer": {
        "title": "Modern Frontend Engineer Roadmap",
        "progress": 0,
        "nodes": [
            // STAGE 1: FUNDAMENTALS
            { "id": "stage-1", "type": "custom", "position": { "x": 0, "y": 0 }, "data": { "label": "Stage 1: Internet & Fundamentals" } },
            { "id": "fa-1-1", "type": "custom", "position": { "x": 250, "y": -50 }, "data": { "label": "Internet Mechanics", "topics": ["HTTP/HTTPS & SSL", "DNS & How Browsers Work", "Browsers Engines (V8, WebKit)", "IP Addresses & Hosting"] } },
            { "id": "fa-1-2", "type": "custom", "position": { "x": 250, "y": 50 }, "data": { "label": "Terminal & Version Control", "topics": ["Bash/Zsh Commands", "Git Workflow (Branching, Merging)", "SSH Keys", "GitHub/GitLab Actions Basics"] } },

            // STAGE 2: STRUCTURE & STYLE
            { "id": "stage-2", "type": "custom", "position": { "x": 0, "y": 250 }, "data": { "label": "Stage 2: HTML & CSS Mastery" } },
            { "id": "fa-2-1", "type": "custom", "position": { "x": 250, "y": 200 }, "data": { "label": "Semantic & Accessible Web", "topics": ["HTML5 Semantic Tags", "WCAG Guidelines", "ARIA Attributes", "SEO Fundamentals"] } },
            { "id": "fa-2-2", "type": "custom", "position": { "x": 250, "y": 300 }, "data": { "label": "Modern CSS Layouts", "topics": ["Flexbox & CSS Grid", "Responsive Design (Clamp, Container Queries)", "CSS Variables", "Sass/SCSS Preprocessors"] } },

            // STAGE 3: JAVASCRIPT & ECOSYSTEM
            { "id": "stage-3", "type": "custom", "position": { "x": 0, "y": 500 }, "data": { "label": "Stage 3: Advanced JavaScript" } },
            { "id": "fa-3-1", "type": "custom", "position": { "x": 250, "y": 500 }, "data": { "label": "JS Deep Dive", "topics": ["ES6+ Syntax", "Closures & Prototypes", "Asynchronous JS (Promises, Async/Await)", "Fetch API & Axios"] } },
            { "id": "fa-3-2", "type": "custom", "position": { "x": 500, "y": 500 }, "data": { "label": "Build Tools & NPM", "topics": ["NPM/PNPM/Yarn", "Vite & Webpack", "ESLint & Prettier"] } },

            // STAGE 4: FRAMEWORKS
            { "id": "stage-4", "type": "custom", "position": { "x": 0, "y": 700 }, "data": { "label": "Stage 4: React & State Management" } },
            { "id": "fa-4-1", "type": "custom", "position": { "x": 250, "y": 700 }, "data": { "label": "React Core", "topics": ["Hooks (useState, useEffect, useMemo)", "Component Lifecycle", "Virtual DOM", "Context API"] } },
            { "id": "fa-4-2", "type": "custom", "position": { "x": 500, "y": 700 }, "data": { "label": "State & Routing", "topics": ["TanStack Query (React Query)", "Redux Toolkit or Zustand", "React Router v6"] } }
        ],
        "edges": [
            { "id": "e1-11", "source": "stage-1", "target": "fa-1-1", "animated": true },
            { "id": "e1-12", "source": "stage-1", "target": "fa-1-2", "animated": true },
            { "id": "e1-2", "source": "fa-1-1", "target": "stage-2" },
            { "id": "e2-21", "source": "stage-2", "target": "fa-2-1", "animated": true },
            { "id": "e2-22", "source": "stage-2", "target": "fa-2-2", "animated": true },
            { "id": "e2-3", "source": "fa-2-2", "target": "stage-3" },
            { "id": "e3-31", "source": "stage-3", "target": "fa-3-1", "animated": true },
            { "id": "e31-32", "source": "fa-3-1", "target": "fa-3-2", "animated": true },
            { "id": "e3-4", "source": "fa-3-2", "target": "stage-4" },
            { "id": "e4-41", "source": "stage-4", "target": "fa-4-1", "animated": true },
            { "id": "e41-42", "source": "fa-4-1", "target": "fa-4-2", "animated": true }
        ],
        "faqs": [
            { "q": "Why learn TypeScript?", "a": "TypeScript adds static typing to JS, catching errors during development rather than at runtime, making it essential for large-scale enterprise apps." }
        ]
    },

    "Backend Developer": {
        "title": "Scalable Systems Backend Roadmap",
        "progress": 30,
        "nodes": [
            { "id": "b1", "type": "custom", "position": { "x": 0, "y": 0 }, "data": { "label": "Languages & Runtimes" } },
            { "id": "b1-1", "type": "custom", "position": { "x": 250, "y": -50 }, "data": { "label": "Node.js (Express/NestJS)", "topics": ["Event Loop", "Streams", "Middleware", "JWT Auth"] } },
            { "id": "b1-2", "type": "custom", "position": { "x": 250, "y": 50 }, "data": { "label": "Go (Golang)", "topics": ["Goroutines", "Channels", "Standard Library", "Microservices"] } },

            { "id": "b2", "type": "custom", "position": { "x": 0, "y": 200 }, "data": { "label": "Database Management" } },
            { "id": "b2-1", "type": "custom", "position": { "x": -200, "y": 300 }, "data": { "label": "Relational (PostgreSQL)", "topics": ["ACID Transactions", "Indexing & Optimization", "Complex Joins", "Normalization"] } },
            { "id": "b2-2", "type": "custom", "position": { "x": 200, "y": 300 }, "data": { "label": "NoSQL (MongoDB/Redis)", "topics": ["Document Store", "Caching Strategies", "Pub/Sub with Redis"] } },

            { "id": "b3", "type": "custom", "position": { "x": 0, "y": 450 }, "data": { "label": "API Architecture" } },
            { "id": "b3-1", "type": "custom", "position": { "x": 250, "y": 450 }, "data": { "label": "Communication", "topics": ["RESTful APIs", "GraphQL", "gRPC", "WebSockets"] } },

            { "id": "b4", "type": "custom", "position": { "x": 0, "y": 600 }, "data": { "label": "DevOps & Cloud" } },
            { "id": "b4-1", "type": "custom", "position": { "x": 250, "y": 600 }, "data": { "label": "Deployment", "topics": ["Docker & Containerization", "Kubernetes Basics", "AWS (S3, EC2, Lambda)", "CI/CD Pipelines"] } }
        ],
        "edges": [
            { "id": "eb1-11", "source": "b1", "target": "b1-1" },
            { "id": "eb1-12", "source": "b1", "target": "b1-2" },
            { "id": "eb1-2", "source": "b1", "target": "b2" },
            { "id": "eb2-21", "source": "b2", "target": "b2-1" },
            { "id": "eb2-22", "source": "b2", "target": "b2-2" },
            { "id": "eb2-3", "source": "b2", "target": "b3" },
            { "id": "eb3-31", "source": "b3", "target": "b3-1" },
            { "id": "eb3-4", "source": "b3", "target": "b4" },
            { "id": "eb4-41", "source": "b4", "target": "b4-1" }
        ],
        "faqs": [
            { "q": "SQL vs NoSQL?", "a": "SQL is best for structured data and complex relationships. NoSQL is better for rapid scaling, unstructured data, and high-speed read/writes." }
        ]
    },

    "AI Engineer": {
        "title": "AI & Machine Learning Roadmap",
        "progress": 5,
        "nodes": [
            { "id": "a1", "type": "custom", "position": { "x": 0, "y": 0 }, "data": { "label": "Mathematics Foundations" } },
            { "id": "a1-1", "type": "custom", "position": { "x": 250, "y": 0 }, "data": { "label": "Core Math", "topics": ["Linear Algebra", "Calculus (Derivatives)", "Probability & Statistics"] } },

            { "id": "a2", "type": "custom", "position": { "x": 0, "y": 150 }, "data": { "label": "Data Processing" } },
            { "id": "a2-1", "type": "custom", "position": { "x": 250, "y": 150 }, "data": { "label": "Python Libraries", "topics": ["NumPy & Pandas", "Matplotlib/Seaborn", "Scikit-Learn"] } },

            { "id": "a3", "type": "custom", "position": { "x": 0, "y": 300 }, "data": { "label": "Deep Learning" } },
            { "id": "a3-1", "type": "custom", "position": { "x": 250, "y": 300 }, "data": { "label": "Neural Networks", "topics": ["CNNs (Computer Vision)", "RNNs & LSTMs", "Transformers (LLMs)"] } },
            { "id": "a3-2", "type": "custom", "position": { "x": 500, "y": 300 }, "data": { "label": "Frameworks", "topics": ["PyTorch", "TensorFlow", "HuggingFace"] } },

            { "id": "a4", "type": "custom", "position": { "x": 0, "y": 450 }, "data": { "label": "Modern AI (LLMs)" } },
            { "id": "a4-1", "type": "custom", "position": { "x": 250, "y": 450 }, "data": { "label": "Applied AI", "topics": ["Prompt Engineering", "RAG (Retrieval Augmented Gen)", "Vector Databases (Pinecone/Milvus)"] } }
        ],
        "edges": [
            { "id": "ea1-11", "source": "a1", "target": "a1-1" },
            { "id": "ea1-2", "source": "a1", "target": "a2" },
            { "id": "ea2-21", "source": "a2", "target": "a2-1" },
            { "id": "ea2-3", "source": "a2", "target": "a3" },
            { "id": "ea3-31", "source": "a3", "target": "a3-1" },
            { "id": "ea31-32", "source": "a3-1", "target": "a3-2" },
            { "id": "ea3-4", "source": "a3", "target": "a4" },
            { "id": "ea4-41", "source": "a4", "target": "a4-1" }
        ],
        "faqs": [
            { "q": "What is RAG?", "a": "RAG connects an LLM to external private data, allowing the AI to answer questions based on your specific documents without retraining." }
        ]
    },

    "Fullstack Developer": {
        "title": "Fullstack Product Engineer Roadmap",
        "progress": 0,
        "nodes": [
            { "id": "f1", "type": "custom", "position": { "x": 0, "y": 100 }, "data": { "label": "The T-Shaped Skillset" } },
            { "id": "f2", "type": "custom", "position": { "x": 250, "y": 0 }, "data": { "label": "Frontend (React/Next.js)", "topics": ["Server Components", "SSR/SSG", "Client-side Interaction"] } },
            { "id": "f3", "type": "custom", "position": { "x": 250, "y": 200 }, "data": { "label": "Backend (Node/Python)", "topics": ["Authentication (Auth.js/Clerk)", "API Design", "Serverless Functions"] } },
            { "id": "f4", "type": "custom", "position": { "x": 500, "y": 100 }, "data": { "label": "The Bridge (DevOps)", "topics": ["Docker", "Vercel/AWS Deployment", "Database Migrations (Prisma/Drizzle)"] } }
        ],
        "edges": [
            { "id": "ef1-2", "source": "f1", "target": "f2", "animated": true },
            { "id": "ef1-3", "source": "f1", "target": "f3", "animated": true },
            { "id": "ef2-4", "source": "f2", "target": "f4" },
            { "id": "ef3-4", "source": "f3", "target": "f4" }
        ],
        "faqs": [
            { "q": "What is Next.js?", "a": "Next.js is the leading Fullstack React framework that handles both the frontend UI and the backend API routes in a single project." }
        ]
    }
};

const relatedCareers = [
    { name: "Backend Developer", steps: "95 steps", time: "8 months", icon: <Database className="w-6 h-6 text-emerald-500" />, color: "bg-emerald-100" },
    { name: "Fullstack Developer", steps: "148 steps", time: "12 months", icon: <Layers3 className="w-6 h-6 text-purple-500" />, color: "bg-purple-100" },
    { name: "AI Engineer", steps: "120 steps", time: "10 months", icon: <Bot className="w-6 h-6 text-red-500" />, color: "bg-red-100" },
    { name: "Frontend Developer", steps: "115 steps", time: "8 months", icon: <Code className="w-6 h-6 text-blue-500" />, color: "bg-blue-100" },
];

// --- Custom Node for React Flow ---
const CustomNode = ({ data }) => {
    const isStage = data.label && (typeof data.label === 'string' ? data.label.startsWith('Stage') : false);

    // Helper to safely render label
    const renderLabel = (label) => {
        if (typeof label === 'string') return label;
        if (typeof label === 'object' && label?.name) return label.name;
        return 'Node';
    };

    // Helper to safely render a topic
    const renderTopic = (topic) => {
        if (typeof topic === 'string') return topic;
        if (typeof topic === 'object') {
            if (topic.name) return topic.name;
            if (topic.title) return topic.title;
            return JSON.stringify(topic).slice(0, 20) + '...';
        }
        return String(topic);
    };

    const topics = data.topics || data.subtopics || []; // Handle both keys if LLM varies
    const hasTopics = topics && topics.length > 0;

    return (
        <div className={`${isStage ? 'bg-purple-100 border-purple-400' : 'bg-[#fffbeb] border-yellow-400'} border-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm min-w-[200px] max-w-[300px]`}>
            <Handle type="target" position={Position.Left} className="bg-purple-500" />
            <div className="font-bold text-gray-800 mb-1">{renderLabel(data.label)}</div>
            {hasTopics && (
                <div className="text-xs text-gray-600 mt-2">
                    <div className="font-medium mb-1">Topics to learn:</div>
                    <ul className="list-disc list-inside space-y-1">
                        {topics.slice(0, 3).map((topic, index) => (
                            <li key={index} className="text-xs truncate">
                                {renderTopic(topic)}
                            </li>
                        ))}
                        {topics.length > 3 && (
                            <li className="text-xs text-gray-500">+{topics.length - 3} more...</li>
                        )}
                    </ul>
                </div>
            )}
            {data.prerequisites && data.prerequisites.length > 0 && (
                <div className="text-xs text-blue-600 mt-2">
                    <div className="font-medium">Prerequisites:</div>
                    <div>
                        {Array.isArray(data.prerequisites)
                            ? data.prerequisites.map(p => renderTopic(p)).join(', ')
                            : String(data.prerequisites)
                        }
                    </div>
                </div>
            )}
            <Handle type="source" position={Position.Right} className="bg-green-500" />
        </div>
    );
};

// Move nodeTypes OUTSIDE the component to avoid React Flow warning
const nodeTypes = { custom: CustomNode };

// --- Accordion Item Component for FAQs ---
const AccordionItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700"
            >
                {faq.q}
                <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-4 pt-0 text-gray-600">{faq.a}</p>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const RoadmapFlow = () => {
    const location = useLocation();
    // Try to get roadmap and selectedCareer from navigation state
    const roadmapFromState = location?.state?.roadmap;
    const selectedCareerFromState = location?.state?.selectedCareer;

    // Normalize function for static fallback
    const normalizeTitle = (title) => {
        if (!title) return undefined;
        const map = {
            'Full Stack Developer': 'Fullstack Developer',
            'Full-Stack Developer': 'Fullstack Developer',
            'Frontend': 'Frontend Developer',
            'Backend': 'Backend Developer',
        };
        return map[title] || title;
    };

    // If roadmap is passed from state, use it; otherwise fallback to static mock
    const [selectedCareer, setSelectedCareer] = useState(normalizeTitle(selectedCareerFromState) || "Frontend Developer");
    const [roadmap, setRoadmap] = useState(roadmapFromState || roadmapData[normalizeTitle(selectedCareerFromState) || "Frontend Developer"]);
    const [nodes, setNodes, onNodesChange] = useNodesState(roadmap?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(roadmap?.edges || []);
    const [faqs, setFaqs] = useState(roadmap?.faqs || []);
    const [progress, setProgress] = useState(roadmap?.progress || 0);
    const [title, setTitle] = useState(roadmap?.title || selectedCareer);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    
    const roadmapId = location?.state?.roadmapId;

    const handleScheduleLearning = async (preferences) => {
        setScheduleLoading(true);
        try {
            const response = await axios.post('https://careerflip.onrender.com/api/roadmap/schedule', {
                roadmapId: roadmapId,
                ...preferences
            }, { withCredentials: true });
            
            alert(response.data.message);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || "Failed to schedule. Ensure you are logged in with Google.";
            alert(msg);
        } finally {
            setScheduleLoading(false);
        }
    };

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/roadmap");
    };

    // Unified effect to handle roadmap updates
    useEffect(() => {
        const normalizedSelected = normalizeTitle(selectedCareer);
        const normalizedStateCareer = normalizeTitle(selectedCareerFromState);

        // Case 1: Use dynamic data from navigation ONLY if it matches the current selection
        // This ensures that if the user clicks a "Related Career" button later, we switch to that (static) data
        if (roadmapFromState && normalizedSelected === normalizedStateCareer) {
            console.log("Using dynamic roadmap data from navigation");

            let data = roadmapFromState;
            // Handle the wrapped object case (backend returns { "RoleName": { ... } })
            if (typeof data === 'object' && !data.nodes) {
                const keys = Object.keys(data);
                if (keys.length > 0) {
                    data = data[keys[0]];
                }
            }

            setRoadmap(data);
            setNodes(data.nodes || []);
            setEdges(data.edges || []);
            setFaqs(data.faqs || []);
            setProgress(data.progress || 0);
            setTitle(data.title || selectedCareer);
            return;
        }

        // Case 2: Fallback to static mock data
        console.log("Switching to static/mock data for:", normalizedSelected);
        const fallback = 'Frontend Developer';
        // Check if we have mock data for this career, otherwise default to Frontend
        const key = roadmapData[normalizedSelected] ? normalizedSelected : fallback;
        const newRoadmap = roadmapData[key];

        setRoadmap(newRoadmap);
        setNodes(newRoadmap.nodes || []);
        setEdges(newRoadmap.edges || []);
        setFaqs(newRoadmap.faqs || []);
        setProgress(newRoadmap.progress || 0);
        setTitle(newRoadmap.title || normalizedSelected);

    }, [selectedCareer, roadmapFromState, selectedCareerFromState, setNodes, setEdges]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={handleRedirect}
                    className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-600 hover:text-gray-800 transition"
                >
                    <ArrowLeft size={16} />
                    Go Back
                </button>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {progress}% of {nodes.length} steps completed
                                {roadmapFromState && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        AI Generated
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    if (!roadmapId) {
                                        alert("Please generate a new roadmap to use this feature (or this is a mock roadmap).");
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
                            >
                                <Clock size={16} /> Schedule learning
                            </button>
                            <ScheduleModal 
                                isOpen={isModalOpen} 
                                onClose={() => setIsModalOpen(false)} 
                                onSchedule={handleScheduleLearning}
                                loading={scheduleLoading}
                            />
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 transition">
                                <Download size={16} /> Download
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 transition">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </header>

                {/* Learning Path */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Path</h2>
                    <div className="w-full h-[500px] bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes} // <-- nodeTypes is now stable
                            fitView
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </section>

                {/* Frequently Asked Questions */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    {faqs && faqs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} faq={faq} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                            <p className="text-gray-600 mb-4">No FAQs available for this roadmap yet.</p>
                            <p className="text-sm text-gray-500">
                                {roadmapFromState
                                    ? "This is a personalized roadmap generated based on your search. FAQs will be added soon!"
                                    : "FAQs for this career path are coming soon!"
                                }
                            </p>
                        </div>
                    )}
                </section>

                {/* Related Career Paths */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Related Career Paths</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedCareers.map((career) => (
                            <button
                                key={career.name}
                                onClick={() => setSelectedCareer(career.name)}
                                className={`p-6 bg-white border rounded-lg text-left transition hover:shadow-lg hover:-translate-y-1 ${selectedCareer === career.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${career.color} mb-4`}>
                                    {career.icon}
                                </div>
                                <h3 className="font-bold text-gray-800">{career.name}</h3>
                                <p className="text-sm text-gray-500">{career.steps} &middot; {career.time}</p>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoadmapFlow;

