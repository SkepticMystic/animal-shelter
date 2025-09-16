import type { ResolvedPathname } from "$app/types";
import { APP } from "$lib/const/app";
import type { IToast } from "$lib/const/toast.const";
import type { Branded, PartiallyTypedObject } from "$lib/interfaces";
import { Url } from "./urls";

const full_url = (
  path: ResolvedPathname | Branded<"RouteId">,
  search?: Record<string, unknown>,
) => Url.build(APP.URL, path, search);

export const App = {
  full_url,

  url: (
    path: ResolvedPathname | Branded<"RouteId">,
    search?: PartiallyTypedObject<{
      toast?: IToast.Id;
      redirect_uri?: ResolvedPathname;
    }> & {
      [key: string]: unknown;
    },
  ) => Url.strip_origin(full_url(path, search)),
};
