import { createTamagui } from "@tamagui/core";

import { fonts, media, themes, tokens } from "./mapTokens";

export const tamaguiConfig = createTamagui({
  tokens,
  themes,
  fonts,
  media,
  settings: {
    defaultFont: "body",
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Tamagui module augmentation
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
