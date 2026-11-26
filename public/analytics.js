// Counts page views: only the path
window.trailheadTrack = function (path) {
  navigator.sendBeacon("/api/analytics", JSON.stringify({ path }));
};
