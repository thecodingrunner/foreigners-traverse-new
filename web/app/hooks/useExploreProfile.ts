import { useEffect, useState } from "react";
import type { ProfileData } from "~/lib/profile";

// One request per page load, however many components ask (timeline + sheet)
let request: Promise<ProfileData> | null = null;

function loadProfile() {
    request ??= fetch("/explore/profile.json").then((res) => {
        if (!res.ok) throw new Error(`profile.json: HTTP ${res.status}`);
        return res.json() as Promise<ProfileData>;
    });
    request.catch(() => {
        request = null; // let a later mount try again
    });
    return request;
}

/** The whole-ride elevation data, or null while it loads (or if it failed). */
export function useExploreProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    
    useEffect(() => {
        let active = true;
        loadProfile().then(
            (data) => active && setProfile(data),
            () => {}, // decorative: if it fails, the timeline simply has no profile
        );
        return () => { 
            active = false; 
        };
    }, []);

    return profile;
}
