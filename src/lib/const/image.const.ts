const PROVIDER_IDS = ["cloudinary"] as const;

export const IMAGES = {
  PROVIDER: {
    IDS: PROVIDER_IDS,
  },
};

export declare namespace IImage {
  type ProviderId = (typeof PROVIDER_IDS)[number];
}
