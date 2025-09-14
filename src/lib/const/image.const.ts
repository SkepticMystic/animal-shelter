const PROVIDER_IDS = ["cloudinary"] as const;

export const IMAGES = {
  PROVIDER: {
    IDS: PROVIDER_IDS,
  },

  BLURHASH: {
    COMPONENTS: { X: 4, Y: 4 },
  },

  LIMITS: {
    MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // Megabytes

    MAX_COUNT: {
      PER_RESOURCE: 10,
    },
  },

  SIZES: {
    AVATAR: {
      width: 40,
      height: 40,
    },
    THUMBNAIL: {
      width: 150,
      height: 150,
    },
    PREVIEW: {
      width: 400,
      height: 400,
    },
    FULL: {
      width: 800,
      height: 800,
    },
  } satisfies Record<string, { width: number; height: number }>,
};

export declare namespace IImage {
  type ProviderId = (typeof PROVIDER_IDS)[number];
}
