import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useUserTourPreferences } from '@/services/user_tour_preferences/hook';
import { LanguageCode } from '@/services/user_tour_preferences/types';

export type StartTourOptions = {
	tourKey: string;
	steps: Step[];
	version?: string;
	autoRun?: boolean;
};

export type TourContextType = {
	startTour: (opts: StartTourOptions) => void;
	stopTour: () => void;
	setEnabled: (enabled: boolean) => Promise<void> | void;
	setLanguage: (language: LanguageCode) => Promise<void> | void;
	enabled: boolean;
	language: LanguageCode;
	running: boolean;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTour() {
	const ctx = useContext(TourContext);
	if (!ctx) throw new Error('useTour must be used within TourProvider');
	return ctx;
}

const TOUR_DEFAULT_VERSION = 'v1';

export function TourProvider({ children }: { children: React.ReactNode }) {
    // Global kill switch to disable all tours
    const TOURS_DISABLED = true;

    if (TOURS_DISABLED) {
        const disabledValue = useMemo<TourContextType>(() => ({
            startTour: () => {},
            stopTour: () => {},
            setEnabled: () => {},
            setLanguage: () => {},
            enabled: false,
            language: 'en' as LanguageCode,
            running: false,
        }), []);

        return (
            <TourContext.Provider value={disabledValue}>
                {children}
            </TourContext.Provider>
        );
    }
	const { prefs, loading, setEnabled: setEnabledSrv, setLanguage: setLanguageSrv, setTour } = useUserTourPreferences();
	const [steps, setSteps] = useState<Step[]>([]);
	const [running, setRunning] = useState<boolean>(false);
	const [activeTourKey, setActiveTourKey] = useState<string | null>(null);
	const [activeVersion, setActiveVersion] = useState<string>(TOUR_DEFAULT_VERSION);

	useEffect(() => {
		if (!loading && prefs && activeTourKey) {
			const ts = prefs.tours?.[activeTourKey];
			if (ts && ts.completed && ts.version === activeVersion) {
				setRunning(false);
			}
		}
	}, [loading, prefs, activeTourKey, activeVersion]);

	const startTour = useCallback((opts: StartTourOptions) => {
		const { tourKey, steps: s, version, autoRun = true } = opts;
		console.log('Starting tour:', tourKey);
		
		
		if (!prefs) {
			return;
		}
		if (!prefs.enabled) {
			return;
		}
		const current = prefs.tours?.[tourKey];
		const v = version ?? TOUR_DEFAULT_VERSION;
		if (current && current.completed && current.version === v) {
			return;
		}
		setActiveVersion(v);
		setActiveTourKey(tourKey);
		setSteps(s);
		if (autoRun) setRunning(true);
	}, [prefs]);

	const stopTour = useCallback(() => {
		setRunning(false);
	}, []);

	const handleJoyride = useCallback(async (data: CallBackProps) => {
		const { status } = data;
		const finished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
		if (finished && activeTourKey) {
			setRunning(false);
			await setTour(activeTourKey, { completed: status === STATUS.FINISHED, version: activeVersion });
		}
	}, [activeTourKey, activeVersion, setTour]);

	const setEnabled = useCallback(async (enabled: boolean) => {
		await setEnabledSrv(enabled);
		if (!enabled) setRunning(false);
	}, [setEnabledSrv]);

	const setLanguage = useCallback(async (language: LanguageCode) => {
		await setLanguageSrv(language);
	}, [setLanguageSrv]);

	const value = useMemo<TourContextType>(() => ({
		startTour,
		stopTour,
		setEnabled,
		setLanguage,
		enabled: !!prefs?.enabled,
		language: (prefs?.language ?? 'en') as LanguageCode,
		running,
	}), [prefs, running, setEnabled, setLanguage, startTour, stopTour]);

	// Debug logging
	useEffect(() => {
		console.log('🎯 TourProvider state:', { 
			loading, 
			prefs, 
			enabled: !!prefs?.enabled, 
			running, 
			steps: steps.length,
			activeTourKey 
		});
	}, [loading, prefs, running, steps.length, activeTourKey]);

	return (
		<TourContext.Provider value={value}>
			{children}
			<Joyride
				run={running}
				steps={steps}
				continuous
				showProgress
				showSkipButton
				scrollToFirstStep
				disableOverlayClose={true}
				disableOverlay
				spotlightClicks
				disableScrolling={true}
				locale={{
					back: value.language === 'ar' ? 'السابق' : 'Back',
					close: value.language === 'ar' ? 'إغلاق' : 'Close',
					last: value.language === 'ar' ? 'إنهاء' : 'Finish',
					next: value.language === 'ar' ? 'التالي' : 'Next',
					skip: value.language === 'ar' ? 'تخطّي' : 'Skip',
				}}
				styles={{ 
					options: { 
						primaryColor: '#2563eb', 
						zIndex: 9999,
						width: 320,
						arrowColor: '#2563eb',
						textColor: '#374151'
					},
					overlay: { 
						backgroundColor: 'transparent',
						mixBlendMode: 'normal',
						pointerEvents: 'none'
					},
					spotlight: {
						backgroundColor: 'rgba(37, 99, 235, 0.15)',
						borderRadius: '12px',
						border: '3px solid #2563eb',
						boxShadow: '0 0 0 6px rgba(37, 99, 235, 0.15), 0 4px 20px rgba(37, 99, 235, 0.3)'
					},
					tooltip: {
						borderRadius: '12px',
						boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
					}
				}}
				callback={handleJoyride}
			/>
		</TourContext.Provider>
	);
}
