import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? '0' : '2'}>
    {filled ? (
      <path d="M22 23h-6.001a1 1 0 01-1-1v-5.455a2.997 2.997 0 10-5.993 0V22a1 1 0 01-1 1H2a1 1 0 01-1-1V11.582a1 1 0 01.375-.782l10.41-8.336a1 1 0 011.23 0l10.41 8.336a1 1 0 01.375.782V22a1 1 0 01-1 1z" />
    ) : (
      <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997A2.997 2.997 0 0115 16.545V22h7V11.582L12 2 2 11.582V22h7.005v-5.455z" strokeLinejoin="round" />
    )}
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const ExploreIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? '0' : '2'}>
    {filled ? (
      <path d="M14.768 3.663C15.84 4.376 16.81 5.022 17.728 5.67a240.092 240.092 0 003.26 2.235c.744.482 1.092 1.352.888 2.214a120.514 120.514 0 01-1.593 5.46 120.5 120.5 0 01-2.15 5.3c-.355.745-1.137 1.16-1.95 1.043a240.068 240.068 0 01-5.393-.936 240.082 240.082 0 01-5.47-1.243c-.814-.214-1.39-.916-1.49-1.752a120.5 120.5 0 01-.51-5.58 120.51 120.51 0 01-.105-5.615c.04-.83.58-1.55 1.365-1.816a240.087 240.087 0 015.326-1.562 240.078 240.078 0 015.47-1.243c.27-.048.54-.082.81-.103l.58.431zm-2.37 4.28a3.5 3.5 0 10-1.798 6.528 3.5 3.5 0 001.798-6.528z" />
    ) : (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </>
    )}
  </svg>
);

export const InstagramLogoIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export const ReelsIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? '0' : '2'}>
    {filled ? (
      <path d="M2.049 7.947l5.607-3.251-2.823 4.886L2.05 7.947zm7.247-4.185L12 2.154l2.704 1.608-2.704 4.683-2.704-4.683zM16.344 4.696l5.607 3.251-2.784 1.635-2.823-4.886zM2 10.12l3.466 2.012L2 14.144V10.12zm0 6.064l5.607-3.251 2.823 4.886-5.607 3.25L2 16.184zm7.247 4.185L12 21.846l2.704-1.608-2.704-4.683-2.704 4.683h.051zm9.143-2.554l-5.607 3.251 2.823-4.886 2.784 1.635zM22 14.144l-3.466-2.012L22 10.12v4.024zM12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
    ) : (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
        <polygon points="10 8 10 16 16 12 10 8" fill="currentColor" />
      </>
    )}
  </svg>
);

export const MessageIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? '0' : '2'}>
    {filled ? (
      <path d="M12.003 2.001a9.705 9.705 0 110 19.41 10.969 10.969 0 01-2.948-.395l-2.822 1.69a.913.913 0 01-1.364-.763v-2.38a.91.91 0 00-.357-.724A9.705 9.705 0 0112.003 2z" />
    ) : (
      <path d="M22 3L9.218 10.083M22 3l-6.542 17.264L9.218 10.083 22 3zM9.218 10.083L2 12.5l7.218-2.417z" strokeLinejoin="round" />
    )}
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinejoin="round" />
  </svg>
);

export const CommentIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinejoin="round" />
  </svg>
);

export const BookmarkIcon: React.FC<IconProps> = ({ className = '', filled = false }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" strokeLinejoin="round" />
  </svg>
);

export const MoreIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="6" cy="12" r="1.5" />
    <circle cx="18" cy="12" r="1.5" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const GridIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const VerifiedIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="#3897f0">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-6.5 7a.75.75 0 01-1.06.024l-3-2.85a.75.75 0 011.036-1.088l2.453 2.33 5.98-6.44a.75.75 0 011.091 1.024z" />
  </svg>
);

export const EmojiIcon: React.FC<IconProps> = ({ className = '' }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
