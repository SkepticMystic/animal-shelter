const PROVIDER_IDS = ["cloudinary"] as const;

export const IMAGES = {
  PROVIDER: {
    IDS: PROVIDER_IDS,
  },

  BLURHASH: {
    COMPONENTS: { X: 4, Y: 4 },
  },
};

export declare namespace IImage {
  type ProviderId = (typeof PROVIDER_IDS)[number];
}
