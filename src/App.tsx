import React, { useState, useEffect } from 'react';
import { 
  mockReports, 
  mockLots, 
  mockRecyclers, 
  POINTE_NOIRE_COASTAL_SITES, 
  REAL_TURTLE_THREATS, 
  REAL_COLLECTION_ROUTES, 
  REAL_IMPACT_CAMPAIGNS,
  MOCK_USERS
} from './data/mockPointeNoireData';
import { WasteReport, SyncState, WasteType, WasteVolume, UserProfile, UserNotification } from './types/koba';
import { SplashScreen } from './components/SplashScreen';
import { MobileTopBar } from './components/demo/MobileTopBar';
import { MobileBottomNav, DemoScreen } from './components/demo/MobileBottomNav';
import { DonorExportModal } from './components/demo/DonorExportModal';
import { ProfileModal } from './components/demo/ProfileModal';
import { ReportSuccessModal } from './components/demo/ReportSuccessModal';
import { NotificationToast } from './components/demo/NotificationToast';
import { NotificationsModal } from './components/demo/NotificationsModal';

// Mobile Screens
import { OnboardingScreen } from './components/demo/screens/OnboardingScreen';
import { HomeScreen } from './components/demo/screens/HomeScreen';
import { MapScreen } from './components/demo/screens/MapScreen';
import { ReportScreen } from './components/demo/screens/ReportScreen';
import { ScanScreen } from './components/demo/screens/ScanScreen';
import { TourScreen } from './components/demo/screens/TourScreen';
import { LotScreen } from './components/demo/screens/LotScreen';
import { ImpactScreen } from './components/demo/screens/ImpactScreen';
import { AuthScreen } from './components/demo/screens/AuthScreen';
import { EducationScreen } from './components/demo/screens/EducationScreen';

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-01',
    reportId: 'rep-pn-003',
    type: 'collected',
    title: 'Déchet Collecté & Pesé !',
    message: 'Votre signalement de filets fantômes à la Côte Sauvage a été collecté par l\'équipe mobile. Pesée certifiée : 48.5 kg.',
    locationName: 'Côte Sauvage (Sanctuaire Tortues)',
    weightKg: 48.5,
    pointsEarned: 30,
    timestamp: 'Il y a 2h',
    isRead: false,
  },
  {
    id: 'notif-02',
    reportId: 'rep-pn-001',
    type: 'nest_protected',
    title: 'Zone de Ponte Sécurisée',
    message: 'Le secteur de ponte de la Tortue Luth à Songolo a été nettoyé avant la marée haute.',
    locationName: 'Plage Songolo',
    pointsEarned: 20,
    timestamp: 'Hier',
    isRead: true,
  },
];

export default function App() {
  // Mobile Splash & Screen State
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [mobileScreen, setMobileScreen] = useState<DemoScreen>('home');
  const themeMode: 'fixora' = 'fixora';
  
  // User Session & Modals State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_USERS[0]);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'reports'>('profile');
  const [showDonorExportModal, setShowDonorExportModal] = useState<boolean>(false);
  const [selectedDonorTemplate, setSelectedDonorTemplate] = useState<string>('ffem');

  // Notifications State (System non-intrusive)
  const [notifications, setNotifications] = useState<UserNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeToastNotification, setActiveToastNotification] = useState<UserNotification | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);

  // Report Creation & Confirmation Modal State
  const [showReportSuccessModal, setShowReportSuccessModal] = useState<boolean>(false);
  const [justCreatedReport, setJustCreatedReport] = useState<WasteReport | null>(null);

  // Reports & Network Real-time Detection State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [reports, setReports] = useState<WasteReport[]>(mockReports);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Automatic Network Detection & Auto-Sync Hook
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically sync any pending reports when network reconnects
      setReports((prev) =>
        prev.map((r) => (r.syncState === 'pending' ? { ...r, syncState: 'synced' as SyncState } : r))
      );
      setReportSuccess('Connexion Internet rétablie : synchronisation automatique effectuée.');
      setTimeout(() => setReportSuccess(null), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 5-Step Report Wizard State
  const [reportStep, setReportStep] = useState<number>(1);
  const [locationName, setLocationName] = useState(POINTE_NOIRE_COASTAL_SITES[0].name);
  const [wasteType, setWasteType] = useState<WasteType>('plastic_bag');
  const [estimatedVolume, setEstimatedVolume] = useState<WasteVolume>('large');
  const [isNestingZone, setIsNestingZone] = useState<boolean>(true);
  const [turtleDangerLevelText, setTurtleDangerLevelText] = useState<string>(REAL_TURTLE_THREATS[0].label);
  const [description, setDescription] = useState(
    'Accumulation importante de sacs plastiques transparents dérivant vers la frayère'
  );
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [realGpsCoords, setRealGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);

  // Real-time detection of smartphone hardware GPS availability
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setIsGpsActive(false);
      return;
    }

    const checkGpsAvailability = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsGpsActive(true);
          setRealGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setIsGpsActive(false);
          setRealGpsCoords(null);
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    };

    checkGpsAvailability();
    const interval = setInterval(checkGpsAvailability, 10000);

    return () => clearInterval(interval);
  }, []);

  // Map Filter and Hotspot selection
  const [mapFilter, setMapFilter] = useState<'all' | 'simple_waste' | 'critical' | 'turtle_nest' | 'collected'>('all');
  const [mapSectorFilter, setMapSectorFilter] = useState<string>('all');
  const [selectedMapPoint, setSelectedMapPoint] = useState<WasteReport | null>(null);

  // Audio / Speech guide state
  const [speechLanguage, setSpeechLanguage] = useState<'french' | 'lingala' | 'kituba'>('french');
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  // Collector Tour & Weighing State
  const [selectedTourId, setSelectedTourId] = useState<string>('route-pn-101');
  const [selectedReportToCollect, setSelectedReportToCollect] = useState<WasteReport | null>(mockReports[2]);
  const [isRouteOptimized, setIsRouteOptimized] = useState<boolean>(true);
  const [weighInput, setWeighInput] = useState<number>(48.5);
  const [weighSuccess, setWeighSuccess] = useState<boolean>(false);

  // Scan & Lot state
  const [scanScreenMode, setScanScreenMode] = useState<'qr_scanner' | 'type_recognition'>('qr_scanner');
  const [scannedLotId, setScannedLotId] = useState<string>('MASSEKO-2026-000127');
  const [selectedRecyclerId, setSelectedRecyclerId] = useState<string>('rec-01');

  // Impact Campaign state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-2026-ponte');

  // Audio helper
  const triggerAudioGuidance = (frenchMsg: string, lingalaMsg: string, kitubaMsg: string) => {
    let msg = frenchMsg;
    if (speechLanguage === 'lingala') msg = lingalaMsg;
    if (speechLanguage === 'kituba') msg = kitubaMsg;

    setActiveSpeechText(msg);
    setTimeout(() => {
      setActiveSpeechText(null);
    }, 4500);
  };

  // Moderation
  const handleApproveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'validated' as const, validatedAt: new Date().toISOString() }
          : r
      )
    );
    setReportSuccess('Signalement validé par le modérateur Éco-Sentinelle.');
    setTimeout(() => setReportSuccess(null), 3000);
  };

  const handleRejectReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'rejected' as const } : r))
    );
    setReportSuccess('Signalement rejeté (doublon ou non conforme).');
    setTimeout(() => setReportSuccess(null), 3000);
  };

  // Validation of collection tour - Triggers Reporter Notification
  const handleValidateCollection = (reportId: string) => {
    let targetReport = reports.find((r) => r.id === reportId);
    
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'collected' as const,
            actualWeightKg: weighInput,
            collectedAt: new Date().toISOString(),
            syncState: isOnline ? ('synced' as const) : ('pending' as const),
          };
        }
        return r;
      })
    );

    // Award bonus points to the citizen for completed collection
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, points: prev.points + 30 } : null));
    }

    // Create Notification for the Reporter
    const collectionNotif: UserNotification = {
      id: `notif-${Date.now()}`,
      reportId: reportId,
      type: 'collected',
      title: 'Déchet Collecté & Pesé !',
      message: `Votre signalement à "${targetReport?.locationName.split('(')[0] || 'la plage'}" a été ramassé avec succès par l'équipe mobile. Pesée certifiée : ${weighInput} kg. +30 Éco-Points crédités !`,
      locationName: targetReport?.locationName,
      weightKg: weighInput,
      pointsEarned: 30,
      timestamp: 'À l\'instant',
      isRead: false,
    };

    setNotifications((prev) => [collectionNotif, ...prev]);
    // Trigger floating, non-intrusive notification toast
    setActiveToastNotification(collectionNotif);

    setWeighSuccess(true);
    setTimeout(() => {
      setWeighSuccess(false);
      setMobileScreen('lot');
    }, 1500);
  };

  const calculateDynamicScore = () => {
    let score = 30;
    if (estimatedVolume === 'very_large') score += 35;
    else if (estimatedVolume === 'large') score += 25;
    else if (estimatedVolume === 'medium') score += 15;
    else score += 5;

    if (isNestingZone) score += 25;
    if (wasteType === 'fishing_net') score += 15;
    if (wasteType === 'plastic_bag') score += 15;

    return Math.min(100, score);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = calculateDynamicScore();

    const backendIndicativeKg =
      estimatedVolume === 'very_large'
        ? 120
        : estimatedVolume === 'large'
        ? 60
        : estimatedVolume === 'medium'
        ? 20
        : 3;

    const defaultPhotos: Record<WasteType, string> = {
      plastic_bag: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      plastic_bottle: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
      fishing_net: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      mixed_plastic: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=800&q=80',
      fishing_gear: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      other: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
    };

    const selectedSite = POINTE_NOIRE_COASTAL_SITES.find((s) => s.name === locationName);
    const lat = realGpsCoords?.lat || selectedSite?.latitude || -4.7985;
    const lng = realGpsCoords?.lng || selectedSite?.longitude || 11.8290;
    const finalPhoto = capturedPhotoUrl || defaultPhotos[wasteType] || defaultPhotos.plastic_bottle;

    const newReport: WasteReport = {
      id: `rep-pn-00${reports.length + 1}`,
      authorId: currentUser?.id || 'user-001',
      locationName,
      latitude: lat,
      longitude: lng,
      wasteType,
      estimatedVolume,
      estimatedWeightKg: backendIndicativeKg,
      photoUrl: finalPhoto,
      description,
      status: 'reported',
      priorityScore: finalScore,
      priorityLevel: finalScore >= 80 ? 'CRITIQUE' : finalScore >= 50 ? 'HAUTE' : 'MOYENNE',
      isNestingZone,
      collectionType: isNestingZone ? 'turtle_nest' : 'simple_tour',
      turtleDangerLevel: isNestingZone
        ? (turtleDangerLevelText as WasteReport['turtleDangerLevel'])
        : undefined,
      syncState: isOnline ? 'synced' : 'pending',
      createdAt: new Date().toISOString(),
    };

    // Add report to list and credit user +20 points
    setReports([newReport, ...reports]);
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, points: prev.points + 20 } : null));
    }
    setSelectedMapPoint(newReport);
    setJustCreatedReport(newReport);

    // Create Notification for the Reporter
    const reportCreatedNotif: UserNotification = {
      id: `notif-${Date.now()}`,
      reportId: newReport.id,
      type: 'reported',
      title: 'Signalement Transmis',
      message: `Votre signalement à "${locationName}" a bien été pris en compte (+20 Éco-Points). L'équipe de collecte a été alertée.`,
      locationName,
      pointsEarned: 20,
      timestamp: 'À l\'instant',
      isRead: false,
    };
    setNotifications((prev) => [reportCreatedNotif, ...prev]);

    // Reset report creation inputs
    setReportStep(1);
    setCapturedPhotoUrl(null);
    setRealGpsCoords(null);

    // Open clean Confirmation Modal
    setShowReportSuccessModal(true);
  };

  const syncPendingReports = () => {
    setIsOnline(true);
    setReports((prev) => prev.map((r) => ({ ...r, syncState: 'synced' as SyncState })));
  };

  const handleDownloadDonorCSV = () => {
    const headers = ['ID', 'Secteur', 'Type_Dechet', 'Volume', 'Poids_Kg_Reel', 'Statut', 'Date'];
    const rows = reports.map((r) => [
      r.id,
      r.locationName,
      r.wasteType,
      r.estimatedVolume,
      r.actualWeightKg || 0,
      r.status,
      r.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapport_Masseko_PointeNoire_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = reports.filter((r) => r.syncState === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenReportFromNotification = (reportId?: string) => {
    if (reportId) {
      const target = reports.find((r) => r.id === reportId);
      if (target) {
        setSelectedMapPoint(target);
      }
    }
    setProfileModalTab('reports');
    setShowProfileModal(true);
  };

  // Render Splash Screen directly at root level so it is 100% full-screen without any frame or rounded border
  if (showSplashScreen) {
    return <SplashScreen onFinish={() => setShowSplashScreen(false)} />;
  }

  return (
    <div className="h-screen h-[100dvh] w-full flex justify-center text-slate-950 font-sans transition-colors bg-[#0A3D62] sm:bg-[#072740] overflow-hidden select-none">
      {/* Mobile App Standalone Frame (100% full screen on mobile, max-w-md on desktop) */}
      <div className="w-full h-full sm:max-w-md flex flex-col justify-between overflow-hidden relative isolate sm:shadow-2xl transition-colors sm:border-x sm:border-slate-800 text-slate-950 bg-[#F8FAFC]">
        {/* Top Bar (Status bar, network, notifications, user profile) */}
        <MobileTopBar
          isOnline={isOnline}
          setIsOnline={setIsOnline}
          syncPendingReports={syncPendingReports}
          pendingSyncCount={pendingCount}
          currentUser={currentUser}
          onOpenProfile={() => {
            setProfileModalTab('profile');
            setShowProfileModal(true);
          }}
          onOpenAuth={() => setMobileScreen('auth')}
          onOpenEducation={() => setMobileScreen('education')}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
        />

        {/* Floating Non-Intrusive Notification Toast (Dynamic Island style) */}
        <NotificationToast
          notification={activeToastNotification}
          onDismiss={() => setActiveToastNotification(null)}
          onViewReport={(repId) => handleOpenReportFromNotification(repId)}
        />

        {/* Scrollable Main Viewport for Active Screen */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-2.5 no-scrollbar">
          {mobileScreen === 'onboarding' && (
            <OnboardingScreen
              setMobileScreen={setMobileScreen}
              themeMode={themeMode}
            />
          )}

          {mobileScreen === 'auth' && (
            <AuthScreen
              currentUser={currentUser}
              onLogin={(u) => {
                setCurrentUser(u);
              }}
              onRegister={(newUser) => {
                setCurrentUser(newUser);
              }}
              setMobileScreen={setMobileScreen}
              themeMode={themeMode}
            />
          )}

          {mobileScreen === 'education' && (
            <EducationScreen
              setMobileScreen={setMobileScreen}
              themeMode={themeMode}
              currentUser={currentUser}
              onAwardPoints={(points) => {
                if (currentUser) {
                  setCurrentUser((prev) =>
                    prev ? { ...prev, points: prev.points + points } : null
                  );
                }
              }}
              triggerAudioGuidance={triggerAudioGuidance}
            />
          )}

          {mobileScreen === 'home' && (
            <HomeScreen
              reports={reports}
              setMobileScreen={setMobileScreen}
              setSelectedMapPoint={setSelectedMapPoint}
              themeMode={themeMode}
              isOnline={isOnline}
              isGpsActive={isGpsActive}
              currentUser={currentUser}
              onOpenProfile={() => {
                setProfileModalTab('profile');
                setShowProfileModal(true);
              }}
              onOpenMyReports={() => {
                setProfileModalTab('reports');
                setShowProfileModal(true);
              }}
            />
          )}

          {mobileScreen === 'map' && (
            <MapScreen
              reports={reports}
              selectedMapPoint={selectedMapPoint}
              setSelectedMapPoint={setSelectedMapPoint}
              setSelectedReportToCollect={setSelectedReportToCollect}
              setWeighInput={setWeighInput}
              mapFilter={mapFilter}
              setMapFilter={setMapFilter}
              mapSectorFilter={mapSectorFilter}
              setMapSectorFilter={setMapSectorFilter}
              themeMode={themeMode}
              setMobileScreen={setMobileScreen}
              handleApproveReport={handleApproveReport}
              handleRejectReport={handleRejectReport}
            />
          )}

          {mobileScreen === 'report' && (
            <ReportScreen
              reportStep={reportStep}
              setReportStep={setReportStep}
              locationName={locationName}
              setLocationName={setLocationName}
              wasteType={wasteType}
              setWasteType={setWasteType}
              estimatedVolume={estimatedVolume}
              setEstimatedVolume={setEstimatedVolume}
              isNestingZone={isNestingZone}
              setIsNestingZone={setIsNestingZone}
              turtleDangerLevelText={turtleDangerLevelText}
              setTurtleDangerLevelText={setTurtleDangerLevelText}
              description={description}
              setDescription={setDescription}
              capturedPhotoUrl={capturedPhotoUrl}
              setCapturedPhotoUrl={setCapturedPhotoUrl}
              realGpsCoords={realGpsCoords}
              setRealGpsCoords={setRealGpsCoords}
              isGpsActive={isGpsActive}
              handleCreateReport={handleCreateReport}
              calculateDynamicScore={calculateDynamicScore}
              themeMode={themeMode}
              speechLanguage={speechLanguage}
              setSpeechLanguage={setSpeechLanguage}
              triggerAudioGuidance={triggerAudioGuidance}
              activeSpeechText={activeSpeechText}
              reportSuccess={reportSuccess}
              setMobileScreen={setMobileScreen}
            />
          )}

          {mobileScreen === 'scan' && (
            <ScanScreen
              scanScreenMode={scanScreenMode}
              setScanScreenMode={setScanScreenMode}
              setMobileScreen={setMobileScreen}
              setScannedLotId={setScannedLotId}
              themeMode={themeMode}
            />
          )}

          {mobileScreen === 'tour' && (
            <TourScreen
              selectedTourId={selectedTourId}
              setSelectedTourId={setSelectedTourId}
              reports={reports}
              selectedReportToCollect={selectedReportToCollect}
              setSelectedReportToCollect={setSelectedReportToCollect}
              setSelectedMapPoint={setSelectedMapPoint}
              weighInput={weighInput}
              setWeighInput={setWeighInput}
              handleValidateCollection={handleValidateCollection}
              weighSuccess={weighSuccess}
              isRouteOptimized={isRouteOptimized}
              setIsRouteOptimized={setIsRouteOptimized}
              themeMode={themeMode}
              setMobileScreen={setMobileScreen}
            />
          )}

          {mobileScreen === 'lot' && (
            <LotScreen
              scannedLotId={scannedLotId}
              selectedRecyclerId={selectedRecyclerId}
              setSelectedRecyclerId={setSelectedRecyclerId}
              themeMode={themeMode}
              setMobileScreen={setMobileScreen}
            />
          )}

          {mobileScreen === 'impact' && (
            <ImpactScreen
              selectedCampaignId={selectedCampaignId}
              setSelectedCampaignId={setSelectedCampaignId}
              reports={reports}
              themeMode={themeMode}
              setShowDonorExportModal={setShowDonorExportModal}
              handleDownloadDonorCSV={handleDownloadDonorCSV}
              setMobileScreen={setMobileScreen}
            />
          )}
        </div>

        {/* Standard 5-Tab Mobile Navigation Bar */}
        <MobileBottomNav
          mobileScreen={mobileScreen}
          setMobileScreen={setMobileScreen}
          themeMode={themeMode}
        />
      </div>

      {/* User Profile & My Reports Modal */}
      <ProfileModal
        currentUser={currentUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={() => setCurrentUser(null)}
        setMobileScreen={setMobileScreen}
        themeMode={themeMode}
        userReports={reports}
        setSelectedMapPoint={setSelectedMapPoint}
        initialTab={profileModalTab}
      />

      {/* Instant Signalement Confirmation Modal */}
      <ReportSuccessModal
        report={justCreatedReport}
        isOpen={showReportSuccessModal}
        onClose={() => setShowReportSuccessModal(false)}
        onViewOnMap={() => {
          setShowReportSuccessModal(false);
          setMobileScreen('map');
        }}
        onViewMyReports={() => {
          setShowReportSuccessModal(false);
          setProfileModalTab('reports');
          setShowProfileModal(true);
        }}
        themeMode={themeMode}
        isOnline={isOnline}
      />

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotification={(reportId) => handleOpenReportFromNotification(reportId)}
        themeMode={themeMode}
      />

      {/* Official Donor Export Modal */}
      <DonorExportModal
        isOpen={showDonorExportModal}
        onClose={() => setShowDonorExportModal(false)}
        reports={reports}
        selectedDonorTemplate={selectedDonorTemplate}
        setSelectedDonorTemplate={setSelectedDonorTemplate}
        handleDownloadDonorCSV={handleDownloadDonorCSV}
      />
    </div>
  );
}
