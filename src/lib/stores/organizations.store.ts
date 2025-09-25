import { BetterAuthClient } from "$lib/auth-client";
import { get_active_shelter_remote } from "$lib/remote/shelter.remote";

export const organizations = BetterAuthClient.useListOrganizations();

export const organization = BetterAuthClient.useActiveOrganization();

organization.subscribe((org) => {
  if (org.isPending) {
    return console.log("$org.isPending");
  } else if (org.isRefetching) {
    return console.log("$org.isRefetching");
  } else if (!org.data) {
    console.log("No organization selected, clearing shelter");
    get_active_shelter_remote().set(null);
  } else {
    console.log("Organization changed, refreshing shelter");
    get_active_shelter_remote().refresh();
  }
});
