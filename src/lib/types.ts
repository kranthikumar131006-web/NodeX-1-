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
  name: string;
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
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  imageHint: string;
};

export type Startup = {
  id: string;
  name: string;
  logoUrl: string;
  imageHint: string;
  tagline: string;
  industry: string;
  problem: string;
  solution: string;
  fundingStage: string;
  status: 'Hiring' | 'Funding Open' | 'Accepting Partnerships';
  founders: TeamMember[];
};

export type Hackathon = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  mode: 'Online' | 'Offline';
  techStack: string[];
  prize: string;
  imageUrl: string;
  imageHint: string;
};

export type HackathonTeam = {
  id: string;
  name: string;
  hackathonId: string;
  description: string;
  members: TeamMember[];
  lookingFor: { role: string; skills: string[] }[];
};
