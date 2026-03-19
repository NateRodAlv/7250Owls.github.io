const TBA_API_KEY = 'Imp1K3Z8VHhPqSpujx5KjiR1nJhTGCL5RA6WyhAqFV1RyRVcwfxQFwezyEusYQVU';
const TEAM_KEY = 'frc7250';
const CURRENT_YEAR = new Date().getFullYear();

function showSection(sectionId) {
    // Hide sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // Show target section
    document.getElementById(sectionId).style.display = 'block';

    // Update nav links
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Using currentTarget to ensure we catch the link even if clicking the text
    if (event) {
        event.currentTarget.classList.add('active');
    }

    if (sectionId === 'stats') {
        fetchTeamStats();
    }
}

async function fetchTeamStats() {
    const container = document.getElementById('stats-container');

    if (TBA_API_KEY === 'PASTE_YOUR_KEY_HERE') {
        container.innerHTML = '<p style="color:orange">System Error: TBA API Key Missing in script.js</p>';
        return;
    }

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/team/${TEAM_KEY}/events/${CURRENT_YEAR}/statuses`, {
            headers: { 'X-TBA-Auth-Key': TBA_API_KEY }
        });
        const data = await response.json();

        let html = '';
        for (const eventKey in data) {
            const event = data[eventKey];
            if (event && event.qual) {
                html += `
                    <div class="stats-card">
                        <h3>EVENT: ${eventKey.substring(4).toUpperCase()}</h3>
                        <p>Rank: <strong>${event.qual.ranking.rank}</strong></p>
                        <p>Record: <strong>${event.qual.ranking.record.wins}-${event.qual.ranking.record.losses}-${event.qual.ranking.record.ties}</strong></p>
                        <p>Status: <strong>${event.status_str.split('</b>')[1] || 'In Progress'}</strong></p>
                    </div>
                `;
            }
        }
        container.innerHTML = html || '<p>No data found for the current season.</p>';
    } catch (err) {
        container.innerHTML = '<p style="color:red">CRITICAL: CONNECTION TO TBA FAILED</p>';
    }
}