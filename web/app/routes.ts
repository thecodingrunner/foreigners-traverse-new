import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  ...prefix(":lang?", [
    layout("routes/locale-layout.tsx", [
      index("routes/home.tsx"),
    //   route("journal", "routes/journal.tsx"),
    //   route("journal/:slug", "routes/stage.tsx"),
    //   route("explore/:stage?", "routes/explore.tsx"),
    //   route("about", "routes/about.tsx"),
    ]),
  ]),
] satisfies RouteConfig;