import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useUserTourPreferences } from '@/services/user_tour_preferences/hook';
import { LanguageCode } from '@/services/user_tour_preferences/types';
import { DashboardTourTooltip } from '@/modules/dashboard/components/DashboardTourTooltip';

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
	const { prefs, loading, setEnabled: setEnabledSrv, setLanguage: setLanguageSrv, setTour } = useUserTourPreferences();
	const [steps, setSteps] = useState<Step[]>([]);
	const [running, setRunning] = useState<boolean>(false);
	const [activeTourKey, setActiveTourKey] = useState<string | null>(null);
	const [activeVersion, setActiveVersion] = useState<string>(TOUR_DEFAULT_VERSION);
	const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

	useEffect(() => {
		if (!loading && prefs && activeTourKey) {
			const ts = prefs.tours?.[activeTourKey];
			// Stop tour if it's completed OR hidden (don't show again)
			if (ts && (ts.completed === true || ts.hidden === true)) {
				setRunning(false);
			}
		}
	}, [loading, prefs, activeTourKey]);

	const startTour = useCallback((opts: StartTourOptions) => {
		const { tourKey, steps: s, version, autoRun = true } = opts;
		console.log('[TourProvider] startTour called:', { tourKey, stepsCount: s.length, autoRun });
		
		if (!prefs) {
			console.log('[TourProvider] No preferences, aborting');
			return;
		}
		if (!prefs.enabled) {
			console.log('[TourProvider] Tours disabled, aborting');
			return;
		}
		const current = prefs.tours?.[tourKey];
		const v = version ?? TOUR_DEFAULT_VERSION;
		console.log('[TourProvider] Tour state check:', { tourKey, current, version: v });
		// Don't start if completed OR hidden
		if (current && (current.completed === true || current.hidden === true)) {
			console.log('[TourProvider] Tour skipped - completed:', current.completed, 'hidden:', current.hidden);
			return;
		}
		console.log('[TourProvider] Setting up tour:', { tourKey, version: v, stepsCount: s.length });
		setActiveVersion(v);
		setActiveTourKey(tourKey);
		setSteps(s);
		setDontShowAgain(false);
		if (autoRun) {
			console.log('[TourProvider] Starting tour (autoRun=true)');
			setRunning(true);
		}
	}, [prefs]);

	const stopTour = useCallback(() => {
		setRunning(false);
	}, []);

	const handleDontShowAgain = useCallback(async (checked: boolean) => {
		setDontShowAgain(checked);
	}, []);

	const handleJoyride = useCallback(async (data: CallBackProps) => {
		const { status, type, step, action, index } = data;

		// #region agent log
		fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourProvider.tsx:handleJoyride',message:'joyride_callback',data:{type,status,action,index,tourKey:activeTourKey,target:step?.target ?? null,enabled:prefs?.enabled ?? null,hasPrefs:!!prefs,scrollY:typeof window!=='undefined'?window.scrollY:null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1'})}).catch(()=>{});
		// #endregion
		
		// Scroll to target element when step becomes active
		if (type === 'step:after' && step?.target && typeof step.target === 'string') {
			setTimeout(() => {
				const targetElement = document.querySelector(step.target as string);
				if (targetElement) {
					// #region agent log
					fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourProvider.tsx:scrollIntoView',message:'target_found_before_scroll',data:{tourKey:activeTourKey,type,target:step.target,scrollY:typeof window!=='undefined'?window.scrollY:null,rect:targetElement instanceof Element?targetElement.getBoundingClientRect():null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
					// #endregion

					// Get viewport dimensions
					const viewportHeight = window.innerHeight;
					const viewportWidth = window.innerWidth;
					
					// Get element position relative to document
					const rect = targetElement.getBoundingClientRect();
					const elementTop = rect.top + window.scrollY;
					const elementLeft = rect.left + window.scrollX;
					
					// Calculate scroll position to center the element in viewport
					const scrollTop = elementTop - (viewportHeight / 2) + (rect.height / 2);
					const scrollLeft = elementLeft - (viewportWidth / 2) + (rect.width / 2);
					
					// Smooth scroll to center the element
					window.scrollTo({
						top: Math.max(0, scrollTop),
						left: Math.max(0, scrollLeft),
						behavior: 'smooth'
					});

					// #region agent log
					fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourProvider.tsx:scrollIntoView',message:'scroll_called',data:{tourKey:activeTourKey,type,target:step.target,scrollY:typeof window!=='undefined'?window.scrollY:null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
					// #endregion

					// Small delay to ensure scroll completes before focusing
					setTimeout(() => {
						// Focus the element if it's focusable
						if (targetElement instanceof HTMLElement) {
							const isFocusable = 
								targetElement.tabIndex >= 0 || 
								targetElement instanceof HTMLInputElement ||
								targetElement instanceof HTMLButtonElement ||
								targetElement instanceof HTMLSelectElement ||
								targetElement instanceof HTMLTextAreaElement ||
								targetElement instanceof HTMLAnchorElement;
							
							if (isFocusable) {
								targetElement.focus({ preventScroll: true });
								// #region agent log
								fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourProvider.tsx:focus',message:'target_focused',data:{tourKey:activeTourKey,type,target:step.target,tag:targetElement.tagName,tabIndex:targetElement.tabIndex,scrollY:typeof window!=='undefined'?window.scrollY:null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
								// #endregion
							}
						}
					}, 300);
				}
				else {
					// #region agent log
					fetch('http://127.0.0.1:7243/ingest/10b73a00-1684-42a8-a1f4-18c1426b4fba',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourProvider.tsx:scrollIntoView',message:'target_not_found',data:{tourKey:activeTourKey,type,target:step.target,scrollY:typeof window!=='undefined'?window.scrollY:null},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4'})}).catch(()=>{});
					// #endregion
				}
			}, 100);
		}
		
		const finished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
		if (finished && activeTourKey) {
			setRunning(false);
			// If "don't show again" is checked, set hidden to true
			const updateData: any = {
				completed: status === STATUS.FINISHED,
				version: activeVersion,
			};
			if (dontShowAgain) {
				updateData.hidden = true;
				updateData.enabled = false; // Also disable the tour
			}
			await setTour(activeTourKey, updateData);
			setDontShowAgain(false);
		}
	}, [activeTourKey, activeVersion, setTour, dontShowAgain]);

	const setEnabled = useCallback(async (enabled: boolean) => {
		await setEnabledSrv(enabled);
		if (!enabled) setRunning(false);
	}, [setEnabledSrv]);

	const setLanguage = useCallback(async (language: LanguageCode) => {
		// Force language to always be English
		await setLanguageSrv('en');
	}, [setLanguageSrv]);

	// Ensure language is always English when preferences load
	useEffect(() => {
		if (!loading && prefs && prefs.language !== 'en') {
			setLanguageSrv('en');
		}
	}, [loading, prefs, setLanguageSrv]);

	const value = useMemo<TourContextType>(() => ({
		startTour,
		stopTour,
		setEnabled,
		setLanguage,
		enabled: !!prefs?.enabled,
		language: 'en' as LanguageCode, // Always English
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

	// Custom tooltip component
	const renderTooltip = useCallback((data: any) => {
		return (
			<DashboardTourTooltip
				{...data}
				locale={{
					back: value.language === 'ar' ? 'السابق' : 'Back',
					close: value.language === 'ar' ? 'إغلاق' : 'Close',
					last: value.language === 'ar' ? 'إنهاء' : 'Finish',
					next: value.language === 'ar' ? 'التالي' : 'Next',
					skip: value.language === 'ar' ? 'تخطّي' : 'Skip',
				}}
				language={value.language}
				onDontShowAgain={handleDontShowAgain}
			/>
		);
	}, [value.language, handleDontShowAgain]);

	return (
		<TourContext.Provider value={value}>
			{children}
			<Joyride
				run={running}
				steps={steps}
				continuous
				showProgress={false}
				showSkipButton={false}
				scrollToFirstStep={true}
				scrollOffset={0}
				disableOverlayClose={true}
				disableOverlay={false}
				spotlightClicks
				disableScrolling={false}
				floaterProps={{
					disableAnimation: false,
					placement: 'auto',
				}}
				styles={{ 
					options: { 
						primaryColor: '#2563eb', 
						zIndex: 9999,
					},
					overlay: { 
						backgroundColor: 'transparent',
						mixBlendMode: 'normal',
					},
					spotlight: {
						borderRadius: '12px',
						backgroundColor: 'rgba(37, 99, 235, 0.1)',
						border: '2px solid #2563eb',
						boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1), 0 4px 20px rgba(37, 99, 235, 0.2)',
					},
				}}
				tooltipComponent={renderTooltip as any}
				callback={handleJoyride}
			/>
		</TourContext.Provider>
	);
}
