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
    // Matches size-4 of Icon.svelte
    ICON: {
      width: 16,
      height: 16,
    },
    AVATAR: {
      width: 32,
      height: 32,
    },
    THUMBNAIL: {
      width: 155,
      height: 155,
    },
    PREVIEW: {
      width: 300,
      height: 300,
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
