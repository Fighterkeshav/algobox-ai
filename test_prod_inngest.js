const fetch = require('node-fetch'); // You might need to install node-fetch if not available, or use native fetch in Node 18+

async function testProd() {
    console.log("🚀 Sending test event to Production...");

    try {
        const response = await fetch('https://algobox-ai.vercel.app/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "user.completed.lab",
                data: {
                    userId: "test-user-prod-001",
                    labId: "prod-test-lab",
                    score: 100
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Success! Event ID:", data.eventId);
            console.log("👉 Go to https://app.inngest.com/env/production/events to see it!");
        } else {
            console.error("❌ Failed:", response.status, await response.text());
        }
    } catch (err) {
        console.error("❌ Network Error:", err);
    }
}

testProd();
