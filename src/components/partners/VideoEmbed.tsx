import { getVimeoId, getYouTubeId } from '@/lib/partners';

const VideoEmbed = ({ url, className = '' }: { url: string; className?: string }) => {
  if (!url) return null;
  const yt = getYouTubeId(url);
  const vm = getVimeoId(url);

  const wrapper = `relative w-full aspect-video rounded-2xl overflow-hidden bg-muted ${className}`;

  if (yt) {
    return (
      <div className={wrapper}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${yt}`}
          title="Vídeo de apresentação"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (vm) {
    return (
      <div className={wrapper}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://player.vimeo.com/video/${vm}`}
          title="Vídeo de apresentação"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className={wrapper}>
      <video src={url} controls className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
};

export default VideoEmbed;
