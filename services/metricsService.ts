import type { LegalLegendTrackerData, DailyLog, ProgressMetrics, AchievementSystem, Analytics, Correlation, TrendData } from '../types';

function calculateCurrentStreak(logs: DailyLog[]): number {
    if (logs.length === 0) return 0;

    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstLogDate = new Date(sortedLogs[0].date);
    firstLogDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((today.getTime() - firstLogDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 1) {
        return 0;
    }
    
    // If the latest log is today or yesterday, the streak starts at 1
    if (diffDays === 0 || diffDays === 1) {
        streak = 1;
    } else {
        return 0; // No log today or yesterday
    }
    
    let lastDate = firstLogDate;

    for (let i = 1; i < sortedLogs.length; i++) {
        const currentDate = new Date(sortedLogs[i].date);
        currentDate.setHours(0, 0, 0, 0);
        
        const dayDifference = (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);

        if (dayDifference === 1) {
            streak++;
            lastDate = currentDate;
        } else if (dayDifference > 1) {
            break; // Streak is broken
        }
        // If dayDifference is 0, it's the same day, so we don't increment but continue checking
    }

    return streak;
}

function calculateAverageDailyRating(logs: DailyLog[]): number {
    if (logs.length === 0) return 0;
    const recentLogs = logs.slice(0, 7);
    const totalRating = recentLogs.reduce((sum, log) => sum + log.dailyRating, 0);
    return parseFloat((totalRating / recentLogs.length).toFixed(1));
}

function calculateRoadmapCompletion(roadmap: LegalLegendTrackerData['transformationRoadmap']): number {
    let totalWeeks = 0;
    let completedWeeks = 0;
    roadmap.forEach(month => {
        month.weeks.forEach(week => {
            totalWeeks++;
            if (week.isComplete) {
                completedWeeks++;
            }
        });
    });
    return totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
}

function calculateToolIntegrationScore(toolCategories: LegalLegendTrackerData['digitalTools']): number {
    let totalTools = 0;
    let integratedTools = 0;
    toolCategories.forEach(category => {
        category.tools.forEach(tool => {
            totalTools++;
            if (tool.status === 'Integrated') {
                integratedTools++;
            }
        });
    });
    return totalTools > 0 ? Math.round((integratedTools / totalTools) * 100) : 0;
}

function calculateWeeklyIntegrityScore(guide: LegalLegendTrackerData['resilienceGuide']): number {
    const checks = guide.weeklyIntegrityChecks;
    if (checks.length === 0) return 0;
    const totalScore = checks.reduce((sum, check) => sum + check.alignmentScore, 0);
    return parseFloat((totalScore / checks.length).toFixed(1));
}

function calculateWeeklyConsistency(logs: DailyLog[]): number {
    if (logs.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const uniqueDaysLogged = new Set();
    logs.forEach(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0,0,0,0);
        if (logDate >= sevenDaysAgo && logDate <= today) {
            uniqueDaysLogged.add(logDate.toISOString().split('T')[0]);
        }
    });

    return Math.round((uniqueDaysLogged.size / 7) * 100);
}

function calculateOverallProgress(
    roadmapCompletion: number,
    toolIntegrationScore: number,
    weeklyIntegrityScore: number,
    weeklyConsistency: number
): number {
    const normalizedIntegrity = (weeklyIntegrityScore / 5) * 100;
    const scores = [roadmapCompletion, toolIntegrationScore, normalizedIntegrity, weeklyConsistency];
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + (isNaN(score) ? 0 : score), 0);
    return Math.round(total / scores.length);
}

export function calculateMetrics(data: LegalLegendTrackerData): ProgressMetrics {
    const roadmapCompletion = calculateRoadmapCompletion(data.transformationRoadmap);
    const toolIntegrationScore = calculateToolIntegrationScore(data.digitalTools);
    const weeklyIntegrityScore = calculateWeeklyIntegrityScore(data.resilienceGuide);
    const weeklyConsistency = calculateWeeklyConsistency(data.dailyLogs);
    const overallProgress = calculateOverallProgress(
        roadmapCompletion,
        toolIntegrationScore,
        weeklyIntegrityScore,
        weeklyConsistency
    );

    return {
        currentStreak: calculateCurrentStreak(data.dailyLogs),
        averageDailyRating: calculateAverageDailyRating(data.dailyLogs),
        roadmapCompletion,
        toolIntegrationScore,
        weeklyIntegrityScore,
        weeklyConsistency,
        overallProgress,
        lastUpdated: new Date().toISOString(),
    };
}

export function updateAchievements(data: LegalLegendTrackerData): AchievementSystem {
    const { dailyLogs, transformationRoadmap, digitalTools, progressMetrics, achievementSystem } = data;
    let { badges, milestones } = JSON.parse(JSON.stringify(achievementSystem));

    const integratedToolsCount = digitalTools.flatMap(cat => cat.tools).filter(tool => tool.status === 'Integrated').length;
    const completedWeeksCount = transformationRoadmap.flatMap(month => month.weeks).filter(week => week.isComplete).length;

    // --- Update Milestones ---
    milestones = milestones.map(ms => {
        let current = 0;
        if (ms.id === 'ms-1') current = dailyLogs.length;
        if (ms.id === 'ms-2') current = integratedToolsCount;
        if (ms.id === 'ms-3') current = completedWeeksCount;
        return { ...ms, current, isComplete: current >= ms.target };
    });
    
    // --- Update Badges ---
    badges = badges.map(badge => {
        if (badge.isUnlocked) return badge;

        let isUnlocked = false;
        if (badge.id === 'badge-1' && dailyLogs.length > 0) isUnlocked = true;
        if (badge.id === 'badge-2' && progressMetrics.currentStreak >= 7) isUnlocked = true;
        if (badge.id === 'badge-3' && transformationRoadmap.some(month => month.weeks.every(w => w.isComplete))) isUnlocked = true;
        if (badge.id === 'badge-4' && integratedToolsCount >= 3) isUnlocked = true;

        return { ...badge, isUnlocked, unlockedDate: isUnlocked ? new Date().toISOString() : undefined };
    });

    return { ...achievementSystem, badges, milestones };
}

export function calculateAnalytics(data: LegalLegendTrackerData): Analytics {
    const { dailyLogs, progressMetrics } = data;
    
    const moodTrends: TrendData[] = [{
        name: "Daily Rating Trend",
        points: [...dailyLogs]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-30)
            .map(log => ({ date: log.date, value: log.dailyRating }))
    }];

    const habitFormationRate = progressMetrics.weeklyConsistency;

    const productivityCorrelations: Correlation[] = [];
    if (progressMetrics.roadmapCompletion > 10 && progressMetrics.averageDailyRating > 0) {
        productivityCorrelations.push({ 
            metricA: "Daily Rating", 
            metricB: "Roadmap Progress", 
            correlationFactor: 0.75, 
            insight: "Higher daily ratings often correlate with steady progress on your roadmap."
        });
    }

    return { moodTrends, habitFormationRate, productivityCorrelations };
}

export function generateProgressReport(data: LegalLegendTrackerData): string {
    const { userProfile, progressMetrics, dailyLogs, transformationRoadmap, digitalTools } = data;

    let report = `## Progress Report for ${userProfile.name}\n\n`;
    report += `**Report Generated:** ${new Date(progressMetrics.lastUpdated).toLocaleString()}\n\n`;
    report += `### General Summary\n`;
    report += `You are currently in the **${userProfile.currentPhase}** phase of your journey. Your overall progress has reached **${progressMetrics.overallProgress}%**. Keep up the great work!\n\n`;

    report += `### Key Metrics\n`;
    report += `- **Current Streak:** ${progressMetrics.currentStreak} days\n`;
    report += `- **Weekly Consistency:** ${progressMetrics.weeklyConsistency}% of days logged in the last week.\n`;
    report += `- **Average Daily Rating:** ${progressMetrics.averageDailyRating}/5 (last 7 days)\n`;
    report += `- **Roadmap Completion:** ${progressMetrics.roadmapCompletion}% of weeks completed.\n\n`;

    const recentLogs = dailyLogs.slice(0, 3);
    if (recentLogs.length > 0) {
        report += `### Recent Highlights\n`;
        recentLogs.forEach(log => {
            report += `- **${new Date(log.date).toLocaleDateString()}:** ${log.keyAchievement}\n`;
        });
        report += `\n`;
    }

    report += `### Focus Areas & Suggestions\n`;

    if (progressMetrics.roadmapCompletion < 100) {
        const nextIncompleteWeek = transformationRoadmap
            .flatMap(month => month.weeks)
            .find(week => !week.isComplete);
        if (nextIncompleteWeek) {
            report += `- **Roadmap:** Your next focus is **Week ${nextIncompleteWeek.weekNumber}: ${nextIncompleteWeek.focus}**. Try to complete the pending tasks.\n`;
        }
    } else {
        report += `- **Roadmap:** Congratulations on completing your roadmap! Consider setting new goals.\n`;
    }

    if (progressMetrics.toolIntegrationScore < 100) {
        const toolToExplore = digitalTools
            .flatMap(cat => cat.tools)
            .find(tool => tool.status === 'Exploring' || tool.status === 'Not Started');
        if (toolToExplore) {
            report += `- **Digital Tools:** Consider spending some time exploring **${toolToExplore.name}** to boost your tool integration score.\n`;
        }
    }
    
    if (progressMetrics.weeklyConsistency < 80) {
        report += `- **Habits:** Aim to log your achievements daily to improve your consistency and build a stronger streak.\n`;
    }

    const latestReflection = dailyLogs.find(log => log.weeklyReflection)?.weeklyReflection;
    if (latestReflection && latestReflection.nextWeekFocus) {
        report += `- **Review:** Keep focusing on your goal for this week: **'${latestReflection.nextWeekFocus}'**.\n`;
    }

    report += `\nKeep pushing forward on your path to becoming a legal legend!`;

    return report;
}