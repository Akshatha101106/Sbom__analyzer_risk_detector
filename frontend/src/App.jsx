import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { UploadScreen } from './components/screens/UploadScreen';
import { ScansScreen } from './components/screens/ScansScreen';
import { VulnerabilitiesScreen } from './components/screens/VulnerabilitiesScreen';
import { VulnerabilityDetailScreen } from './components/screens/VulnerabilityDetailScreen';
import { ComponentsScreen } from './components/screens/ComponentsScreen';
import { SbomQualityScreen } from './components/screens/SbomQualityScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

import { 
  INITIAL_SCAN_METRICS, 
  DEMO_VULNERABILITIES, 
  DEMO_COMPONENTS 
} from './data/demoData';
import { checkBackendHealth } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [scanData, setScanData] = useState(INITIAL_SCAN_METRICS);
  const [vulnerabilities] = useState(DEMO_VULNERABILITIES);
  const [components] = useState(DEMO_COMPONENTS);
  const [backendStatus, setBackendStatus] = useState({ isOnline: false, message: 'Connecting...' });
  const [searchQuery, setSearchQuery] = useState('');
  const [vulnSearchPreset, setVulnSearchPreset] = useState('');

  const refreshBackendStatus = async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
  };

  // Initial backend health check on mount
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (isMounted) setBackendStatus(status);
    });
    return () => {
      isMounted = false;
    };
  }, []);



  // Navigating to vulnerability deep dive
  const handleSelectVulnerability = (vuln) => {
    setSelectedVulnerability(vuln);
    setCurrentTab('detail');
  };

  // Returning from vulnerability detail to the table
  const handleBackToVulnerabilities = () => {
    setCurrentTab('vulnerabilities');
  };

  // Filtering vulnerabilities by package name (e.g. from components page)
  const handleFilterByPackage = (packageName) => {
    setVulnSearchPreset(packageName);
    setCurrentTab('vulnerabilities');
  };

  // Handle new scan completion
  const handleScanComplete = (scanInfo) => {
    setScanData((prev) => ({
      ...prev,
      sbomFile: scanInfo.fileName || prev.sbomFile,
      sbomFormat: scanInfo.format || prev.sbomFormat,
      scanDate: "Just now",
      scanId: `scan-${Date.now().toString().slice(-4)}`,
    }));
    setCurrentTab('overview');
  };

  // Load a historical scan
  const handleSelectHistoricalScan = (scan) => {
    setScanData((prev) => ({
      ...prev,
      scanId: scan.id,
      scanName: scan.name,
      sbomFile: scan.sbomFile,
      sbomFormat: scan.format,
      scanDate: scan.date,
      totalComponents: scan.components,
      vulnerabilitiesCount: scan.vulnerabilities,
      overallRisk: {
        ...prev.overallRisk,
        score: scan.riskScore,
        level: scan.risk,
      },
      sbomTrust: {
        ...prev.sbomTrust,
        score: scan.trust,
      }
    }));
    setCurrentTab('overview');
  };

  return (
    <div className="flex w-full min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={(tab) => {
          if (tab !== 'detail') setSelectedVulnerability(null);
          setCurrentTab(tab);
        }}
        scanData={scanData}
        backendStatus={backendStatus}
      />

      {/* Main Desktop Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Desktop Header */}
        <Header
          currentTab={currentTab}
          scanData={scanData}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q.trim().length > 1 && currentTab !== 'vulnerabilities' && currentTab !== 'components') {
              setVulnSearchPreset(q);
              setCurrentTab('vulnerabilities');
            }
          }}
          onNewScanClick={() => setCurrentTab('upload')}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-8 py-6 w-full max-w-[1920px] mx-auto">
          {currentTab === 'overview' && (
            <OverviewScreen
              scanData={scanData}
              vulnerabilities={vulnerabilities}
              onSelectVulnerability={handleSelectVulnerability}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'upload' && (
            <UploadScreen
              onScanComplete={handleScanComplete}
              backendStatus={backendStatus}
            />
          )}

          {currentTab === 'scans' && (
            <ScansScreen
              onNewScan={() => setCurrentTab('upload')}
              onSelectScan={handleSelectHistoricalScan}
              currentScanId={scanData.scanId}
            />
          )}

          {currentTab === 'vulnerabilities' && (
            <VulnerabilitiesScreen
              vulnerabilities={vulnerabilities}
              onSelectVulnerability={handleSelectVulnerability}
              initialSearchQuery={vulnSearchPreset || searchQuery}
            />
          )}

          {currentTab === 'detail' && (
            <VulnerabilityDetailScreen
              vulnerability={selectedVulnerability}
              onBack={handleBackToVulnerabilities}
            />
          )}

          {currentTab === 'components' && (
            <ComponentsScreen
              components={components}
              onSelectComponent={(c) => handleFilterByPackage(c.name)}
              onFilterVulnerabilitiesByPackage={handleFilterByPackage}
            />
          )}

          {currentTab === 'quality' && (
            <SbomQualityScreen
              scanData={scanData}
              onReviewUncertainFindings={() => {
                setVulnSearchPreset('UNKNOWN');
                setCurrentTab('vulnerabilities');
              }}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsScreen
              scanData={scanData}
              vulnerabilities={vulnerabilities}
              components={components}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              backendStatus={backendStatus}
              onRefreshBackendStatus={refreshBackendStatus}
            />
          )}
        </main>
      </div>
    </div>
  );
}
