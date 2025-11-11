import React, { useState, useEffect } from 'react';
import type { UserProfile, ProgressMetrics as ProgressMetricsType, DailyLog, DigitalToolCategory, RoadmapMonth, ResilienceGuide as ResilienceGuideType, LearningResources as LearningResourcesType, LegacyMap as LegacyMapType, AchievementSystem as AchievementSystemType, Analytics as AnalyticsType, TrendDataPoint, RoadmapTask, Tool, Community } from '../types';
import { Card, ProgressBar, RatingStars, CheckCircleIcon, XCircleIcon, Modal, PencilIcon } from './UI';

// Reusable inline notes editor component
const InlineNoteEditor: React.FC<{ initialNotes: string; onSave: (notes: string) => void; placeholder: string; }> = ({ initialNotes, onSave, placeholder }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="mt-2">
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)] text-sm"
                    rows={3}
                />
                <div className="flex gap-2 justify-end mt-2">
                    <button onClick={() => { onSave(notes); setIsEditing(false); }} className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]">Save</button>
                    <button onClick={() => { setNotes(initialNotes); setIsEditing(false); }} className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--color-bg-tertiary)] text-white hover:bg-[var(--color-bg-tertiary-hover)]">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="mt-2 text-sm text-[var(--color-text-muted)] p-2 rounded-md bg-[var(--color-bg-interactive)] cursor-pointer hover:bg-[var(--color-bg-interactive-hover)]"
            onClick={() => setIsEditing(true)}
        >
            <span className="font-semibold text-[var(--color-text-subtle)]">Notes: </span>
            {notes ? <span className="whitespace-pre-wrap">{notes}</span> : <span className="italic text-[var(--color-text-subtle)]">{placeholder}</span>}
        </div>
    );
};


// User Profile Component
interface UserProfileCardProps {
    profile: UserProfile;
    onUpdate: (profile: UserProfile) => void;
}
export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);

    useEffect(() => {
        setDraftProfile(profile);
    }, [profile]);

    const handleSave = () => {
        if (!draftProfile.name.trim()) {
            alert("Name cannot be empty.");
            return;
        }
        if (new Date(draftProfile.startDate) > new Date()) {
            alert("Start date cannot be in the future.");
            return;
        }
        onUpdate(draftProfile);
        setIsEditing(false);
    };

    return (
        <>
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{profile.name}</h2>
                        <p className="text-[var(--color-accent-text)]">{profile.currentPhase}</p>
                        <p className="text-sm text-[var(--color-text-muted)] mt-2">Start Date: {new Date(profile.startDate).toLocaleDateString()}</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        aria-label="Edit Profile"
                    >
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            </Card>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={draftProfile.name}
                            onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })}
                            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={draftProfile.startDate}
                            onChange={(e) => setDraftProfile({ ...draftProfile, startDate: e.target.value })}
                            className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-bg-tertiary)] text-white hover:bg-[var(--color-bg-tertiary-hover)]">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]">Save Changes</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// Progress Metrics Component
const MetricCard: React.FC<{ title: string; value: string | number; subtext: string }> = ({ title, value, subtext }) => (
    <Card className="flex flex-col items-center justify-center text-center h-full">
        <p className="text-[var(--color-text-muted)] text-sm">{title}</p>
        <p className="text-4xl font-bold text-[var(--color-text-primary)] my-2">{value}</p>
        <p className="text-[var(--color-text-muted)] text-sm">{subtext}</p>
    </Card>
);

export const ProgressMetrics: React.FC<{ metrics: ProgressMetricsType }> = ({ metrics }) => (
    <div>
        <Card className="mb-4">
            <ProgressBar percentage={metrics.overallProgress} label="Overall Progress" />
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard title="Current Streak" value={metrics.currentStreak} subtext="consecutive days" />
            <MetricCard title="Avg. Daily Rating" value={metrics.averageDailyRating} subtext="last 7 days" />
            <MetricCard title="Weekly Consistency" value={`${metrics.weeklyConsistency}%`} subtext="last 7 days" />
            <MetricCard title="Roadmap Progress" value={`${metrics.roadmapCompletion}%`} subtext="weeks completed" />
            <MetricCard title="Tool Integration" value={`${metrics.toolIntegrationScore}%`} subtext="tools integrated" />
            <MetricCard title="Integrity Score" value={metrics.weeklyIntegrityScore} subtext="avg. alignment" />
        </div>
    </div>
);

// --- NEW Add Daily Log Form Component ---
const AddDailyLogForm: React.FC<{ onAddLog: (logData: { keyAchievement: string; challengeFaced: string; lessonLearned: string; dailyRating: number; additionalNotes?: string; }) => void; }> = ({ onAddLog }) => {
    const [achievement, setAchievement] = useState('');
    const [challenge, setChallenge] = useState('');
    const [lesson, setLesson] = useState('');
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!achievement.trim() || !lesson.trim() || rating === 0) {
            alert('Please fill out the Key Achievement, Lesson Learned, and Daily Rating fields.');
            return;
        }
        onAddLog({ keyAchievement: achievement, challengeFaced: challenge, lessonLearned: lesson, dailyRating: rating, additionalNotes: notes });
        // Reset form
        setAchievement('');
        setChallenge('');
        setLesson('');
        setRating(0);
        setNotes('');
    };

    return (
        <div className="p-4 my-4 bg-[var(--color-bg-tertiary)]/50 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Add New Daily Log</h3>
                <div>
                    <label htmlFor="achievement" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Key Achievement <span className="text-red-400">*</span></label>
                    <input type="text" id="achievement" value={achievement} onChange={e => setAchievement(e.target.value)} required className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]" />
                </div>
                 <div>
                    <label htmlFor="challenge" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Challenge Faced</label>
                    <input type="text" id="challenge" value={challenge} onChange={e => setChallenge(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]" />
                </div>
                 <div>
                    <label htmlFor="lesson" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Lesson Learned <span className="text-red-400">*</span></label>
                    <textarea id="lesson" value={lesson} onChange={e => setLesson(e.target.value)} required rows={2} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"></textarea>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Additional Notes</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"></textarea>
                </div>
                <div>
                     <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">Daily Rating <span className="text-red-400">*</span></label>
                     <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => setRating(star)} aria-label={`Rate ${star} star`}>
                                <svg className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-subtle)]'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        ))}
                     </div>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary-hover)]">Add Log</button>
                </div>
            </form>
        </div>
    );
};


// Daily Logs Component
interface DailyLogsProps {
    logs: DailyLog[];
    onAddLog: (logData: Omit<DailyLog, 'id' | 'date' | 'weeklyReflection'>) => void;
    onUpdateLogNotes: (logId: string, notes: string) => void;
}
export const DailyLogs: React.FC<DailyLogsProps> = ({ logs, onAddLog, onUpdateLogNotes }) => {
    const [isAdding, setIsAdding] = useState(false);
    const latestReflection = logs.find(log => log.weeklyReflection)?.weeklyReflection;
    
    const handleAddLog = (logData: Omit<DailyLog, 'id' | 'date' | 'weeklyReflection'>) => {
        onAddLog(logData);
        setIsAdding(false);
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Latest Daily Logs</h3>
                             <button onClick={() => setIsAdding(!isAdding)} className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-200">
                                {isAdding ? 'Cancel' : '＋ Add Log'}
                            </button>
                        </div>
                        {isAdding && <AddDailyLogForm onAddLog={handleAddLog} />}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-4">
                            {logs.map(log => (
                                <div key={log.id} className="p-3 bg-[var(--color-bg-tertiary)]/50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-[var(--color-accent-text)]">{new Date(log.date).toLocaleDateString()}</p>
                                            <p className="text-sm mt-1"><span className="font-semibold text-[var(--color-text-muted)]">Achievement:</span> {log.keyAchievement}</p>
                                            <p className="text-sm"><span className="font-semibold text-[var(--color-text-muted)]">Lesson:</span> {log.lessonLearned}</p>
                                        </div>
                                        <RatingStars rating={log.dailyRating} />
                                    </div>
                                    <InlineNoteEditor 
                                        initialNotes={log.additionalNotes || ''}
                                        onSave={(notes) => onUpdateLogNotes(log.id, notes)}
                                        placeholder="Add additional notes..."
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
                {latestReflection ? (
                    <div>
                        <Card>
                            <h3 className="text-xl font-semibold mb-4">Latest Weekly Reflection</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mb-2">For week starting {new Date(latestReflection.weekStartDate).toLocaleDateString()}</p>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-[var(--color-accent-text)]">Breakthrough</h4>
                                    <p className="text-sm">{latestReflection.breakthrough}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-accent-text)]">Area for Improvement</h4>
                                    <p className="text-sm">{latestReflection.improvementArea}</p>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-[var(--color-accent-text)]">Next Week's Focus</h4>
                                    <p className="text-sm">{latestReflection.nextWeekFocus}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : ( <div/> ) }
            </div>
        </div>
    );
};

// Digital Tools Component
interface DigitalToolsProps {
    toolCategories: DigitalToolCategory[];
    onUpdateToolStatus: (categoryName: string, toolName: string, newStatus: Tool['status']) => void;
    onUpdateToolNotes: (categoryName: string, toolName: string, notes: string) => void;
}
export const DigitalTools: React.FC<DigitalToolsProps> = ({ toolCategories, onUpdateToolStatus, onUpdateToolNotes }) => {
    
    const toolStatuses: Tool['status'][] = ['Not Started', 'Exploring', 'Integrated'];

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4">Digital Tool Mastery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toolCategories.map(cat => (
                    <div key={cat.category} className="p-4 bg-[var(--color-bg-tertiary)]/50 rounded-lg">
                        <h4 className="font-bold text-lg mb-3 text-[var(--color-accent-text)]">{cat.category}</h4>
                        <div className="space-y-4">
                            {cat.tools.map(tool => (
                                <div key={tool.name} className="space-y-2">
                                    <p className="font-medium">{tool.name}</p>
                                    <select 
                                      value={tool.status}
                                      onChange={(e) => onUpdateToolStatus(cat.category, tool.name, e.target.value as Tool['status'])}
                                      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)] text-sm"
                                    >
                                      {toolStatuses.map(status => (
                                          <option key={status} value={status}>{status}</option>
                                      ))}
                                    </select>
                                    <RatingStars rating={tool.proficiency} />
                                    <InlineNoteEditor 
                                        initialNotes={tool.usageNotes || ''}
                                        onSave={(notes) => onUpdateToolNotes(cat.category, tool.name, notes)}
                                        placeholder="Add usage notes..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// Transformation Roadmap Component
interface TransformationRoadmapProps {
    roadmap: RoadmapMonth[];
    onToggleWeek: (monthIndex: number, weekIndex: number) => void;
    onUpdateWeekNotes: (monthIndex: number, weekIndex: number, notes: string) => void;
}
export const TransformationRoadmap: React.FC<TransformationRoadmapProps> = ({ roadmap, onToggleWeek, onUpdateWeekNotes }) => {
    const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
    
    const handleWeekClick = (monthIndex: number, weekIndex: number) => {
        const weekId = `${monthIndex}-${weekIndex}`;
        setExpandedWeek(expandedWeek === weekId ? null : weekId);
    };

    return (
    <Card>
        <h3 className="text-xl font-semibold mb-4">90-Day Transformation Roadmap</h3>
        <div className="space-y-6">
            {roadmap.map((month, monthIndex) => (
                <div key={month.month}>
                    <h4 className="text-lg font-bold text-[var(--color-accent-text)] mb-2">Month {month.month}: {month.theme}</h4>
                    <div className="space-y-2">
                        {month.weeks.map((week, weekIndex) => {
                            const weekId = `${monthIndex}-${weekIndex}`;
                            const isExpanded = expandedWeek === weekId;
                            return (
                            <div 
                                key={week.weekNumber} 
                                className={`p-3 rounded-lg transition-all duration-200 ${week.isComplete ? 'bg-[var(--color-success-bg)]' : 'bg-[var(--color-bg-tertiary)]/50'}`}
                            >
                                <div className="flex items-start sm:items-center gap-4">
                                    <div 
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleWeek(monthIndex, weekIndex)}
                                        onClick={() => onToggleWeek(monthIndex, weekIndex)}
                                        className="cursor-pointer"
                                    >
                                        {week.isComplete ? <CheckCircleIcon className="w-6 h-6 text-[var(--color-success)] flex-shrink-0 mt-1 sm:mt-0" /> : <div className="w-6 h-6 border-2 border-[var(--color-text-subtle)] rounded-full flex-shrink-0 mt-1 sm:mt-0"></div>}
                                    </div>
                                    <div className="flex-grow cursor-pointer" onClick={() => handleWeekClick(monthIndex, weekIndex)}>
                                        <p className="font-semibold">Week {week.weekNumber}: {week.focus}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)] mt-1">
                                            {week.tasks.map((task: RoadmapTask, idx: number) => (
                                              <span key={idx} className={`flex items-center gap-1.5 ${task.isComplete ? 'line-through text-[var(--color-text-subtle)]' : ''}`}>
                                                {task.description}
                                              </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="mt-3 pl-10">
                                         <InlineNoteEditor 
                                            initialNotes={week.weekNotes || ''}
                                            onSave={(notes) => onUpdateWeekNotes(monthIndex, weekIndex, notes)}
                                            placeholder="Add notes for this week..."
                                        />
                                    </div>
                                )}
                            </div>
                        )})}
                    </div>
                </div>
            ))}
        </div>
    </Card>
)};

// Resilience Guide Component
export const ResilienceGuide: React.FC<{ guide: ResilienceGuideType }> = ({ guide }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h3 className="text-xl font-semibold mb-4">Quick Reset Log</h3>
            <ul className="space-y-2 text-sm">
                {guide.quickResets.map((reset, i) => (
                    <li key={i} className="p-2 bg-[var(--color-bg-tertiary)]/50 rounded">
                        <span className="font-semibold text-[var(--color-accent-text)]">{new Date(reset.date).toLocaleDateString()}: </span>
                        {reset.situation}
                    </li>
                ))}
            </ul>
        </Card>
        <Card>
            <h3 className="text-xl font-semibold mb-4">Weekly Integrity Checks</h3>
            <ul className="space-y-3">
                {guide.weeklyIntegrityChecks.map((check, i) => (
                    <li key={i} className="p-2 bg-[var(--color-bg-tertiary)]/50 rounded">
                        <div className="flex justify-between items-center mb-1">
                             <p className="font-semibold text-[var(--color-accent-text)]">{new Date(check.date).toLocaleDateString()}</p>
                            <RatingStars rating={check.alignmentScore}/>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)]">{check.notes}</p>
                    </li>
                ))}
            </ul>
        </Card>
    </div>
);

// Learning Resources Component
export const LearningResources: React.FC<{ resources: LearningResourcesType }> = ({ resources }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <h3 className="text-xl font-semibold mb-4">Reading List</h3>
                <ul className="space-y-3">
                    {resources.books.map(book => (
                        <li key={book.title} className="flex items-center justify-between p-2 bg-[var(--color-bg-tertiary)]/50 rounded">
                            <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-[var(--color-text-muted)]">{book.author}</p>
                            </div>
                            {book.isRead ? <CheckCircleIcon className="w-6 h-6 text-[var(--color-success)]"/> : <div className="w-6 h-6 border-2 border-[var(--color-text-subtle)] rounded-full"></div>}
                        </li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-xl font-semibold mb-4">Communities</h3>
                <ul className="space-y-3">
                    {resources.communities.map(comm => (
                        <li key={comm.name} className="flex items-center justify-between p-2 bg-[var(--color-bg-tertiary)]/50 rounded">
                            <p className="font-medium">{comm.name}</p>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-text)]">{comm.engagementLevel}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

// Legacy Map Component
interface LegacyMapProps {
    map: LegacyMapType;
    onUpdateMap: (newMap: LegacyMapType) => void;
}
export const LegacyMap: React.FC<LegacyMapProps> = ({ map, onUpdateMap }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [draftMap, setDraftMap] = useState<LegacyMapType>(map);

    useEffect(() => {
        setDraftMap(map);
    }, [map]);

    const handleSave = () => {
        onUpdateMap(draftMap);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraftMap(map);
        setIsEditing(false);
    };

    const handleArrayChange = (field: 'knownFor' | 'peopleToMentor', index: number, value: string) => {
        const newArray = [...draftMap[field]];
        newArray[index] = value;
        setDraftMap({ ...draftMap, [field]: newArray });
    };

    const handleAddItem = (field: 'knownFor' | 'peopleToMentor') => {
        setDraftMap({ ...draftMap, [field]: [...draftMap[field], ''] });
    };

    const handleRemoveItem = (field: 'knownFor' | 'peopleToMentor', index: number) => {
        const newArray = draftMap[field].filter((_, i) => i !== index);
        setDraftMap({ ...draftMap, [field]: newArray });
    };

    if (isEditing) {
        return (
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Editing My Legacy Map</h3>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white font-bold py-2 px-3 rounded-lg text-sm">Save</button>
                        <button onClick={handleCancel} className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary-hover)] text-white font-bold py-2 px-3 rounded-lg text-sm">Cancel</button>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-[var(--color-accent-text)] mb-2">I want to be known for...</h4>
                        <div className="space-y-2">
                            {draftMap.knownFor.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" value={item} onChange={e => handleArrayChange('knownFor', index, e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]" />
                                    <button onClick={() => handleRemoveItem('knownFor', index)} className="text-red-400 hover:text-red-500 p-1 flex-shrink-0">Delete</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleAddItem('knownFor')} className="mt-2 text-sm text-[var(--color-accent-text)] hover:brightness-90">+ Add Item</button>
                    </div>
                     <div>
                        <h4 className="font-bold text-[var(--color-accent-text)] mb-2">The people I will mentor...</h4>
                        <div className="space-y-2">
                            {draftMap.peopleToMentor.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" value={item} onChange={e => handleArrayChange('peopleToMentor', index, e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]" />
                                    <button onClick={() => handleRemoveItem('peopleToMentor', index)} className="text-red-400 hover:text-red-500 p-1 flex-shrink-0">Delete</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleAddItem('peopleToMentor')} className="mt-2 text-sm text-[var(--color-accent-text)] hover:brightness-90">+ Add Person</button>
                    </div>
                     <div>
                        <h4 className="font-bold text-[var(--color-accent-text)] mb-2">The systemic change I will champion...</h4>
                        <textarea value={draftMap.systemChangeGoal} onChange={e => setDraftMap({...draftMap, systemChangeGoal: e.target.value})} rows={3} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"></textarea>
                    </div>
                    <div>
                        <h4 className="font-bold text-[var(--color-accent-text)] mb-2">Personal Notes</h4>
                        <textarea value={draftMap.personalNotes || ''} onChange={e => setDraftMap({...draftMap, personalNotes: e.target.value})} rows={4} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-text-primary)] focus:ring-[var(--color-accent-primary)] focus:border-[var(--color-accent-primary)]"></textarea>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">My Legacy Map</h3>
                <button onClick={() => setIsEditing(true)} className="bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary-hover)] text-[var(--color-text-primary)] font-bold py-2 px-3 rounded-lg text-sm">Edit</button>
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-[var(--color-accent-text)] mb-1">I want to be known for...</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {map.knownFor.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--color-accent-text)] mb-1">The people I will mentor...</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {map.peopleToMentor.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-[var(--color-accent-text)] mb-1">The systemic change I will champion...</h4>
                    <p className="text-sm">{map.systemChangeGoal}</p>
                </div>
                 {map.personalNotes && (
                    <div className="mt-6 border-t border-[var(--color-border-primary)] pt-4">
                         <h4 className="font-bold text-[var(--color-accent-text)] mb-1">Personal Notes</h4>
                         <p className="text-sm whitespace-pre-wrap">{map.personalNotes}</p>
                    </div>
                 )}
            </div>
        </Card>
    );
};

// --- NEW Achievement System Component ---
export const AchievementSystem: React.FC<{ achievements: AchievementSystemType }> = ({ achievements }) => (
    <div className="space-y-6">
        <Card>
            <h3 className="text-xl font-semibold mb-4">Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {achievements.badges.map(badge => (
                    <div key={badge.id} title={`${badge.name}: ${badge.description}`} className={`flex flex-col items-center p-4 rounded-lg text-center transition-all ${badge.isUnlocked ? 'bg-[var(--color-warning-bg)]' : 'bg-[var(--color-bg-tertiary)]/50'}`}>
                        <span className={`text-5xl ${!badge.isUnlocked && 'opacity-30 grayscale'}`}>{badge.icon}</span>
                        <p className={`mt-2 font-semibold text-sm ${badge.isUnlocked ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]'}`}>{badge.name}</p>
                        {badge.isUnlocked && badge.unlockedDate && <p className="text-xs text-[var(--color-text-subtle)]">{new Date(badge.unlockedDate).toLocaleDateString()}</p>}
                    </div>
                ))}
            </div>
        </Card>
        <Card>
            <h3 className="text-xl font-semibold mb-4">Milestones</h3>
            <div className="space-y-4">
                {achievements.milestones.map(ms => (
                    <div key={ms.id}>
                         <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">{ms.name} ({ms.current}/{ms.target})</span>
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">{Math.round((ms.current / ms.target) * 100)}%</span>
                        </div>
                        <div className="w-full bg-[var(--color-bg-tertiary)] rounded-full h-2.5">
                            <div className="bg-[var(--color-accent-secondary)] h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (ms.current / ms.target) * 100)}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
);

// --- NEW Analytics Dashboard Component ---
const SimpleLineChart: React.FC<{ points: TrendDataPoint[], title: string }> = ({ points, title }) => {
    const width = 500;
    const height = 150;
    const padding = 20;

    if (points.length < 2) return <div className="text-center text-[var(--color-text-subtle)]">{title}: Not enough data to display chart.</div>;

    const values = points.map(p => p.value);
    const minVal = 1; // Assuming rating is 1-5
    const maxVal = 5;

    const getX = (index: number) => padding + (index / (points.length - 1)) * (width - padding * 2);
    const getY = (value: number) => height - padding - ((value - minVal) / (maxVal - minVal)) * (height - padding * 2);

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`).join(' ');

    return (
        <div className="p-4 bg-[var(--color-bg-tertiary)]/50 rounded-lg">
            <h4 className="font-semibold text-[var(--color-accent-text)] mb-2">{title}</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                <path d="M10,10 L50,80 L90,20" stroke="var(--color-accent-primary)" fill="none" strokeWidth="2" />
                {points.map((p, i) => (
                    <circle key={i} cx={getX(i)} cy={getY(p.value)} r="3" fill="var(--color-accent-text)" />
                ))}
            </svg>
        </div>
    );
};

export const AnalyticsDashboard: React.FC<{ analytics: AnalyticsType }> = ({ analytics }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h3 className="text-xl font-semibold mb-4">Trends & Correlations</h3>
                <div className="space-y-6">
                    {analytics.moodTrends.map(trend => (
                        <SimpleLineChart key={trend.name} points={trend.points} title={trend.name} />
                    ))}
                    {analytics.productivityCorrelations.length > 0 && (
                         <div className="p-4 bg-[var(--color-bg-tertiary)]/50 rounded-lg">
                            <h4 className="font-semibold text-[var(--color-accent-text)] mb-2">Productivity Correlations</h4>
                            {analytics.productivityCorrelations.map((corr, i) =>(
                                <div key={i}>
                                    <p className="font-medium">{corr.metricA} & {corr.metricB}</p>
                                    <p className="text-sm text-[var(--color-text-muted)]">{corr.insight}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
        <div>
            <MetricCard title="Habit Formation Rate" value={`${analytics.habitFormationRate}%`} subtext="Based on weekly consistency" />
        </div>
    </div>
);


// --- NEW Author Consultation Hub Component ---
const consultationTiers = [
    {
      tierName: "Quick Question",
      duration: "15 minutes",
      price: "$49",
      bestFor: [
        "Specific technical questions",
        "Clarification on book concepts",
        "Tool implementation guidance"
      ],
    },
    {
      tierName: "Strategy Session", 
      duration: "60 minutes",
      price: "$199",
      bestFor: [
        "Career transformation planning",
        "Practice development strategy",
        "Overcoming specific challenges"
      ],
    },
    {
      tierName: "Deep Dive Intensive",
      duration: "3 hours",
      price: "$497",
      bestFor: [
        "Complete practice overhaul",
        "Legacy and long-term planning",
        "Complex transformation needs"
      ],
    }
];

export const ConsultationHub: React.FC = () => (
    <div className="space-y-8">
        <Card>
            <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)]">Author Consultation Hub</h2>
            <p className="mt-4 text-lg text-center text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                Need personalized guidance on your transformation journey? Book a one-on-one session with the author to accelerate your progress, overcome obstacles, and gain expert insights tailored to your unique situation.
            </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {consultationTiers.map(tier => (
                <Card key={tier.tierName} className="flex flex-col">
                    <h3 className="text-2xl font-bold text-[var(--color-accent-text)]">{tier.tierName}</h3>
                    <div className="my-4">
                        <span className="text-4xl font-extrabold text-[var(--color-text-primary)]">{tier.price}</span>
                        <span className="text-[var(--color-text-muted)]"> / {tier.duration}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] mb-6">
                        {tier.bestFor.map(item => (
                            <li key={item} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-[var(--color-success)] mr-2 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto">
                         <a 
                            href="https://calendly.com/author-placeholder" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Schedule Now
                        </a>
                    </div>
                </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2">
                <Card>
                    <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        With over 20 years of experience at the intersection of law, technology, and professional development, the author has dedicated their career to helping legal professionals not just succeed, but thrive. After transforming their own practice from the ground up, they wrote "The Legal Legend" to share the systems and mindsets that foster sustainable growth and lasting impact. These consultations are an opportunity to apply those principles directly to your career.
                    </p>
                </Card>
            </div>
            <div>
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Success Stories</h3>
                    <div className="space-y-4">
                        <blockquote className="text-sm">
                            <p className="text-[var(--color-text-secondary)]">"The strategy session was a game-changer. I had a clear, actionable plan within an hour that cut through months of confusion."</p>
                            <cite className="mt-2 block font-semibold text-[var(--color-accent-text)] not-italic">- Sarah J., Corporate Counsel</cite>
                        </blockquote>
                         <blockquote className="text-sm">
                            <p className="text-[var(--color-text-secondary)]">"I was stuck on a specific tech implementation, and the 15-minute quick question saved me hours of frustration. Highly recommended."</p>
                            <cite className="mt-2 block font-semibold text-[var(--color-accent-text)] not-italic">- Mark T., Solo Practitioner</cite>
                        </blockquote>
                    </div>
                </Card>
            </div>
        </div>
    </div>
);