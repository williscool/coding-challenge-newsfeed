export type Announcement = {
    id: number;
    title: string;
    body: string;
    fellowship: "founders" | "angels" | "writers" | "all";
    avatar_url: string;
    projects: Project[];
}

export type User = {
    id: number;
    name: string;
    bio: string;
    fellowship: "founders" | "angels" | "writers";
    avatar_url: string;
    projects: Project[];
}

export type Project = {
    id: number;
    name: string;
    description: string;
    icon_url: string;
    users: User[];
  }