import { asset } from "$app/paths";
import { PUBLIC_BASE_URL } from "$env/static/public";

export const APP = {
  // NOTE: Intention is that this never changes
  // Currently used to add a fixed key prefix to Redis keys
  ID: "animal-shelter",
  NAME: "Rescued",
  URL: PUBLIC_BASE_URL,
  LOGO: asset("/favicon.svg"),
  DOMAIN: new URL(PUBLIC_BASE_URL).hostname,
  DESCRIPTION: "Helping animals find their forever homes.",
};
