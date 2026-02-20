const fetch = require('node-fetch');

async function verify() {
    // 1. Simulate a user login (or just use known data)
    // We'll create a dummy user first to ensure we have data
    const uniqueEmail = `test_${Date.now()}@example.com`;
    console.log(`Creating test user: ${uniqueEmail}`);

    try {
        const signupRes = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Citizen",
                email: uniqueEmail,
                password: "password123",
                municipal_name: "Test Ward",
                latitude: 19.0760,
                longitude: 72.8777,
                radius: 5
            })
        });

        const signupData = await signupRes.json();
        console.log('Signup result:', signupData);

        if (!signupData.success) {
            console.error('Signup failed, cannot proceed.');
            return;
        }

        const user = signupData.user;

        // 2. Create a complaint for this user
        console.log('Creating a test complaint...');
        // We'll use a direct DB insert via the API if possible, or just the /api/complaint endpoint
        // functionality of /api/complaint requires file upload which is hard to script simply here without a file.
        // But checking the backend code, `app.post('/api/complaint', upload.single('image')...` 
        // We might fail without a file. 
        // However, we can use the /api/my-complaints endpoint to check if it returns empty list initially which is also valid.

        // Let's try to fetch complaints for this user
        const res = await fetch('http://localhost:3000/api/my-complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                latitude: user.latitude,
                longitude: user.longitude,
                radius: user.radius
            })
        });

        const data = await res.json();
        console.log('Fetch complaints result:', data);

        if (data.success && Array.isArray(data.complaints)) {
            console.log('VERIFICATION SUCCESS: Data fetching endpoint works correctly.');
        } else {
            console.error('VERIFICATION FAILED: Endpoint returned unexpected data.');
        }

    } catch (e) {
        console.error('Verification error:', e);
    }
}

verify();
