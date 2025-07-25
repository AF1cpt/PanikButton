# Worcester Watch - Community Safety App

A React Native mobile application for community safety in Worcester, Western Cape. The app features a panic button that alerts nearby users in case of emergencies.

## Features

- **User Authentication**: Sign up and sign in with email/password
- **Panic Button**: Large, prominent button to trigger emergency alerts
- **Real-time Location**: Uses GPS to get user's current location
- **Live Map**: Shows alert location and nearby responders
- **Real-time Chat**: Communication between alert initiator and responders
- **Push Notifications**: Alerts nearby users within 2km radius
- **Community Safety**: All users can view and respond to alerts

## Technology Stack

- **Frontend**: React Native with Expo (JavaScript)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Maps**: react-native-maps (Google Maps integration)
- **Location**: expo-location (GPS and location services)
- **Notifications**: expo-notifications (Push notifications)
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Navigation**: expo-router (File-based routing)
- **Animations**: react-native-reanimated (Smooth UI animations)
- **State Management**: React Context API
- **Storage**: @react-native-async-storage/async-storage

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Git** - [Download here](https://git-scm.com/)
- **Supabase account** - [Sign up here](https://supabase.com)
- **iOS Simulator** (macOS) or **Android Emulator** (Windows/Linux/macOS) or **Physical device** with Expo Go app

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd WorcesterWatch

# Install all dependencies
npm install

# Install additional development dependencies (if needed)
npm install --save-dev @babel/core babel-plugin-module-resolver
```

### 2. Install Required Dependencies

The following dependencies are already included in `package.json`, but here's what you need:

**Core Dependencies:**
```bash
npm install expo@~53.0.20
npm install expo-router@~5.1.4
npm install react@19.0.0
npm install react-native@0.79.5
npm install react-native-maps@^1.20.1
npm install expo-location@~18.1.6
npm install expo-notifications@^0.31.4
npm install @expo/vector-icons@^14.1.0
npm install @supabase/supabase-js@^2.39.0
npm install @react-native-async-storage/async-storage@^2.1.2
npm install react-native-reanimated@~3.17.4
npm install react-native-safe-area-context@5.4.0
npm install react-native-screens@~4.11.1
npm install react-native-url-polyfill@^2.0.0
```

**Development Dependencies:**
```bash
npm install --save-dev @babel/core@^7.25.2
npm install --save-dev babel-plugin-module-resolver@^5.0.2
npm install --save-dev jest@^29.2.1
npm install --save-dev jest-expo@~53.0.9
npm install --save-dev react-test-renderer@19.0.0
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and paste the contents of `database-schema.sql` and run it
4. Go to Settings > API to get your project URL and anon key

### 4. Configure Environment Variables

Update `lib/supabase.js` with your Supabase credentials:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 5. Deploy Supabase Edge Function

1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref YOUR_PROJECT_REF`
4. Deploy the function: `supabase functions deploy trigger-alert`

### 6. Run the Application

```bash
npx expo start
```

Then press:
- `i` for iOS Simulator (macOS only)
- `a` for Android Emulator
- Scan QR code with Expo Go app on your phone
- `w` for web browser (limited functionality)

### 7. VS Code Setup (Optional but Recommended)

**Recommended Extensions:**
- **ES7+ React/Redux/React-Native snippets** - For React Native development
- **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
- **Bracket Pair Colorizer** - Colorize matching brackets
- **GitLens** - Enhanced Git capabilities
- **Prettier** - Code formatter
- **ESLint** - JavaScript linting

**VS Code Settings:**
Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## Database Schema

The app uses the following tables:

- **users**: User profiles with location data
- **alerts**: Emergency alerts with GPS coordinates
- **responders**: Users responding to alerts
- **chat_messages**: Real-time chat messages

## Key Features Implementation

### SOS Button (Panic Button)
- Large, red circular button with Norman-Ive design principles
- 2-second hold-to-activate with haptic feedback
- Animated glow, pulse, and scale effects
- Gets current GPS location
- Calls Supabase Edge Function to create alert
- Navigates to emergency type selection

### Google Maps Integration
- Real-time interactive maps with custom markers
- User location tracking and permission handling
- Emergency location visualization
- Directions integration with Google Maps
- Custom styled markers for different emergency types

### Real-time Features
- Supabase real-time subscriptions for live updates
- Chat messages appear instantly
- Responder locations update in real-time
- Alert status changes propagate immediately

### Location Services
- PostGIS for efficient geospatial queries
- 2km radius search for nearby users
- GPS coordinates stored as PostGIS points
- Real-time location tracking for responders

## File Structure

```
WorcesterWatch/
├── app/
│   ├── (auth)/
│   │   ├── _layout.js        # Auth navigation layout
│   │   ├── index.js          # Auth redirect
│   │   ├── sign-in.js        # Sign in screen
│   │   └── sign-up.js        # Sign up screen
│   ├── (tabs)/
│   │   ├── _layout.js        # Tab navigation layout
│   │   ├── index.js          # Home screen with SOS button
│   │   ├── alerts.js         # Alerts list screen
│   │   ├── chat.js           # Community chat screen
│   │   └── profile.js        # User profile screen
│   ├── alert/
│   │   └── [id].js           # Alert details with Google Maps
│   ├── emergency-type.js     # Emergency type selection
│   ├── emergency-chat.js     # Emergency chat screen
│   ├── _layout.js            # Root navigation layout
│   ├── +not-found.js         # 404 error page
│   ├── +html.js              # HTML template
│   └── modal.js              # Modal component
├── components/
│   ├── Chat.js               # Real-time chat component
│   ├── InteractivePanicButton.js # SOS button component
│   ├── StyledComponent.js    # Example styled component
│   └── ...                   # Other UI components
├── constants/
│   ├── Colors.js             # Color definitions
│   └── DesignSystem.js       # Design system constants
├── contexts/                 # React Context providers
├── lib/
│   └── supabase.js           # Supabase client configuration
├── styles/
│   └── GlobalStyles.css      # Centralized CSS styles
├── supabase/
│   └── functions/
│       └── trigger-alert/    # Edge function for alert handling
├── utils/
│   └── clearAuth.js          # Authentication utilities
├── package.json              # Dependencies and scripts
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
└── database-schema.sql       # Database setup script
```

## Security Features

- Row Level Security (RLS) policies on all tables
- JWT authentication with Supabase Auth
- User can only access their own data
- Public read access for alerts (community safety)
- Secure API endpoints with authentication

## Push Notifications

The app is set up to send push notifications to nearby users. To enable:

1. Set up Expo push notifications
2. Store Expo push tokens in the users table
3. Uncomment and configure the notification code in the Edge Function

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

### Common Issues

**1. Metro Bundler Issues:**
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache
npx expo start --reset-cache
```

**2. Dependencies Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. Expo CLI Issues:**
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Check Expo version
expo --version
```

**4. Location Permission Issues:**
- Ensure location services are enabled on your device
- Check app permissions in device settings
- For iOS Simulator: Features > Location > Custom Location

**5. Google Maps Issues:**
- Ensure you have internet connection
- Check if Google Maps API is properly configured
- For development, maps work without API keys

### Getting Help

For support, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed error information
4. Contact the development team

## Future Enhancements

- Push notification integration
- Emergency contact management
- Alert categories (medical, fire, crime, etc.)
- Integration with emergency services
- Offline support
- Multi-language support
- Advanced mapping features 