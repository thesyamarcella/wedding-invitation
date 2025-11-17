// types.ts
export type Rsvp = {
  name: string;
  willAttend: "yes" | "no";
  comment?: string;
  createdAt?: any;
};

export type WeddingConfig = {
  groomName: string;
  brideName: string;
  groomFullName?: string;
  brideFullName?: string;
  groomParents?: string;
  brideParents?: string;
  weddingDate: string;
  displayDate: string;
  akadTime: string;
  receptionTime: string;
  city: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  storyText: string;
  heroImageUrl: string;
  videos: {
    envelope?: string;
    video1?: string;
    video2?: string;
    video3?: string;
  };
  musicUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
