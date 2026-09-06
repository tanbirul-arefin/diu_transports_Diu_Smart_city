import React, { useState } from 'react';
import { X, Copy, Check, Code2, Server, Database, Shield, Layers, Terminal, Sparkles } from 'lucide-react';
import { SPRING_BOOT_PROJECT_FILES } from '../data/springBootCode';
import { DIU_ROUTES, INITIAL_TRACKING } from '../data/transportData';

interface SpringBootModalProps {
  onClose: () => void;
}

export const SpringBootModal: React.FC<SpringBootModalProps> = ({ onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(1); // default to TransportRestController.java
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'architecture' | 'apiTest'>('code');
  const [testEndpoint, setTestEndpoint] = useState('/api/v1/transport/routes');
  const [apiResponse, setApiResponse] = useState<string>(
    JSON.stringify(DIU_ROUTES.slice(0, 3), null, 2)
  );

  const currentFile = SPRING_BOOT_PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTestApi = (endpoint: string) => {
    setTestEndpoint(endpoint);
    if (endpoint.includes('tracking')) {
      setApiResponse(JSON.stringify(INITIAL_TRACKING, null, 2));
    } else if (endpoint.includes('routes?category=Friday')) {
      const friday = DIU_ROUTES.filter((r) => r.category === 'Friday Schedule');
      setApiResponse(JSON.stringify(friday, null, 2));
    } else if (endpoint.includes('verify-qr')) {
      setApiResponse(
        JSON.stringify(
          {
            status: 200,
            result: 'PASS_VERIFIED_SUCCESS',
            studentId: '262-40-017',
            busAssigned: 'DIU-07-1203',
            validUntil: 'Fall 2026 Term End',
          },
          null,
          2
        )
      );
    } else {
      setApiResponse(JSON.stringify(DIU_ROUTES.slice(0, 4), null, 2));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 text-slate-100 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-700 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-lg font-bold">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Java Spring Boot & Thymeleaf Architecture
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-mono font-bold">
                  Spring Boot 3.3.3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pure backend Spring Boot REST services + Thymeleaf SSR + React client integration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top View Mode Selector: Code Files | Architecture Spec | Live API Tester */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'code' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java Source Files ({SPRING_BOOT_PROJECT_FILES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'architecture' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full-Stack Architecture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apiTest')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'apiTest' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Mock REST API Tester</span>
          </button>
        </div>

        {/* Tab 1: Java Source Files */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar list of Spring Boot files */}
            <div className="w-full md:w-64 bg-slate-950 p-2.5 border-r border-slate-800 space-y-1 overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block mb-1">
                Project Files
              </span>
              {SPRING_BOOT_PROJECT_FILES.map((file, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    selectedFileIndex === idx
                      ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-[9px] uppercase text-slate-500">{file.language}</span>
                </button>
              ))}
            </div>

            {/* Code Display Area */}
            <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
              <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400">{currentFile.name}</span>
                  <p className="text-[11px] text-slate-400">{currentFile.description}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="p-4 overflow-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/40">
                <pre>
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full-Stack Architecture */}
        {activeTab === 'architecture' && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Frontend Card */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Code2 className="w-4 h-4" />
                  Frontend Layer
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li>• <strong>React 19 + TypeScript + Vite</strong> for dynamic SPA</li>
                  <li>• <strong>Thymeleaf SSR</strong> templates (`routes.html`) for server-rendered university portals</li>
                  <li>• <strong>Tailwind CSS v4</strong> responsive UI with dual mobile-app & web portal layouts</li>
                  <li>• <strong>SVG Interactive GPS Corridors</strong> for live bus tracking</li>
                </ul>
              </div>

              {/* Backend Card */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Server className="w-4 h-4" />
                  Java Spring Boot Backend
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li>• <strong>Spring Boot 3.3.3</strong> with Java 21 LTS</li>
                  <li>• <strong>Spring Web MVC</strong> with `@RestController` APIs</li>
                  <li>• <strong>Spring Data JPA & Hibernate</strong> entity mapping</li>
                  <li>• <strong>Spring Security 6.x</strong> JWT Authentication & CORS config</li>
                </ul>
              </div>

              {/* Database & Infrastructure */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  Database & Cloud
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  <li>• <strong>PostgreSQL</strong> relational storage for routes & tickets</li>
                  <li>• <strong>GPS Telemetry Cache</strong> for bus speeds & coordinates</li>
                  <li>• <strong>QR Verification Algorithm</strong> for conductor scanners</li>
                  <li>• <strong>Containerized Deployment</strong> ready for Cloud Run & Docker</li>
                </ul>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-400">
              <div className="text-emerald-400 font-bold mb-2">
                Request & Response Pipeline:
              </div>
              <div className="space-y-1">
                <div>[DIU Mobile App / React SPA] ──(HTTPS JSON)──➔ [TransportRestController.java]</div>
                <div className="pl-6">├── ➔ [SecurityConfig (JWT Filter)]</div>
                <div className="pl-6">├── ➔ [TransportService.java]</div>
                <div className="pl-6">├── ➔ [BusRouteRepository (Spring Data JPA)] ──➔ [PostgreSQL DB]</div>
                <div className="pl-6">└── ➔ [ThymeleafWebController.java] ──➔ [templates/routes.html (SSR)]</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Mock REST API Tester */}
        {activeTab === 'apiTest' && (
          <div className="p-4 flex-1 flex flex-col space-y-3 overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Click any endpoint to simulate a Spring Boot REST API call:
              </span>
              <span className="text-emerald-400 font-mono font-bold">Status: 200 OK</span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleRunTestApi('/api/v1/transport/routes')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  testEndpoint === '/api/v1/transport/routes'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                GET /routes
              </button>

              <button
                type="button"
                onClick={() => handleRunTestApi('/api/v1/transport/routes?category=Friday')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  testEndpoint === '/api/v1/transport/routes?category=Friday'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                GET /routes?category=Friday
              </button>

              <button
                type="button"
                onClick={() => handleRunTestApi('/api/v1/transport/tracking/live')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  testEndpoint === '/api/v1/transport/tracking/live'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                GET /tracking/live
              </button>

              <button
                type="button"
                onClick={() => handleRunTestApi('/api/v1/transport/tickets/verify-qr')}
                className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  testEndpoint === '/api/v1/transport/tickets/verify-qr'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
              >
                POST /tickets/verify-qr
              </button>
            </div>

            <div className="flex-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-auto font-mono text-xs text-emerald-400">
              <div className="text-slate-500 pb-2 border-b border-slate-800 mb-2">
                Response for: <span className="text-white font-bold">{testEndpoint}</span>
              </div>
              <pre>
                <code>{apiResponse}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Built with Spring Boot 3.3, Java 21, JPA, Thymeleaf & React
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
