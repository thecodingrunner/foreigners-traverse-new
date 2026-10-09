import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { MathUtils, type PerspectiveCamera } from "three";
import type { RouteData } from "./assets";
import { OVERVIEW_PITCH_DEG } from "./constants";

/** Frames the whole route from the south, tilted 22° from straight down. */
export default function OverviewCamera({ route }: { route: RouteData }) {
    const camera = useThree((state) => state.camera) as PerspectiveCamera;
    const size = useThree((state) => state.size);
    const invalidate = useThree((state) => state.invalidate);

    const box = useMemo(() => {
        let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
        for (const stage of route.stages) {
            for (let i = 0; i < stage.positions.length; i += 3) {
                minX = Math.min(minX, stage.positions[i]);
                maxX = Math.max(maxX, stage.positions[i]);
                minZ = Math.min(minZ, stage.positions[i + 2]);
                maxZ = Math.max(maxZ, stage.positions[i + 2]);
            }
        }
        return { minX, maxX, minZ, maxZ };
    }, [route]);

    useLayoutEffect(() => {
        if (!Number.isFinite(box.minX)) return; // no route yet
        const centerX = (box.minX + box.maxX) / 2;
        const centerZ = (box.minZ + box.maxZ) / 2;
        const halfFov = MathUtils.degToRad(camera.fov / 2);
        const aspect = size.width / size.height;

        // Far enough back that both the width and the depth of the route fit
        const fitDepth = (box.maxZ - box.minZ) / 2 / Math.tan(halfFov);
        const fitWidth = (box.maxX - box.minX) / 2 / (Math.tan(halfFov) * aspect);
        const distance = Math.max(fitDepth, fitWidth) * 1.15;

        const pitch = MathUtils.degToRad(OVERVIEW_PITCH_DEG);
        camera.position.set(centerX, distance * Math.cos(pitch), centerZ + distance * Math.sin(pitch));
        camera.lookAt(centerX, 0, centerZ);
        camera.updateProjectionMatrix();
        invalidate();
    }, [box, camera, size, invalidate]);

    return null;
} 