/** Native click activation keeps play() in the browser's user-gesture call stack. */
export function activatePlayback(video, reportError) {
  if (!video.paused && !video.ended) {
    video.pause();
    return;
  }
  try {
    const request = video.play();
    if (request?.catch) request.catch(() => reportError('Playback could not start. Tap Play to try again.'));
  } catch {
    reportError('Playback could not start. Tap Play to try again.');
  }
}
