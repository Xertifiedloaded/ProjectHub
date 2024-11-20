export interface Project {
    id: string;
    title: string;
    description: string;
    author: string;
    authorAvatar: string;
    year: number;
    tags: string[];
    downloadUrl: string;
    category: string;
    downloads: number;
    likes: number;
    thumbnail: string;
  }
  
  export interface ProjectCardProps {
    project: Project;
  }
  
 export  interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    description: string;
  }
  
  export interface ProjectMetadataProps {
    data: {
      title: string;
      description: string;
      year: number;
      category: string;
      tags: string[];
      files: File[]; 
      thumbnail?: File;
    };
    onUpdate: (data: Partial<{
      title: string;
      description: string;
      year: number;
      category: string;
      tags: string[];
      files: File[]; 
      thumbnail?: File;
    }>) => void;
  }
  
  