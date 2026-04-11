# DrillCamera on-device test plan

The iOS simulator has no camera, so the whole MoveNet pipeline is untested in
the harness. Before we ship DrillCamera to TestFlight, step through this
checklist on a real iPhone (any A14+ device; iPhone 12 mini was the floor we
targeted).

## Setup

1. `cd ios/App && open App.xcodeproj`
2. Select your device (not a simulator) and a signing team
3. ⌘R to build & run. First launch on the device will prompt for camera + mic
   permissions — both are required (mic prompt is WebKit-driven even though we
   only use video).

## Happy path — each camera mode

For every drill card that has a camera icon, tap it and confirm:

| Drill            | `cameraMode`     | What to verify                                                                       |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------ |
| Form Shooting    | `shooting-form`  | Orange skeleton draws on shoulders/elbows/wrists; rep counts up on each release      |
| Mikan Drill      | `mikan`          | Rep increments when alternating hands finish above the head                          |
| Pound Dribble    | `pound`          | Rep increments on each wrist-Y oscillation past threshold                            |
| Line Jumps       | `conditioning`   | Rep increments on each hip-Y oscillation past threshold                              |

For each:
- Close-to-camera (arms fully visible) should feel snappy — goal is ≥15 fps
- Step back 8 ft, still counts
- Flip to back camera via the HUD button — stream should swap, skeleton redraws
- Hit **Finish & Log**, scrub the replay timeline, then tap **Log Session**

## Failure modes to try

1. Deny camera permission the first time, then re-open → should show the
   permission error card, not a white screen
2. Lock the phone mid-session → on resume the loop should keep running (or
   cleanly restart)
3. Rotate the phone → video should stay upright (we use `playsInline`)
4. Backgrounding for >60s → rAF loop should still tick or exit without crashing
5. Open DrillCamera, immediately hit X → cleanup runs, no stuck audio/video
   indicator in the iOS status bar

## Performance targets

- TF.js cold load < 3s on iPhone 14
- `detector.estimatePoses` < 60 ms/frame
- Memory steady < 220 MB after 2 minutes of tracking
- No dropped frames on the skeleton overlay during normal motion

## What to capture

Screen-record one full session per camera mode and drop the videos in
`docs/device-test-recordings/<date>/`. Note any mode where the rep counter
disagrees with visual rep count — that's the analyzer threshold that needs
tuning in `makeAnalyzer`.
