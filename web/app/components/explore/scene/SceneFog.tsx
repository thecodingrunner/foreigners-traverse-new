import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { FogExp2 } from "three";
import type { SceneColor } from "./colors";
import { FOG_DENSITY, FOG_REACH } from "./constants";
import { viewDistance } from "./viewDistance";

/**
 * exp² haze in the sky's horizon colour. three fades each pixel by
 * 1 − exp(−(density · distance)²), so density is set from how far away the
 * ground is: the same light haze where you're looking, whatever the zoom,
 * and a thick one towards the horizon when the camera is low.
 */
export default function SceneFog({ color }: { color: SceneColor }) {
    const fog = useMemo(() => new FogExp2(color.color, 0), [color]);
    useFrame(({ camera }) => {
        fog.density = FOG_DENSITY / (FOG_REACH * viewDistance(camera));
    });

    return <primitive object={fog} attach="fog" />;
}