import type { LegalLegendTrackerData } from './types';

export const initialData: LegalLegendTrackerData = {
    userProfile: {
        userId: "user-123",
        name: "Alex Chen",
        startDate: "2024-07-01",
        currentPhase: "Month 1: Foundation"
    },
    dailyLogs: [
        { id: "log-1", date: "2024-07-29", keyAchievement: "Drafted a complex legal memo.", challengeFaced: "Unexpected client request.", lessonLearned: "Prioritization is key.", dailyRating: 4, additionalNotes: "This memo could be a template for future work." },
        { id: "log-2", date: "2024-07-28", keyAchievement: "Completed a major research project.", challengeFaced: "Distractions at home.", lessonLearned: "Time-blocking is effective.", dailyRating: 5, additionalNotes: "" },
        { id: "log-3", date: "2024-07-27", keyAchievement: "Mentored a junior associate.", challengeFaced: "Balancing my own workload.", lessonLearned: "Delegation is a skill to build.", dailyRating: 4, additionalNotes: "" },
        { id: "log-4", date: "2024-07-25", keyAchievement: "Negotiated a favorable settlement term.", challengeFaced: "Opposing counsel was difficult.", lessonLearned: "Patience and persistence pay off.", dailyRating: 5,
          weeklyReflection: {
            weekStartDate: "2024-07-22",
            breakthrough: "Finally understood a complex area of contract law.",
            improvementArea: "Need to improve my email management.",
            nextWeekFocus: "Implement the 'Inbox Zero' technique."
          },
          additionalNotes: "Felt a real sense of accomplishment after this negotiation."
        },
    ],
    digitalTools: [
        {
            category: "Legal Research",
            tools: [
                { name: "Westlaw Edge", status: "Integrated", proficiency: 5, usageNotes: "The KeyCite feature is invaluable for checking case validity." },
                { name: "LexisNexis Advanced", status: "Exploring", proficiency: 3, usageNotes: "" },
                { name: "Casetext", status: "Not Started", proficiency: 1, usageNotes: "Heard good things about its CARA A.I. feature." }
            ]
        },
        {
            category: "Practice Management",
            tools: [
                { name: "Clio", status: "Integrated", proficiency: 4, usageNotes: "Excellent for time tracking and billing." },
                { name: "MyCase", status: "Not Started", proficiency: 1, usageNotes: "" }
            ]
        },
        {
            category: "Communication & Collaboration",
            tools: [
                { name: "Slack", status: "Integrated", proficiency: 5, usageNotes: "" },
                { name: "Microsoft Teams", status: "Exploring", proficiency: 2, usageNotes: "" }
            ]
        }
    ],
    transformationRoadmap: [
        {
            month: 1,
            theme: "Foundation & Systems",
            weeks: [
                { weekNumber: 1, focus: "Goal Setting & Habit Formation", isComplete: true, tasks: [{description: "Define 90-day goals", isComplete: true}], weekNotes: "This week set a strong tone for the quarter." },
                { weekNumber: 2, focus: "Digital Tool Integration", isComplete: true, tasks: [{description: "Master one new tool", isComplete: true}], weekNotes: "" },
                { weekNumber: 3, focus: "Time Management Mastery", isComplete: false, tasks: [{description: "Implement time-blocking", isComplete: true}, {description: "Conduct weekly review", isComplete: false}], weekNotes: "Still struggling with the weekly review habit." },
                { weekNumber: 4, focus: "Building Resilience", isComplete: false, tasks: [{description: "Practice quick resets", isComplete: false}], weekNotes: "" }
            ]
        },
        {
            month: 2,
            theme: "Growth & Expertise",
            weeks: [
                { weekNumber: 5, focus: "Deepening Legal Knowledge", isComplete: false, tasks: [], weekNotes: "" },
                { weekNumber: 6, focus: "Networking & Mentorship", isComplete: false, tasks: [], weekNotes: "" }
            ]
        }
    ],
    resilienceGuide: {
        quickResets: [
            { date: "2024-07-29", situation: "Overwhelmed with emails after lunch." },
            { date: "2024-07-25", situation: "Frustrating call with opposing counsel." }
        ],
        weeklyIntegrityChecks: [
            { date: "2024-07-26", alignmentScore: 4, notes: "Mostly aligned, but spent too much time on low-priority tasks." },
            { date: "2024-07-19", alignmentScore: 3, notes: "Felt out of sync with my weekly goals due to unexpected demands." }
        ]
    },
    learningResources: {
        books: [
            { title: "Getting to Yes", author: "Roger Fisher & William Ury", isRead: true, dateCompleted: "2024-07-15" },
            { title: "Deep Work", author: "Cal Newport", isRead: false }
        ],
        communities: [
            { name: "Lawyers on Fire", isMember: true, engagementLevel: "Contributor" },
            { name: "Local Bar Association Tech Committee", isMember: false, engagementLevel: "Lurker" }
        ]
    },
    legacyMap: {
        knownFor: [
            "Being a thought leader in Intellectual Property law.",
            "Mentoring the next generation of ethical lawyers.",
            "Innovating legal practice through technology."
        ],
        peopleToMentor: ["Junior associates at my firm", "Law students from my alma mater"],
        systemChangeGoal: "To advocate for clearer, more accessible legal language in contracts.",
        personalNotes: "Reflecting on my legacy helps keep the daily grind in perspective. It's the 'why' behind the work."
    },
    progressMetrics: {
        currentStreak: 0,
        averageDailyRating: 0,
        roadmapCompletion: 0,
        toolIntegrationScore: 0,
        weeklyIntegrityScore: 0,
        weeklyConsistency: 0,
        overallProgress: 0,
        lastUpdated: "",
    },
    achievementSystem: {
        badges: [
            { id: 'badge-1', name: "First Achievement", description: "Log your first daily achievement.", icon: "🎉", isUnlocked: false },
            { id: 'badge-2', name: "Consistent Contender", description: "Log entries for 7 consecutive days.", icon: "🗓️", isUnlocked: false },
            { id: 'badge-3', name: "Roadmap Rockstar", description: "Complete a full month in the roadmap.", icon: "🚀", isUnlocked: false },
            { id: 'badge-4', name: "Tool Titan", description: "Integrate 3 digital tools.", icon: "🛠️", isUnlocked: false },
        ],
        milestones: [
            { id: 'ms-1', name: "Log 10 Daily Entries", target: 10, current: 0, isComplete: false },
            { id: 'ms-2', name: "Integrate 5 Digital Tools", target: 5, current: 0, isComplete: false },
            { id: 'ms-3', name: "Complete 5 Roadmap Weeks", target: 5, current: 0, isComplete: false },
        ],
        rewards: []
    },
    analytics: {
        moodTrends: [
            {
                name: "Daily Rating Trend",
                points: []
            }
        ],
        productivityCorrelations: [],
        habitFormationRate: 0
    },
    settings: {
        theme: 'dark'
    }
};