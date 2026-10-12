// One component owns the camera in every mode. Each frame it works out
// where the camera SHOULD be for the current mode (the goal pose), and
// during a mode change it blends from where it was to that goal.
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type PerspectiveCamera, Vector3 } from "three";
import type { ExploreStage } from "~/data/stages.server";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { useExplore, useExploreApi } from "~/stores/explore-context";
import type { RouteData } from "./assets";
import {
  CAMERA,
  CAMERA_LAG_S,
  EXAGGERATION,
  ORBIT_DEG_PER_PX,
  ORBIT_ZOOM_PER_WHEEL,
} from "./constants";
import {
  applyLensShift,
  applyPose,
  copyPose,
  createPose,
  distanceToFit,
  easeOut,
  mixPose,
  angleBetween,
  smoothing,
} from "./framing";
import { pointAt, stageAt } from "./routeMath";
import type { Insets } from "./useSceneInsets";

type Props = { route: RouteData; stages: ExploreStage[]; insets: Insets };

const rad = MathUtils.degToRad;

/** Follow mode never turns or zooms: a fixed "input" for the smoothing below */
const FOLLOW_INPUT = { yaw: 0, spanKm: CAMERA.follow.spanKm };

export default function CameraRig({ route, stages, insets }: Props) {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const api = useExploreApi();
  const mode = useExplore((s) => s.mode);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // ---- Lens shift: centre the view in the part of the screen the UI leaves free
  useLayoutEffect(() => {
    applyLensShift(camera, size.width, size.height, insets);
    invalidate();
  }, [size, insets, invalidate, camera]);

  // ---- Static facts about the route
  const box = useMemo(() => {
    let minX = Infinity,
      maxX = -Infinity,
      minZ = Infinity,
      maxZ = -Infinity;
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

  // Strapi stages in order, matched to their 3D line (null = no GPX yet)
  const routeStages = useMemo(() => {
    const byNumber = new Map(route.stages.map((s) => [s.stageNumber, s]));
    return stages.map((s) => byNumber.get(s.stageNumber ?? -1) ?? null);
  }, [route, stages]);

  // ---- Mutable camera state, kept in refs: it changes every frame
  const goal = useRef(createPose()).current;
  const pose = useRef(createPose()).current;
  const from = useRef(createPose()).current;
  const transitionStart = useRef<number | null>(null);
  const hasPose = useRef(false);
  const orbit = useRef({ yaw: 0, spanKm: CAMERA.orbit.spanKm as number });

  // Smoothed versions of the rider position and the orbit input: the camera
  // chases these, so it eases after them instead of copying every jolt
  const rider = useRef(new Vector3()).current;
  const smooth = useRef({
    target: new Vector3(),
    yaw: 0,
    spanKm: CAMERA.orbit.spanKm as number,
    ready: false,
    settled: true,
  });

  // ---- Mode changes: start a transition from wherever the camera is now
  useEffect(() => {
    if (mode === "orbit")
      orbit.current = { yaw: 0, spanKm: CAMERA.orbit.spanKm };
    smooth.current.ready = false;
    if (hasPose.current && !reducedMotion) {
      copyPose(pose, from);
      transitionStart.current = performance.now();
    }
    invalidate();
  }, [mode, reducedMotion, pose, from, invalidate]);

  // ---- Orbit: drag to turn, wheel to zoom
  useEffect(() => {
    if (mode !== "orbit") return;
    const canvas = gl.domElement;
    let lastX: number | null = null;

    const onDown = (e: PointerEvent) => {
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("is-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (lastX === null) return;
      orbit.current.yaw -= rad((e.clientX - lastX) * ORBIT_DEG_PER_PX);
      lastX = e.clientX;
      invalidate();
    };
    const onUp = () => {
      lastX = null;
      canvas.classList.remove("is-dragging");
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { minSpanKm, maxSpanKm } = CAMERA.orbit;
      const span =
        orbit.current.spanKm * Math.exp(e.deltaY * ORBIT_ZOOM_PER_WHEEL);
      orbit.current.spanKm = MathUtils.clamp(span, minSpanKm, maxSpanKm);
      invalidate();
    };

    canvas.classList.add("is-orbit");
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.classList.remove("is-orbit", "is-dragging");
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [mode, invalidate, gl]);

  // ---- Every frame: goal for this mode → (blend) → camera.
  // Priority -1 runs this before the other useFrame callbacks (fog, dashes),
  // so they all see this frame's camera, not last frame's.
  useFrame(({ size }, delta) => {
    const freeWidth = size.width - insets.left - insets.right;
    const freeHeight = size.height - insets.top - insets.bottom;

    if (mode === "overview") {
      const pitch = rad(CAMERA.overview.pitchDeg);
      // Fit the route's width into the free width, and its depth (foreshortened
      // by the tilt) into the free height: whichever needs more distance wins
      const distance = Math.max(
        distanceToFit(camera, box.maxX - box.minX, freeWidth, size.height),
        distanceToFit(
          camera,
          (box.maxZ - box.minZ) * Math.cos(pitch),
          freeHeight,
          size.height,
        ),
      );
      goal.target.set((box.minX + box.maxX) / 2, 0, (box.minZ + box.maxZ) / 2);
      goal.distance = distance * CAMERA.overview.margin;
      goal.pitch = pitch;
      goal.yaw = 0;
    } else {
      // Follow and orbit both centre on the rider
      const { position, count } = api.getState();
      const { index, fraction } = stageAt(position, count);
      const stage = routeStages[index];
      if (stage) {
        const p = pointAt(stage, fraction);
        rider.set(p.x, p.y * EXAGGERATION, p.z);
      }

      const s = smooth.current;
      const input = mode === "orbit" ? orbit.current : FOLLOW_INPUT;
      if (!s.ready || reducedMotion) {
        s.target.copy(rider);
        s.yaw = input.yaw;
        s.spanKm = input.spanKm;
        s.ready = true;
      } else {
        // With on-demand rendering, the first frame after an idle spell reports
        // the whole idle time as its delta, which would snap straight to the
        // goal. Treat that first frame as an ordinary 60fps one instead.
        const dt = s.settled ? 1 / 60 : delta;
        s.target.lerp(rider, smoothing(CAMERA_LAG_S.follow, dt));
        const k = smoothing(CAMERA_LAG_S.input, dt);
        s.yaw += angleBetween(s.yaw, input.yaw) * k;
        s.spanKm *= (input.spanKm / s.spanKm) ** k; // ease zoom by ratio, like mixPose
      }

      // Still catching up? On-demand rendering won't draw again by itself
      const settled =
        s.target.distanceToSquared(rider) < 1e-4 &&
        Math.abs(angleBetween(s.yaw, input.yaw)) < 1e-4 &&
        Math.abs(s.spanKm - input.spanKm) < 1e-4;
      s.settled = settled;
      if (!settled) invalidate();

      const settings = mode === "follow" ? CAMERA.follow : CAMERA.orbit;
      goal.target.copy(s.target);
      goal.distance = distanceToFit(camera, s.spanKm, freeWidth, size.height);
      goal.pitch = rad(settings.pitchDeg);
      goal.yaw = s.yaw;
    }

    // Blend from the transition's start towards the (possibly moving) goal
    if (transitionStart.current !== null) {
      const k = Math.min(
        1,
        (performance.now() - transitionStart.current) / CAMERA.transitionMs,
      );
      mixPose(from, goal, easeOut(k), pose);
      if (k < 1) invalidate();
      else transitionStart.current = null;
    } else {
      copyPose(goal, pose);
    }

    applyPose(camera, pose);
    hasPose.current = true;
  }, -1);

  return null;
}
