const fetch = require('node-fetch');

async function verifyAuth() {
    const timestamp = Date.now();
    const newUser = {
        username: `user_${timestamp}`,
        email: `user_${timestamp}@example.com`,
        password: "securepassword123"
    };

    console.log('Testing User Signup...');
    try {
        // 1. Signup
        const signupRes = await fetch('http://localhost:5000/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        const signupData = await signupRes.json();
        console.log('Signup Response:', signupData);

        if (!signupData.success) {
            console.error('Signup failed, aborting.');
            return;
        }

        // 2. Login
        console.log('Testing User Login...');
        const loginRes = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: newUser.email,
                password: newUser.password
            })
        });

        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);

        if (loginData.success && loginData.user.email === newUser.email) {
            console.log('VERIFICATION SUCCESS: User signup and login flow works correctly.');
        } else {
            console.error('VERIFICATION FAILED: Login did not return expected user data.');
        }

    } catch (e) {
        console.error('Verification error:', e);
    }
}

verifyAuth();
