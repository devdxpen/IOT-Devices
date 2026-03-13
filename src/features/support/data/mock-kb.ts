export interface KBArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  updatedAt: string;
  readTime: string;
}

export interface KBCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  articleCount: number;
  articles: KBArticle[];
}

export const mockKBCategories: KBCategory[] = [
  {
    id: "cat-1",
    title: "Getting Started",
    slug: "getting-started",
    description: "Learn the basics of using IOT-Devices platform.",
    icon: "Zap",
    articleCount: 3,
    articles: [
      {
        id: "gs-1",
        title: "Platform Overview",
        excerpt: "A high-level look at the IOT-Devices architecture and core features.",
        content: "Detailed content about the platform...",
        author: "Sarah Connor",
        updatedAt: "2 months ago",
        readTime: "5 min",
      },
      {
        id: "gs-2",
        title: "Initial Account Setup",
        excerpt: "How to configure your organization and invite your first team members.",
        content: "Step by step guide to setup...",
        author: "Alex River",
        updatedAt: "1 month ago",
        readTime: "3 min",
      },
      {
        id: "gs-3",
        title: "Understanding the Dashboard",
        excerpt: "Navigate through widgets, analytics, and device controls.",
        content: "Exploring the dashboard components...",
        author: "John Wick",
        updatedAt: "3 weeks ago",
        readTime: "8 min",
      },
    ],
  },
  {
    id: "cat-2",
    title: "Device Configuration",
    slug: "device-config",
    description: "Guides on setting up and managing your hardware.",
    icon: "Cpu",
    articleCount: 2,
    articles: [
      {
        id: "dc-1",
        title: "Connecting Your First Gateway",
        excerpt: "Follow these steps to link your physical gateway to the cloud portal.",
        content: "Hardware connection details...",
        author: "Sarah Connor",
        updatedAt: "1 week ago",
        readTime: "10 min",
      },
      {
        id: "dc-2",
        title: "Configuring Alert Thresholds",
        excerpt: "Set up high and low limits for your sensors to trigger notifications.",
        content: "Threshold logic and settings...",
        author: "Alex River",
        updatedAt: "2 days ago",
        readTime: "6 min",
      },
    ],
  },
  {
      id: "cat-3",
      title: "Security & Permissions",
      slug: "security",
      description: "Best practices for keeping your devices safe.",
      icon: "Shield",
      articleCount: 1,
      articles: [
          {
              id: "sec-1",
              title: "Managing User Roles",
              excerpt: "Learn the difference between Admin, Manager, and Viewer roles.",
              content: "RBAC system explanation...",
              author: "John Wick",
              updatedAt: "3 months ago",
              readTime: "4 min",
          }
      ]
  }
];
