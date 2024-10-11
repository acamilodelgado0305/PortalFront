export const extractVideoId = (url, platform) => {
    const regexes = {
      Youtube: /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      Vimeo: /(?:vimeo\.com\/)([0-9]+)/
    };
    const matches = url.match(regexes[platform]);
    return matches ? matches[1] : null;
  };

  export const extractPlatform = (url) => {
    if (/youtube\.com|youtu\.be/.test(url)) {
      return 'Youtube';
    } else if (/vimeo\.com/.test(url)) {
      return 'Vimeo';
    }
    return null; // Add logic for other platforms if needed
  };