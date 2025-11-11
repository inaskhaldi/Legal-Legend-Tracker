// Achievement System
// Advanced Analytics
export interface UserProfile {
    userId: string;
    name: string;
    startDate: string;
    currentPhase: string;
}

export interface WeeklyReflection {
    weekStartDate: string;
    breakthrough: string;
    improvementArea: string;
    nextWeekFocus: string;
}

export interface DailyLog {
    id: string;
    date: string;
    keyAchievement: string;
    challengeFaced: string;
    lessonLearned: string;
    dailyRating: number;
    weeklyReflection?: WeeklyReflection;
    additionalNotes?: string; // Item-specific notes
}

export interface Tool {
    name: string;
    status: 'Not Started' | 'Exploring' | 'Integrated';
    proficiency: number;
    usageNotes?: string; // Item-specific notes
}

export interface DigitalToolCategory {
    category: string;
    tools: Tool[];
}

export interface RoadmapTask {
    description: string;
    isComplete: boolean;
}

export interface RoadmapWeek {
    weekNumber: number;
    focus: string;
    isComplete: boolean;
    tasks: RoadmapTask[];
    weekNotes?: string; // Item-specific notes
}

export interface RoadmapMonth {
    month: number;
    theme: string;
    weeks: RoadmapWeek[];
}

export interface QuickReset {
    date: string;
    situation: string;
}

export interface WeeklyIntegrityCheck {
    date: string;
    alignmentScore: number; // 1-5
    notes: string;
}

export interface ResilienceGuide {
    quickResets: QuickReset[];
    weeklyIntegrityChecks: WeeklyIntegrityCheck[];
}

export interface Book {
    title: string;
    author: string;
    isRead: boolean;
    dateCompleted?: string;
}

export interface Community {
    name: string;
    isMember: boolean;
    engagementLevel: 'Lurker' | 'Contributor' | 'Leader';
}

export interface LearningResources {
    books: Book[];
    communities: Community[];
}

export interface LegacyMap {
    knownFor: string[];
    peopleToMentor: string[];
    systemChangeGoal: string;
    personalNotes?: string; // Section-specific notes
}

export interface ProgressMetrics {
    currentStreak: number;
    averageDailyRating: number;
    roadmapCompletion: number;
    toolIntegrationScore: number;
    weeklyIntegrityScore: number;
    weeklyConsistency: number;
    overallProgress: number;
    lastUpdated: string;
}

// --- New Achievement System Types ---
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedDate?: string;
}

export interface Milestone {
    id: string;
    name: string;
    target: number;
    current: number;
    isComplete: boolean;
}

export interface Reward {
    id: string;
    name: string;
    description: string;
    isClaimed: boolean;
}

export interface AchievementSystem {
  badges: Badge[];
  milestones: Milestone[];
  rewards: Reward[];
}

// --- New Advanced Analytics Types ---
export interface TrendDataPoint {
    date: string;
    value: number;
}

export interface TrendData {
    name: string;
    points: TrendDataPoint[];
}

export interface Correlation {
    metricA: string;
    metricB: string;
    correlationFactor: number;
    insight: string;
}

export interface Analytics {
  moodTrends: TrendData[];
  productivityCorrelations: Correlation[];
  habitFormationRate: number;
}

// --- App Settings ---
export interface AppSettings {
    theme: 'dark' | 'light' | 'twilight';
}

export interface LegalLegendTrackerData {
    userProfile: UserProfile;
    dailyLogs: DailyLog[];
    digitalTools: DigitalToolCategory[];
    transformationRoadmap: RoadmapMonth[];
    resilienceGuide: ResilienceGuide;
    learningResources: LearningResources;
    legacyMap: LegacyMap;
    progressMetrics: ProgressMetrics;
    achievementSystem: AchievementSystem;
    analytics: Analytics;
    settings: AppSettings;
}