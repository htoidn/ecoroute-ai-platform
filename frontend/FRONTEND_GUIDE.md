# EcoRoute AI Platform - Frontend Guide

## 🎨 Modern, Responsive Frontend with Advanced Features

This is a complete redesign of the EcoRoute AI Platform frontend with modern UI/UX patterns, dark mode support, and comprehensive eco-tourism features.

## ✨ Key Features

### 🏠 Pages

#### 1. **Home (Dashboard)**
- Hero section with elegant branding
- Featured AI-powered recommendations
- Top eco-friendly destinations showcase
- Quick stats overview
- Search bar for quick destination lookup
- Fully responsive grid layout

#### 2. **Explore** 🌍
- Browse all eco-friendly destinations
- Advanced search filtering by:
  - Destination name
  - Country
  - Tags (eco, cycling, culture, etc.)
- Detailed destination cards showing:
  - Sustainability score (visual progress bar)
  - Public transport score
  - Cost index, crowd index, temperature
  - Best visiting season
  - Eco-friendly tags
- Mobile-optimized card layout
- Real-time search results

#### 3. **Recommendations** ⭐
- AI-powered recommendation engine results
- Two view modes:
  - **Table View**: Sort and view detailed recommendation data
  - **Chart View**: Visual analytics with bar charts
- Statistics dashboard showing:
  - Total recommendations count
  - Unique destinations recommended
  - Average AI score
- Top recommended destinations bar chart
- Score distribution visualization
- Responsive table with mobile-friendly layout

#### 4. **Settings** ⚙️
- **Appearance Theme**: Toggle between light/dark mode
- **Notifications**: Push and email notification preferences
- **Language & Localization**:
  - Multi-language support (EN, DE, FR, ES, IT)
  - Local SEO region preferences
  - Attracts tourists to specific regions
- **Travel Preferences**:
  - Travel purpose (Leisure, Business, Adventure, etc.)
  - Sustainability priority level
  - Budget range selection
- **Privacy & Data**: Data export and account management
- **About Section**: Platform information and features

### 🌓 Dark Mode

- **Full Theme Support**: Complete light/dark mode toggle
- **Persistent Storage**: Theme preference saved in localStorage
- **Smooth Transitions**: Beautiful color transitions between themes
- **Accessibility**: Proper contrast ratios for both themes

### 📱 Responsive Design

- **Desktop (1024px+)**: Full grid layouts, side-by-side cards
- **Tablet (768px-1023px)**: Optimized grid spacing
- **Mobile (<768px)**: Single column layouts, touch-friendly buttons
- All components tested for small screen compatibility

### 🎯 Technical Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe code
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **PrimeReact** - UI component library

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── contexts/
│   ├── AuthContext.tsx  # Authentication
│   └── ThemeContext.tsx # Dark/Light mode theme management
├── layout/
│   └── Sidebar.tsx      # Navigation sidebar with theme toggle
├── pages/
│   ├── Home.tsx         # Dashboard with featured content
│   ├── Explore.tsx      # All destinations with search
│   ├── Recommendations.tsx # AI recommendations with charts
│   ├── Settings.tsx     # User settings & preferences
│   └── AddUserPage.tsx  # User management
├── services/
│   └── api.ts          # API calls for destinations, recommendations, etc.
├── styles/
│   ├── global.css      # Global styles with theme variables
│   ├── LayoutStyles.ts # Container and layout components
│   └── SharedStyles.ts # Reusable styled components
└── App.tsx            # Main app with routes and theme provider
```

## 🎨 Component Styling

All components use **styled-components** for:
- Dynamic theme switching
- Responsive media queries
- Smooth transitions
- Consistent design patterns

### Color Scheme

**Light Mode:**
- Background: `#f5f7fa`
- Text: `#1a202c`
- Primary: `#48bb78` (Green)
- Accent: `#667eea` (Blue)

**Dark Mode:**
- Background: `#1a202c`
- Text: `#f5f7fa`
- Primary: `#48bb78` (Green - unchanged)
- Accent: `#667eea` (Blue - unchanged)

## 🔄 API Integration

### Updated API Service (`src/services/api.ts`)

```typescript
// Destinations
getAllDestinations()          // Get all destinations
getDestinationById(id)        // Get single destination
searchDestinations(keyword)   // Search by keyword

// Recommendations
getAllRecommendations()       // Get all AI recommendations
getRecommendations(userId)    // Get user-specific recommendations

// Users
getAllUsers()                 // Get all users
getUserById(id)               // Get single user
```

## 📊 Data Display

### Destination Cards
- Emoji placeholders for country flags
- Sustainability score with progress bars
- Multi-column layouts for metrics
- Color-coded score indicators
- Smooth hover effects

### Recommendation Charts
- Bar charts for top destinations
- Score distribution analysis
- Statistical cards with key metrics
- Mobile-friendly chart rendering

### Tables
- Sortable recommendation table
- Mobile-responsive table layout
- Badge-styled scores
- Hover effects for interactivity

## 🎯 SEO & Local Features

The Settings page includes:
- **Local SEO Preference**: Specify interested regions
- **Language Selection**: Multi-language support
- **Travel Purpose**: Customize recommendations
- **Sustainability Level**: Eco-tourism focus

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus visible outlines
- Color contrast compliance
- Mobile-friendly touch targets

## 🚀 Performance Optimizations

- Lazy loading of components
- Optimized re-renders with React
- CSS animations using GPU acceleration
- Responsive image handling
- Efficient state management

## 📱 Mobile Optimizations

- Touch-friendly button sizes (min 44px)
- Swipe-ready layouts
- Simplified navigation on small screens
- Readable font sizes
- Reduced padding/margins for compact display

## 🔒 Theme Persistence

Theme preference is saved to localStorage:
```javascript
localStorage.setItem('theme-mode', 'dark') // or 'light'
```

Automatically loads on app startup.

## 🎨 Component Examples

### Using SharedStyles
```typescript
import { 
  PageContainer, 
  Button, 
  CardGrid, 
  Badge 
} from '../styles/SharedStyles';

// In component
<PageContainer theme={theme}>
  <Button variant="primary">Click me</Button>
  <CardGrid>
    {/* Cards go here */}
  </CardGrid>
</PageContainer>
```

### Theme Usage
```typescript
import { useTheme } from '../contexts/ThemeContext';

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div style={{ color: theme.colors.text }}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

## 🔧 Future Enhancements

- [ ] User profile with saved preferences
- [ ] Destination comparison tool
- [ ] Trip planning calendar
- [ ] Community reviews and ratings
- [ ] Real-time CO₂ tracking
- [ ] Mobile app with PWA support
- [ ] Social sharing features
- [ ] Advanced filtering with date range
- [ ] Wishlist functionality
- [ ] Booking integration

## 📚 Dependencies

Core dependencies:
- `react`: ^19.2.5
- `react-router-dom`: ^7.15.0
- `styled-components`: ^6.4.1
- `axios`: ^1.16.1
- `primereact`: ^10.9.7
- `primeicons`: ^7.0.0
- `typescript`: ~6.0.2

## 🎓 Best Practices

1. **Always use `useTheme`** for dynamic styling
2. **Mobile-first approach** in all media queries
3. **Semantic HTML** for accessibility
4. **Custom styled components** instead of inline styles
5. **TypeScript interfaces** for all data types
6. **Error handling** in all API calls
7. **Loading states** for better UX

## 🔗 Useful Links

- [Styled Components Docs](https://styled-components.com/)
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**Created with ❤️ for sustainable tourism**

