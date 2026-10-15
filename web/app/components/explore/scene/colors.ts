import { Color, SRGBColorSpace, Vector4 } from "three";

/** A design token as three.js needs it: a linear colour plus its own alpha. */
export type SceneColor = { color: Color; alpha: number };

/**
 * "#C9573F" or "rgba(252, 251, 246, 0.4)" → SceneColor.
 * three's Color ignores alpha, so rgba() is split by hand. setRGB(…, SRGBColorSpace)
 * converts the sRGB numbers from CSS into the linear values shaders work in.
 */
function parse(value: string): SceneColor {
  // The production CSS minifier rewrites rgba(…) as hex with alpha (#rrggbbaa),
  // which three's Color can't read: it warns and falls back to opaque white.
  const hex = value.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join(""); // #rgb(a) → #rrggbb(aa)
    const alpha = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return { color: new Color(`#${h.slice(0, 6)}`), alpha };
  }

  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (!rgba) return { color: new Color(value), alpha: 1 };
  const [r, g, b, a = 1] = rgba[1].split(/[\s,/]+/).filter(Boolean).map(Number);
  return { color: new Color().setRGB(r / 255, g / 255, b / 255, SRGBColorSpace), alpha: a };
}

/**
 * The same colour back in sRGB numbers, for shaders that blend like CSS does.
 * Blending in linear space makes overlays far stronger than in the mockup:
 * 18% white over a dark grey is a subtle line in sRGB but a bright one in linear.
 */
export const toSRGB = ({ color }: SceneColor) => color.clone().convertLinearToSRGB();

/** sRGB rgb + alpha in one uniform, for tokens like --contour-minor */
export const toSRGBA = (token: SceneColor) => {
    const { r, g, b } = toSRGB(token);
    return new Vector4(r, g, b, token.alpha);
}

/** WebGL can't read CSS variables, so resolve the design tokens once. */
export function readSceneColors() {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => parse(styles.getPropertyValue(name).trim());
  return {
    skyHorizon: token("--sky-horizon"),
    sea: token("--sea"),
    terrainBase: token("--terrain-base"),
    terrainHigh: token("--terrain-high"),
    hillshadeLight: token("--hillshade-light"),
    hillshadeShadow: token("--hillshade-shadow"),
    contourMinor: token("--contour-minor"),
    contourMajor: token("--contour-major"),
    coastline: token("--coastline"),
    routeRidden: token("--route-ridden"),
    routeRiddenHalo: token("--route-ridden-halo"),
    routeUnridden: token("--route-unridden"),
  };
}

export type SceneColors = ReturnType<typeof readSceneColors>;