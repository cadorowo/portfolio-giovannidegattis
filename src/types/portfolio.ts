export type CardType = 'project' | 'snippet' | 'retired';

export type CategoryType = 'design' | 'systems';

export interface CardItem {
  id: string;
  type: CardType;
  category?: CategoryType | CategoryType[];
  inAll: boolean;
  href: string;
  isExternal: boolean;
  title: string;
  tag: string;
  year?: string;
  videoWebm?: string | null;
  videoMp4?: string | null;
  imgSrc?: string | null;
  listImgSrc?: string | null;
  imgAlt?: string;
  aspectRatio?: string;
  span?: 'col' | 'full';
  objectPosition?: string;
  autoPlayVideo?: boolean;
  hoverOverlay?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
}

export type FilterValue = 'all' | CategoryType;
