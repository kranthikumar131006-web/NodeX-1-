import type { Freelancer, Startup, Hackathon, HackathonTeam } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return {
        url: img?.imageUrl ?? `https://picsum.photos/seed/${id}/200/200`,
        hint: img?.imageHint ?? 'placeholder',
    }
};

export const freelancers: Freelancer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    avatarUrl: getImage('avatar1').url,
    imageHint: getImage('avatar1').hint,
    tagline: 'Full-Stack Developer | React, Node.js, TypeScript',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Node.js', 'UI/UX Design', 'PostgreSQL'],
    availability: 'Available',
    rating: 3,
    bio: 'Creative and detail-oriented full-stack developer with a passion for building intuitive and performant web applications. I thrive in collaborative environments and enjoy bringing ideas to life.',
    reviews: [
        { id: 'r1', name: 'ClientCorp', avatarUrl: getImage('startup1').url, rating: 5, comment: 'Alice delivered exceptional work on our project.' },
    ],
    portfolio: [
        { id: 'p1', title: 'E-commerce Platform', description: 'A full-featured online store with React and Node.js.', imageUrl: getImage('project1').url, imageHint: getImage('project1').hint, githubUrl: '#' },
    ],
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    avatarUrl: getImage('avatar2').url,
    imageHint: getImage('avatar2').hint,
    tagline: 'Mobile & Web UI/UX Designer',
    location: 'New York, NY',
    skills: ['UI/UX Design', 'Figma', 'React Native', 'Prototyping'],
    availability: 'On a project',
    rating: 3,
    bio: 'Designer focused on creating beautiful and user-friendly interfaces. My process is centered around user research and iterative design to solve real-world problems effectively.',
    reviews: [],
    portfolio: [
        { id: 'p2', title: 'Mobile Banking App', description: 'A sleek and secure mobile banking experience.', imageUrl: getImage('project3').url, imageHint: getImage('project3').hint, githubUrl: '#' },
    ],
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    avatarUrl: getImage('avatar3').url,
    imageHint: getImage('avatar3').hint,
    tagline: 'Backend Specialist | Python, Django, DevOps',
    location: 'Austin, TX',
    skills: ['Python', 'Django', 'AWS', 'Docker', 'DevOps'],
    availability: 'Busy',
    rating: 3,
    bio: 'Experienced backend developer with a knack for building scalable and robust systems. I am passionate about clean code, automation, and cloud infrastructure.',
    reviews: [
        { id: 'r2', name: 'Innovate LLC', avatarUrl: getImage('startup2').url, rating: 5, comment: 'Charlie is a world-class engineer.' },
    ],
    portfolio: [
        { id: 'p3', title: 'API for Social App', description: 'A high-performance REST API for a social media application.', imageUrl: getImage('project2').url, imageHint: getImage('project2').hint, githubUrl: '#' },
    ],
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    avatarUrl: getImage('avatar4').url,
    imageHint: getImage('avatar4').hint,
    tagline: 'AI & Machine Learning Engineer',
    location: 'Boston, MA',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'AI'],
    availability: 'Available',
    rating: 4.7,
    bio: 'AI enthusiast with experience in developing machine learning models for computer vision and natural language processing. Eager to tackle challenging problems and contribute to innovative projects.',
    reviews: [],
    portfolio: [
        { id: 'p4', title: 'Image Recognition Model', description: 'A deep learning model for object detection.', imageUrl: getImage('project4').url, imageHint: getImage('project4').hint, githubUrl: '#' },
    ],
  },
];

export const startups: Startup[] = [
  {
    id: 's1',
    name: 'InnovateAI',
    logoUrl: getImage('startup1').url,
    imageHint: getImage('startup1').hint,
    tagline: 'AI-Powered Solutions for Modern Businesses',
    industry: 'Artificial Intelligence',
    location: 'San Francisco, CA',
    foundingYear: 2022,
    yearsInIndustry: 2,
    problem: 'Businesses struggle to leverage their data effectively. Our platform simplifies complex financial data into actionable insights, making smart investing accessible to everyone, regardless of their financial background.',
    solution: 'We provide a suite of AI tools to unlock data-driven insights.',
    vision: 'To empower the next generation with financial freedom through technology, ensuring that every individual has the tools and knowledge to secure their financial future.',
    marketSize: '$1.2 Billion (TAM)',
    contactEmail: 'hello@innovateai.com',
    fundingStage: 'Seed',
    status: 'Funding Open',
    offerings: [
      { name: 'AI Robo-Advisor', description: 'Automated portfolio management tailored to risk profiles.' },
      { name: 'Financial Literacy', description: 'Interactive courses and webinars for users.' },
      { name: 'Market Insights', description: 'Real-time alerts on significant market movements.' },
      { name: 'Secure Wallet', description: 'Encrypted digital wallet for asset storage.' },
    ],
    milestones: [
      { date: 'Aug 2024', description: 'Series A Funding Secured' },
      { date: 'Jan 2024', description: '50k Active Users' },
      { date: 'Jun 2023', description: 'Product Launch Beta' },
    ],
    founders: [
        { id: 'f1', name: 'Frank Green', role: 'CEO', avatarUrl: getImage('avatar5').url, imageHint: getImage('avatar5').hint, bio: 'Ex-Google product manager with a passion for AI.' },
    ],
    team: [
        { id: 't-s1-1', name: 'Elena Rodriguez', role: 'Head of Product', avatarUrl: getImage('avatar8').url, imageHint: getImage('avatar8').hint, bio: 'Product strategist focused on user-centric design.' },
        { id: 't-s1-2', name: 'David Kim', role: 'Lead Developer', avatarUrl: getImage('avatar9').url, imageHint: getImage('avatar9').hint, bio: 'Full-stack wizard building scalable and secure systems.' },
    ],
  },
  {
    id: 's2',
    name: 'FinTech Future',
    logoUrl: getImage('startup2').url,
    imageHint: getImage('startup2').hint,
    tagline: 'Reinventing Personal Finance Management',
    industry: 'FinTech',
    location: 'New York, NY',
    foundingYear: 2020,
    yearsInIndustry: 5,
    problem: 'Personal finance is complex and overwhelming.',
    solution: 'Our app simplifies budgeting and investing with an intuitive UI.',
    vision: 'To make financial wellness achievable for everyone, everywhere.',
    marketSize: '$5 Billion (TAM)',
    contactEmail: 'contact@fintechfuture.com',
    fundingStage: 'Series A',
    status: 'Hiring',
    offerings: [],
    milestones: [],
    founders: [
        { id: 'f2', name: 'Grace Hopper', role: 'CTO', avatarUrl: getImage('avatar6').url, imageHint: getImage('avatar6').hint, bio: 'Pioneering computer scientist and tech visionary.' },
    ],
  },
  {
    id: 's3',
    name: 'HealthSphere',
    logoUrl: getImage('startup3').url,
    imageHint: getImage('startup3').hint,
    tagline: 'Connecting Patients with Personalized Healthcare',
    industry: 'HealthTech',
    location: 'Boston, MA',
    foundingYear: 2023,
    yearsInIndustry: 1,
    problem: 'Access to specialized healthcare is difficult.',
    solution: 'A platform for virtual consultations with top medical experts.',
    vision: 'A world where healthcare is borderless and accessible to all.',
    marketSize: '$3 Billion (TAM)',
    contactEmail: 'info@healthsphere.io',
    fundingStage: 'Pre-Seed',
    status: 'Accepting Partnerships',
    offerings: [],
    milestones: [],
    founders: [
        { id: 'f3', name: 'Henry Ford', role: 'Founder', avatarUrl: getImage('avatar7').url, imageHint: getImage('avatar7').hint, bio: 'Visionary entrepreneur revolutionizing modern health.' },
    ],
  },
];

export const hackathons: Hackathon[] = [
  {
    id: 'h1',
    title: 'AI for Good Hackathon',
    organizer: 'Tech University',
    date: 'October 26-27, 2024',
    location: 'Tech University Campus',
    mode: 'Offline',
    techStack: ['AI', 'Python', 'Web3'],
    prize: '$10,000',
    imageUrl: getImage('hackathon1').url,
    imageHint: getImage('hackathon1').hint,
    description: 'Join us for a weekend of innovation, where you\'ll work with other talented students to build AI-powered solutions for social good. This is a great opportunity to learn, network, and make a real impact.',
    officialUrl: '#',
  },
  {
    id: 'h2',
    title: 'Global FinTech Challenge',
    organizer: 'FinCorp',
    date: 'November 9-10, 2024',
    location: 'Online',
    mode: 'Online',
    techStack: ['FinTech', 'React', 'Node.js'],
    prize: '$25,000',
    imageUrl: getImage('hackathon2').url,
    imageHint: getImage('hackathon2').hint,
    description: 'A global competition to find the most innovative FinTech solutions. If you have a groundbreaking idea that can change the future of finance, this is the place to be.',
    officialUrl: '#',
  },
  {
    id: 'h3',
    title: 'Sustainable Cities Hack',
    organizer: 'GreenTech Foundation',
    date: 'December 1-2, 2024',
    location: 'Innovation Hub, SF',
    mode: 'Offline',
    techStack: ['IoT', 'Data Science', 'UI/UX'],
    prize: 'Eco-friendly gadgets',
    imageUrl: getImage('hackathon3').url,
    imageHint: getImage('hackathon3').hint,
    description: 'Use technology to create a more sustainable future for our cities. This hackathon will focus on challenges related to energy, transportation, and waste management.',
    officialUrl: '#',
  },
];

export const hackathonTeams: HackathonTeam[] = [
    {
        id: 't1',
        name: 'AI Avengers',
        hackathonId: 'h1',
        description: 'Building an AI-powered app to help reduce food waste. We are a balanced team looking for one more member.',
        createdAt: '2024-07-20T10:00:00Z',
        members: [
            { id: 'm1', name: 'Ivy Lee', role: 'Team Lead / Frontend', avatarUrl: getImage('avatar8').url, imageHint: getImage('avatar8').hint },
            { id: 'm2', name: 'Jack Daniels', role: 'Data Scientist', avatarUrl: getImage('avatar9').url, imageHint: getImage('avatar9').hint },
        ],
        lookingFor: [
            { role: 'Backend Developer', skills: ['Node.js', 'Python', 'API Design'] }
        ],
    },
    {
        id: 't2',
        name: 'Code Wizards',
        hackathonId: 'h2',
        description: 'Developing a new P2P payment solution for the FinTech Challenge. We need a creative designer to join us.',
        createdAt: '2024-07-18T14:30:00Z',
        members: [
            { id: 'm3', name: 'Alice Johnson', role: 'Team Lead / Full-Stack', avatarUrl: getImage('avatar1').url, imageHint: getImage('avatar1').hint },
        ],
        lookingFor: [
            { role: 'UI/UX Designer', skills: ['Figma', 'Prototyping'] }
        ],
    }
];

export const availableOpportunities = [
    {
        id: 'opp1',
        title: 'Freelance: Build a landing page for a new SaaS product',
        description: 'We need a skilled React developer to build a responsive and modern landing page. Experience with Tailwind CSS is a plus.',
        skills: ['React', 'Tailwind CSS', 'UI/UX Design'],
    },
    {
        id: 'opp2',
        title: 'Hackathon Team: AI Avengers needs a Backend Developer',
        description: 'Join our team for the AI for Good Hackathon. We are building an app to reduce food waste and need a backend expert to design and build our API.',
        skills: ['Node.js', 'Python', 'API Design', 'PostgreSQL'],
    },
    {
        id: 'opp3',
        title: 'Freelance: Design a mobile app for a fitness startup',
        description: 'Looking for a UI/UX designer to create wireframes and high-fidelity mockups for a new fitness tracking app.',
        skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
    }
];
