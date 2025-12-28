

export type Review = {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  comment: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  githubUrl?: string;
};

export type Freelancer = {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  imageHint: string;
  tagline: string;
  location: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'On a project';
  rating: number;
  reviews: Review[];
  portfolio: Project[];
  bio: string;
  isFreelancing: boolean;
  education: {
    university: string;
    degree: string;
    years: string;
    current: boolean;
  };
  certifications: {
    name: string;
    issuer: string;
    date: string;
    credentialUrl: string;
    logo: string;
  }[];
  socials: {
    resumeUrl: string;
    portfolioUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
  };
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  imageHint: string;
  email?: string;
  bio?: string;
  skills?: string[];
};

export type Startup = {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  imageHint?: string;
  tagline: string;
  industry: string;
  location: string;
  foundingYear: number;
  yearsInIndustry: number;
  problem: string;
  solution: string;
  vision: string;
  marketSize: string;
  contactEmail: string;
  offerings: { name: string; description: string }[];
  milestones: { date: string; description: string }[];
  fundingStage: string;
  status: 'Hiring' | 'Funding Open' | 'Accepting Partnerships';
  founders: TeamMember[];
  team?: TeamMember[];
};

export type Hackathon = {
  id: string;
  userId: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  mode: 'Online' | 'Offline';
  techStack: string[];
  prize: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  officialUrl: string;
};

export type HackathonTeam = {
  id: string;
  name: string;
  hackathonId: string;
  description: string;
  teamSize: number;
  createdAt: any; // Can be Date or FieldValue
  members: TeamMember[];
  memberIds: string[];
  lookingFor: { role: string; skills: string[] }[];
};
