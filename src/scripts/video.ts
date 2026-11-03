/*
  Videos (src/components/VideoPlayer.astro). Pressing "Play the video" swaps the
  button for YouTube's privacy-enhanced player, which starts straight away.
  Until then nothing is loaded from YouTube. Without JavaScript the button is a
  plain link to the video on YouTube.
*/

document.querySelectorAll<HTMLAnchorElement>("a[data-video]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const player = document.createElement("iframe");
    // rel=0: suggest only videos from the same channel at the end.
    // cc_load_policy=1: show captions by default, for people watching with the sound off.
    player.src = `https://www.youtube-nocookie.com/embed/${link.dataset.video}?autoplay=1&rel=0&cc_load_policy=1`;
    player.title = `Video: ${link.dataset.title}`;
    player.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    player.allowFullscreen = true;

    link.replaceWith(player);
    // Keep keyboard users where they were: on the video
    player.focus();
  });
});
