import { PUBLIC_BASE_URL } from "$env/static/public";

export const APP = {
  // NOTE: Intention is that this never changes
  // Currently used to add a fixed key prefix to Redis keys
  ID: "animal-shelter",
  NAME: "Animal Shelter",
  URL: PUBLIC_BASE_URL,
  DOMAIN: new URL(PUBLIC_BASE_URL).hostname,
  LOGO_URL: "https://placehold.co/600x400/png",
  DESCRIPTION: "A simple app to manage an animal shelter",
};
