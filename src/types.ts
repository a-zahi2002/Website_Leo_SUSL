export interface Project {
    id: number;
    title: string;
    category: 'Completed' | 'Ongoing' | 'Upcoming';
    description: string;
    image: string;
    committee?: string[];
    date?: string;
    status?: string;
    registrationLink?: string;
}

export interface LeadershipMember {
    id: number; // Added ID for management
    name: string;
    position: string;
    image: string;
    type: 'executive' | 'board'; // To distinguish in the single list if needed, or keep separate arrays
}

export interface GalleryImage {
    id: number;
    src: string;
    alt: string;
}

export interface LeadershipData {
    executive: LeadershipMember[];
    board: LeadershipMember[];
}
