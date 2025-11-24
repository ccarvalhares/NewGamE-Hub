exports.getUserRole = async (userId) => {
    console.log(`[Mock Discord Service] Fetching role for user ${userId}...`);
    // Return a dummy role for testing. 
    // Change this to 'Marechal' to test admin features.
    return 'Recruta';
};

exports.sendNotification = (task) => {
    console.log(`[Mock Discord Service] 🔔 NEW TASK NOTIFICATION!`);
    console.log(`Code: ${task.code} | Points: ${task.points} | Expires in: ${(task.expiresAt - Date.now()) / 1000}s`);
};
