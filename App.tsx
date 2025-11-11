import React, { useState, useEffect, useCallback } from 'react';
import { initialData } from './data';
import type { LegalLegendTrackerData, DailyLog, Tool, LegacyMap as LegacyMapType, UserProfile, AppSettings } from './types';
import { calculateMetrics, generateProgressReport, updateAchievements, calculateAnalytics } from './services/metricsService';
import { UserProfileCard, ProgressMetrics, DailyLogs, DigitalTools, TransformationRoadmap, ResilienceGuide, LearningResources, LegacyMap, AchievementSystem, AnalyticsDashboard, ConsultationHub } from './components/Dashboard';
import { Modal } from './components/UI';
import { Logo } from './components/Logo';

type View = 'Dashboard' | 'DailyLogs' | 'DigitalTools' | 'Roadmap' | 'Resilience' | 'Learning' | 'Legacy' | 'Achievements' | 'Analytics' | 'Consultations';
type Theme = AppSettings['theme'];

// --- Theme Switcher Component ---
const ThemeSwitcher: React.FC<{ currentTheme: Theme, onThemeChange: (theme: Theme) => void }> = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const themes: { name: Theme, icon: string }[] = [
        { name: 'dark', icon: '🌙' },
        { name: 'light', icon: '☀️' },
        { name: 'twilight', icon: '🔮' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary-hover)] text-[var(--color-text-primary)] font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                aria-label="Change theme"
            >
                {themes.find(t => t.name === currentTheme)?.icon}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-xl z-20">
                    {themes.map(theme => (
                        <button
                            key={theme.name}
                            onClick={() => {
                                onThemeChange(theme.name);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                        >
                            {theme.icon} <span className="capitalize ml-2">{theme.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


const App: React.FC = () => {
    const [data, setData] = useState<LegalLegendTrackerData>(() => {
        try {
            const savedData = localStorage.getItem('legalLegendTrackerData');
            return savedData ? JSON.parse(savedData) : initialData;
        } catch (error) {
            console.error("Could not parse saved data, falling back to initial data.", error);
            return initialData;
        }
    });

    const [activeView, setActiveView] = useState<View>('Dashboard');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportContent, setReportContent] = useState('');
    
    useEffect(() => {
        try {
            localStorage.setItem('legalLegendTrackerData', JSON.stringify(data));
        } catch (error) {
            console.error("Could not save data to localStorage.", error);
        }
    }, [data]);
    
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', data.settings.theme);
    }, [data.settings.theme]);


    const updateAllCalculatedData = useCallback(() => {
        setData(prevData => {
            const newMetrics = calculateMetrics(prevData);
            const tempState = { ...prevData, progressMetrics: newMetrics };
            const newAchievements = updateAchievements(tempState);
            const newAnalytics = calculateAnalytics(tempState);

            if (JSON.stringify(prevData.progressMetrics) === JSON.stringify(newMetrics) &&
                JSON.stringify(prevData.achievementSystem) === JSON.stringify(newAchievements) &&
                JSON.stringify(prevData.analytics) === JSON.stringify(newAnalytics)) {
                return prevData;
            }

            return {
                ...prevData,
                progressMetrics: newMetrics,
                achievementSystem: newAchievements,
                analytics: newAnalytics,
            };
        });
    }, []);

    useEffect(() => {
        updateAllCalculatedData();
    }, [
        data.dailyLogs, 
        data.digitalTools, 
        data.transformationRoadmap, 
        data.resilienceGuide,
        updateAllCalculatedData
    ]);

    const handleUpdateProfile = (updatedProfile: UserProfile) => {
        setData(prevData => ({
            ...prevData,
            userProfile: updatedProfile
        }));
    };
    
    const handleUpdateTheme = (theme: Theme) => {
        setData(prevData => ({
            ...prevData,
            settings: { ...prevData.settings, theme }
        }));
    };

    const handleAddNewLog = (logData: Omit<DailyLog, 'id' | 'date' | 'weeklyReflection'>) => {
        const newLog: DailyLog = {
            ...logData,
            id: `log-${Date.now()}`,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        };

        setData(prevData => ({
            ...prevData,
            dailyLogs: [newLog, ...prevData.dailyLogs],
        }));
    };
    
    const handleUpdateDailyLogNotes = (logId: string, notes: string) => {
        setData(prevData => ({
            ...prevData,
            dailyLogs: prevData.dailyLogs.map(log => log.id === logId ? { ...log, additionalNotes: notes } : log),
        }));
    };

    const handleToggleWeekComplete = (monthIndex: number, weekIndex: number) => {
        setData(prevData => {
            const newRoadmap = JSON.parse(JSON.stringify(prevData.transformationRoadmap));
            const week = newRoadmap[monthIndex].weeks[weekIndex];
            
            week.isComplete = !week.isComplete;
            week.tasks = week.tasks.map((task: any) => ({ ...task, isComplete: week.isComplete }));
            
            return { ...prevData, transformationRoadmap: newRoadmap };
        });
    };
    
    const handleUpdateWeekNotes = (monthIndex: number, weekIndex: number, notes: string) => {
        setData(prevData => {
            const newRoadmap = JSON.parse(JSON.stringify(prevData.transformationRoadmap));
            newRoadmap[monthIndex].weeks[weekIndex].weekNotes = notes;
            return { ...prevData, transformationRoadmap: newRoadmap };
        });
    };

    const handleUpdateToolStatus = (categoryName: string, toolName: string, newStatus: Tool['status']) => {
        setData(prevData => {
            const newDigitalTools = prevData.digitalTools.map(category => {
                if (category.category === categoryName) {
                    return {
                        ...category,
                        tools: category.tools.map(tool => {
                            if (tool.name === toolName) {
                                return { ...tool, status: newStatus };
                            }
                            return tool;
                        })
                    };
                }
                return category;
            });
            return { ...prevData, digitalTools: newDigitalTools };
        });
    };

    const handleUpdateToolNotes = (categoryName: string, toolName: string, notes: string) => {
        setData(prevData => ({
            ...prevData,
            digitalTools: prevData.digitalTools.map(cat => 
                cat.category === categoryName ? {
                    ...cat,
                    tools: cat.tools.map(tool => tool.name === toolName ? { ...tool, usageNotes: notes } : tool)
                } : cat
            ),
        }));
    };

    const handleUpdateLegacyMap = (newMap: LegacyMapType) => {
        setData(prevData => ({
            ...prevData,
            legacyMap: newMap,
        }));
    };

    const NavButton = ({ view, label }: { view: View; children?: React.ReactNode, label: React.ReactNode }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-shrink-0 ${
                activeView === view
                    ? 'bg-[var(--color-accent-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    const handleGenerateReport = () => {
        const report = generateProgressReport(data);
        setReportContent(report);
        setIsReportModalOpen(true);
    };
    
    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3">
                            <UserProfileCard profile={data.userProfile} onUpdate={handleUpdateProfile} />
                        </div>
                        <div className="lg:col-span-3">
                            <ProgressMetrics metrics={data.progressMetrics} />
                        </div>
                    </div>
                );
            case 'DailyLogs':
                return <DailyLogs logs={data.dailyLogs} onAddLog={handleAddNewLog} onUpdateLogNotes={handleUpdateDailyLogNotes} />;
            case 'DigitalTools':
                return <DigitalTools toolCategories={data.digitalTools} onUpdateToolStatus={handleUpdateToolStatus} onUpdateToolNotes={handleUpdateToolNotes} />;
            case 'Roadmap':
                return <TransformationRoadmap roadmap={data.transformationRoadmap} onToggleWeek={handleToggleWeekComplete} onUpdateWeekNotes={handleUpdateWeekNotes} />;
            case 'Resilience':
                return <ResilienceGuide guide={data.resilienceGuide} />;
            case 'Learning':
                return <LearningResources resources={data.learningResources} />;
            case 'Legacy':
                return <LegacyMap map={data.legacyMap} onUpdateMap={handleUpdateLegacyMap} />;
            case 'Achievements':
                return <AchievementSystem achievements={data.achievementSystem} />;
            case 'Analytics':
                return <AnalyticsDashboard analytics={data.analytics} />;
            case 'Consultations':
                return <ConsultationHub />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Logo className="w-12 h-12 flex-shrink-0" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">Legal Legend Tracker</h1>
                            <p className="text-md sm:text-lg text-[var(--color-text-muted)] mt-1">Your Journey to Professional Mastery.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher currentTheme={data.settings.theme} onThemeChange={handleUpdateTheme} />
                        <button 
                            onClick={handleGenerateReport}
                            className="bg-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary-hover)] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                            Generate Report
                        </button>
                    </div>
                </header>
                
                <nav className="mb-6 bg-[var(--color-bg-secondary)] p-2 rounded-lg shadow-md">
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 -mb-2">
                        <NavButton view="Dashboard" label="Dashboard" />
                        <NavButton view="DailyLogs" label="Daily Logs" />
                        <NavButton view="DigitalTools" label="Digital Tools" />
                        <NavButton view="Roadmap" label="Roadmap" />
                        <NavButton view="Resilience" label="Resilience" />
                        <NavButton view="Learning" label="Learning" />
                        <NavButton view="Legacy" label="Legacy" />
                        <NavButton view="Achievements" label="Achievements" />
                        <NavButton view="Analytics" label="Analytics" />
                        <NavButton view="Consultations" label="Consultations" />
                    </div>
                </nav>

                <main>
                    {renderContent()}
                </main>

                 <Modal 
                    isOpen={isReportModalOpen} 
                    onClose={() => setIsReportModalOpen(false)}
                    title="Your Progress Report"
                >
                    <pre className="text-[var(--color-text-secondary)] whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {reportContent}
                    </pre>
                </Modal>
            </div>
        </div>
    );
};

export default App;