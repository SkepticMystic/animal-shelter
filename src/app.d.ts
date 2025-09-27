declare global {
  namespace App {
    interface PageData {
      seo?: {
        title: string;
        image?: string | null;
        description?: string | null;
      };
    }

    interface Error {
      message: string;
      status?: number;
      // Comes from StandardSchema.Issue.path
      path?: readonly (PropertyKey | { key: PropertyKey })[];
      level?: "error" | "warning";
    }

    namespace Superforms {
      type Message = import("$lib/interfaces/index").Result<
        string | undefined,
        string | undefined
      >;
    }
  }
}

export {};
