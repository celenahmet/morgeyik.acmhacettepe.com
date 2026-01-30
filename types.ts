
export type Language = 'TR' | 'EN';

export interface EventHighlight {
  label: { TR: string; EN: string };
  iconType: 'music' | 'brain' | 'zap' | 'smile' | 'flame' | 'mic' | 'target' | 'star' | 'users' | 'clapperboard';
}

export interface EventData {
  year: string;
  guest: string;
  description: {
    TR: string;
    EN: string;
  };
  bio?: {
    TR: string;
    EN: string;
  };
  imageUrl: string;
  industry?: { TR: string; EN: string };
  highlights?: EventHighlight[];
  imagePosition?: string;
}

export interface VlogData {
  id: string;
  title: {
    TR: string;
    EN: string;
  };
}

export interface OrganizerData {
  period: string;
  names: string[];
}

export interface TranslationSchema {
  nav: {
    program: string;
    about: string;
    awards: string;
    events: string;
    vlogs: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    ctaPast: string;
    ctaGuests: string;
  };
  about: {
    title: string;
    content: string;
    acmTitle: string;
    acmContent: string;
  };
  awards: {
    title: string;
    description: string;
  };
  pastEvents: {
    title: string;
    close: string;
  };
  vlogs: {
    title: string;
    badge: string;
    cardLabel: string;
    cta: string;
  };
  organizers: {
    title: string;
    description: string;
  };
  support: {
    title: string;
    subtitle: string;
    guestTitle: string;
    guestDesc: string;
    guestCta: string;
    sponsorTitle: string;
    sponsorDesc: string;
    sponsorCta: string;
  };
  contact: {
    title: string;
    formName: string;
    formEmail: string;
    formSubject: string;
    formMessage: string;
    formSubmit: string;
    subjects: {
      guest: string;
      sponsor: string;
      general: string;
    };
    ecosystemTitle: string;
    socialTitle: string;
    techTitle: string;
    events: {
      gelisim: string;
      sms: string;
      acsdays: string;
      hujam: string;
      huprog: string;
    };
  };
  footer: {
    arrangedBy: string;
    description: string;
    explore: string;
    info: string;
    getInvolved: string;
    rights: string;
  };
}
