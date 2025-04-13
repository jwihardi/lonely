export interface Application {
    applicantUsername: string;
    message: string;
    status: string;
    timestamp: string;
}

export interface Listing {
    id: string;
    title: string;
    description: string;
    tags?: string[];
    requirements?: string;
    username: string;
    githubLink?: string;
    groupSize?: number;
    niceToHaves?: string;
    applications?: Application[];
    location?: string;
}