import { useEffect, useState } from 'react';
import pkg from '../../package.json';

const CURRENT_VERSION = pkg.version;
const RELEASES_API    = 'https://api.github.com/repos/RacheliShayzada/snap-paste/releases/latest';

function parseVersion(tag: string): [number, number, number] {
  const [maj = 0, min = 0, pat = 0] = tag.replace(/^v/, '').split('.').map(Number);
  return [maj, min, pat];
}

function isNewer(remote: string, current: string): boolean {
  const [rMaj, rMin, rPat] = parseVersion(remote);
  const [cMaj, cMin, cPat] = parseVersion(current);
  if (rMaj !== cMaj) return rMaj > cMaj;
  if (rMin !== cMin) return rMin > cMin;
  return rPat > cPat;
}

export interface UpdateInfo {
  latestVersion: string;
  isAvailable: boolean;
}

/**
 * Fetches the latest GitHub release once on mount.
 * Returns null while loading/errored, or UpdateInfo when resolved.
 */
export function useUpdateChecker(): UpdateInfo | null {
  const [info, setInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((res) => (res.ok ? (res.json() as Promise<{ tag_name: string }>) : null))
      .then((data) => {
        if (cancelled || !data?.tag_name) return;
        setInfo({
          latestVersion: data.tag_name,
          isAvailable: isNewer(data.tag_name, CURRENT_VERSION),
        });
      })
      .catch(() => { /* silently ignore – no network or repo not found */ });

    return () => { cancelled = true; };
  }, []);

  return info;
}
