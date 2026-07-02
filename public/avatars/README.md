# Avatar images

Drop the AI coach avatar images here as **transparent PNGs** using these exact
filenames. The app references them at `/avatars/<name>.png`.

| File             | Pose (from your set)         | Used on                                   |
| ---------------- | ---------------------------- | ----------------------------------------- |
| `waving.png`     | Waving hand                  | Welcome screen (`/`)                       |
| `idle.png`       | Hands clasped / neutral      | Interview question (`/interview`), profile |
| `welcoming.png`  | Both hands open / welcoming  | Your Turn (`/interview/your-turn`)         |
| `thinking.png`   | Hand on chin / thinking      | Analyzing (`/interview/analyzing`)         |
| `thumbsup.png`   | Two thumbs up                | AI Feedback (`/interview/feedback`)        |
| `presenting.png` | Pointing to the side         | (optional – available for future use)      |
| `listening.png`  | Listening pose               | Your Turn (`/interview/your-turn`) — falls back to `idle.png` until added |

Until these files are added, each avatar falls back to a labelled placeholder box,
so the layout still works. As soon as the files exist at these paths they appear
automatically — no code changes needed.
