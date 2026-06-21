import { openUrl } from '@tauri-apps/plugin-opener';
import type { UpdateInfo } from '../../hooks/useUpdateChecker';
import './UpdateBanner.css';

const RELEASES_URL = 'https://github.com/RacheliShayzada/snap-paste/releases/latest';

interface Props {
  update: UpdateInfo;
}

export function UpdateBanner({ update }: Props) {
  if (!update.isAvailable) return null;

  const handleClick = () => {
    openUrl(RELEASES_URL).catch(() => { /* ignore */ });
  };

  return (
    <button className="update-banner" onClick={handleClick} title="Open releases page">
      <span className="update-banner__dot" aria-hidden="true" />
      <span className="update-banner__text">
        {update.latestVersion} available
      </span>
      <span className="update-banner__arrow" aria-hidden="true">↗</span>
    </button>
  );
}
