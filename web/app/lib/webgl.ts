/**
 * Can this browser run the 3D explorer? Three.js needs WebGL 2.
 * Add ?nowebgl to the URL to preview the fallback on any device.
 */
export function detectWebGL2() {
    if (new URLSearchParams(window.location.search).has("nowebgl")) return false;
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        if (!gl) return false;
        gl.getExtension("WEBGL_lose_context")?.loseContext(); // free it straight away
        return true;
    } catch {
        return false;
    }
}