export async function fetchUserEmail(apiBaseUrl) {
    try {
        const response = await fetch(`${apiBaseUrl}/getUserEmail.php`, {
            credentials: 'include',
        });
        const data = await response.json();
        if (data.email) {
            return data.email; // Return just the email string
        } else {
            console.error(data.error || 'Failed to fetch email');
            return null;
        }
    } catch (error) {
        console.error('Network error:', error);
        return null;
    }
}