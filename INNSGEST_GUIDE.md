# How to Test Inngest Integration

You have two ways to test: **Local Dev** (fastest) and **Production** (most accurate).

## Option 1: Local Testing 💻

1.  **Start the Inngest Dev Server**:
    In a terminal, run:
    ```bash
    npx inngest-cli@latest dev
    ```
    This opens the local dashboard at [http://localhost:8288](http://localhost:8288).

2.  **Start your App**:
    In a separate terminal, run:
    ```bash
    npm run dev
    ```

3.  **Trigger Data**:
    -   Go to your local app: [http://localhost:3000/practice](http://localhost:3000/practice)
    -   Select a problem (e.g., "Two Sum").
    -   Solve it (or paste the solution) and click **Run**.
    -   Wait for "All tests passed!".

4.  **Verify**:
    -   Switch to the **Inngest Dashboard** ([http://localhost:8288](http://localhost:8288)).
    -   Click **Events**. You should see `user.completed.lab`.
    -   Click the event to see the payload (`userId`, `score`, etc.).
    -   Click **Functions** to see `user-completed-lab` running successfully.

---

## Option 2: Production Testing 🚀

1.  **Go to Inngest Cloud**:
    -   Log in to [app.inngest.com](https://app.inngest.com).
    -   Ensure your project is connected (it usually auto-detects Vercel deployments via the `/api/inngest` endpoint).

2.  **Use Your Live App**:
    -   Go to [https://algobox-ai.vercel.app/practice](https://algobox-ai.vercel.app/practice).
    -   Solve a challenge.

3.  **Watch Real-time**:
    -   In the Inngest Cloud Dashboard, go to **Stream**.
    -   You will see the event pop up instantly.
    -   The `userCompletedLab` function will trigger and turn green (Success).

---

## Troubleshooting

-   **"Event not received"?**: Check the browser console network tab. Did the POST to `/api/events` succeed (200 OK)?
-   **"Function not found"?**: In Inngest Cloud, go to **Apps** and hit "Refresh" to force it to scan your new `/api/inngest` endpoint.
