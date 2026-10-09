/** WebGL can't read CSS variables, so resolve the design tokens once. */
export function readSceneColors() {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    return {
        land: token("--sky-horizon"),
        landLit: token("--nezumi"),
        glow: token("--akane"),
        ridden: token("--akane-light"),
        unridden: token("--gofun"),
    };
}

export type SceneColors = ReturnType<typeof readSceneColors>;