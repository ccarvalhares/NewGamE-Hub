# NewGamE Hub 🎮

A gamification platform integrated with Discord OAuth, featuring task management, point systems, and role-based permissions.

## 🚀 Features

- **Discord OAuth Integration**: Secure login with Discord
- **Task System**: Create time-limited tasks with codes
- **Point Rewards**: Earn points by completing tasks
- **Role Management**: Admin panel for role assignment
- **Leaderboard**: Track top players
- **Responsive Design**: Modern glassmorphism UI with dark theme

## 📋 Prerequisites

- Node.js (v14 or higher)
- Discord Application (for OAuth)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/newgame-hub.git
cd newgame-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
SESSION_SECRET=your_secret_key_here
CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
REDIRECT_URI=http://localhost:3000/auth/discord/callback
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### For Players
1. Login with Discord
2. Redeem task codes to earn points
3. View your rank on the leaderboard
4. Explore games and community features

### For Admins (Marechal/General)
1. Create tasks with custom codes, points, and time limits
2. Assign roles to users
3. Manage community activities

## 🛠️ Configuration

### Discord Application Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 → Redirects and add: `http://localhost:3000/auth/discord/callback`
4. Copy Client ID and Client Secret to your `.env` file

### Role Configuration

Edit `src/controllers/guildController.js` to customize admin roles:
```javascript
if (!user || !['Marechal', 'General', 'YourCustomRole'].includes(user.role))
```

## 📁 Project Structure

```
newgame-hub/
├── src/
│   ├── controllers/      # Request handlers
│   ├── Models/          # Data models
│   └── services/        # External services (Discord)
├── index.html           # Main HTML
├── style.css           # Styles
├── script.js           # Frontend logic
├── server.js           # Express server
└── package.json        # Dependencies
```

## 🔐 Security Notes

- **Never commit `.env` files** - They contain sensitive credentials
- The `.gitignore` file is configured to exclude sensitive data
- Use strong session secrets in production
- Consider implementing HTTPS for production deployments

## 🚧 Current Limitations

- Data is stored in-memory (resets on server restart)
- Single active task at a time
- Mock Discord role verification (for testing)

## 🔮 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real Discord bot for role verification
- Multiple concurrent tasks
- User profiles and achievements
- Real-time notifications

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for the gaming community
