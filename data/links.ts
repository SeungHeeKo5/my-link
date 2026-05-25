export interface LinkItemData {
  id: string;
  title: string;
  url: string;
  icon: string;
  updateAt?: number;
}

export const dummyLinks: LinkItemData[] = [
  {
    id: "link-1",
    title: "Instagram",
    url: "https://instagram.com",
    icon: "Instagram",
  },
  {
    id: "link-2",
    title: "YouTube",
    url: "https://youtube.com",
    icon: "Youtube",
  },
  {
    id: "link-3",
    title: "Blog",
    url: "https://velog.io",
    icon: "BookOpen",
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com/SeungHeeKo5",
    icon: "Github",
  },
  {
    id: "link-5",
    title: "Portfolio",
    url: "https://github.com/SeungHeeKo5/my-link",
    icon: "Briefcase",
  },
];
