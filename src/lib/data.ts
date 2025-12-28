import type { Freelancer, Startup, Hackathon, HackathonTeam } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    return {
        url: img?.imageUrl ?? `https://picsum.photos/seed/${id}/200/200`,
        hint: img?.imageHint ?? 'placeholder',
    }
};

export const freelancers: Freelancer[] = [];

export const startups: Startup[] = [];

export const hackathons: Hackathon[] = [];

export const hackathonTeams: HackathonTeam[] = [];

export const availableOpportunities = [];
