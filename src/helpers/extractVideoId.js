export const extractVideoId = (url, platform) => {
    const regexes = {
      Youtube: /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      Vimeo: /(?:vimeo\.com\/)([0-9]+)/
    };
    const matches = url.match(regexes[platform]);
    return matches ? matches[1] : null;
  };