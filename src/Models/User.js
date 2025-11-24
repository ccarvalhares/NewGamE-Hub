// In-memory storage for Users
const users = [];

class User {
    static save(userData) {
        const existingIndex = users.findIndex(u => u.id === userData.id);
        if (existingIndex >= 0) {
            // Update existing user, keeping points if not provided
            const existing = users[existingIndex];
            users[existingIndex] = { ...existing, ...userData };
            return users[existingIndex];
        } else {
            // Create new user with 0 points default
            const newUser = { points: 0, ...userData };
            users.push(newUser);
            return newUser;
        }
    }

    static findById(id) {
        return users.find(u => u.id === id);
    }

    static addPoints(userId, amount) {
        const user = this.findById(userId);
        if (user) {
            user.points = (user.points || 0) + amount;
            return user.points;
        }
        return 0;
    }

    static updateRole(userId, role) {
        const user = this.findById(userId);
        if (user) {
            user.role = role;
            return user;
        }
        return null;
    }

    static getLeaderboard() {
        return users
            .sort((a, b) => (b.points || 0) - (a.points || 0))
            .slice(0, 10); // Top 10 players
    }
}

module.exports = User;
