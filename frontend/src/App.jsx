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
import { AuthScreen } from './components/auth/AuthScreen';

import { checkBackendHealth, getCurrentUser, getScans, getScan, logout } from './services/api';
import { normalizeScanData } from './services/normalizeScan';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  // Real backend data only
  const [scanData, setScanData] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [components, setComponents] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);

  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    osvConnected: false,
    message: 'Connecting...',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [vulnSearchPreset, setVulnSearchPreset] = useState('');

  const refreshBackendStatus = async () => {
    const status = await checkBackendHealth();
    setBackendStatus(status);
  };

  // Restore the server-side session before requesting any private scan data.
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted) return;
        if (currentUser) {
          const [status, scans] = await Promise.all([checkBackendHealth(), getScans()]);
          if (!isMounted) return;
          setUser(currentUser);
          setBackendStatus({ ...status, isOnline: true });
          setScanHistory(scans);
        }
      } catch (error) {
        if (isMounted) setAuthError(error.message);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthenticated = async (authenticatedUser) => {
    const [status, scans] = await Promise.all([checkBackendHealth(), getScans()]);
    setBackendStatus({ ...status, isOnline: true });
    setScanHistory(scans);
    setUser(authenticatedUser);
    setAuthError('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setScanData(null);
      setVulnerabilities([]);
      setComponents([]);
      setScanHistory([]);
      setCurrentTab('overview');
      setSelectedVulnerability(null);
      setAuthError('');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Select vulnerability
  const handleSelectVulnerability = (vuln) => {
    setSelectedVulnerability(vuln);
    setCurrentTab('detail');
  };

  // Back to vulnerabilities
  const handleBackToVulnerabilities = () => {
    setCurrentTab('vulnerabilities');
  };

  // Filter vulnerabilities by package
  const handleFilterByPackage = (packageName) => {
    setVulnSearchPreset(packageName);
    setCurrentTab('vulnerabilities');
  };

  // Handle real scan completion from backend
  const handleScanComplete = (scanInfo) => {
    if (!scanInfo) return;

    const normalizedScan = normalizeScanData(scanInfo);
    setScanData(normalizedScan);
    setVulnerabilities(normalizedScan.vulnerabilities);
    setComponents(normalizedScan.components);
    getScans()
      .then(setScanHistory)
      .catch((error) => console.error('Failed to refresh scan history.', error));

    setCurrentTab('overview');
  };

  // Load a historical scan returned by the backend
  const handleSelectHistoricalScan = async (scan) => {
    if (!scan) return;

    try {
      const normalizedScan = normalizeScanData(await getScan(scan.id));
      setScanData(normalizedScan);
      setVulnerabilities(normalizedScan.vulnerabilities);
      setComponents(normalizedScan.components);
      setCurrentTab('overview');
    } catch (error) {
      console.error('Failed to load the selected SBOM scan.', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-sm text-slate-400">
        Checking your secure session…
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthenticated={handleAuthenticated} initialError={authError} />;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">

      {/* Persistent Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={(tab) => {
          if (tab !== 'detail') {
            setSelectedVulnerability(null);
          }

          setCurrentTab(tab);
        }}
        scanData={scanData}
        backendStatus={backendStatus}
        user={user}
        onLogout={handleLogout}
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

            if (
              q.trim().length > 1 &&
              currentTab !== 'vulnerabilities' &&
              currentTab !== 'components'
            ) {
              setVulnSearchPreset(q);
              setCurrentTab('vulnerabilities');
            }
          }}
          onNewScanClick={() => setCurrentTab('upload')}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-8 py-6 w-full max-w-[1920px] mx-auto">
          {authError && (
            <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {authError}
            </p>
          )}

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
              scans={scanHistory}
              onSelectScan={handleSelectHistoricalScan}
              currentScanId={scanData?.id}
            />
          )}

          {currentTab === 'vulnerabilities' && (
            <VulnerabilitiesScreen
              vulnerabilities={vulnerabilities}
              scanData={scanData}
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
              onSelectComponent={(component) =>
                handleFilterByPackage(component.name)
              }
              onFilterVulnerabilitiesByPackage={
                handleFilterByPackage
              }
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