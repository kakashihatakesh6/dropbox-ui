export interface DesignSystemProps {
  initialCenterItem?: string | null;
  entranceAnimation?: boolean;
  scrollProgress?: number;
  logoBounds?: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  initialScrollValue?: number;
}

export interface DesignSystemItem {
  id: string;
  title: string;
  bgColor: string;
  textColor: string;
  content: React.ReactNode;
  expandedContent: React.ReactNode;
} 