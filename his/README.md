# Gram Sarvekshak - Survey and Report Management System

A comprehensive web application for managing village surveys and reports, built with React and Vite.

## Features

### 🔐 Role-based Authentication
- **Surveyor Role**: Create, edit, and submit surveys
- **Supervisor Role**: Review, approve, or reject submitted surveys

### 📊 Survey Management
- Create detailed village surveys with multiple sections:
  - Basic Information (village name, population)
  - Infrastructure (electricity, water, roads, schools, hospitals)
  - Agriculture (land area, crops, irrigation methods)
  - Issues and Challenges identification
  - Recommendations and suggestions
- Save surveys as drafts or submit for review
- Edit existing surveys before submission

### 📈 Reports and Analytics
- Dashboard with statistics overview
- Visual charts showing survey status distribution
- Filter surveys by status (draft, submitted, approved, rejected)
- Detailed survey reports

### 💬 Messaging System
- Internal messaging between surveyors and supervisors
- Real-time message notifications
- Reply to messages functionality

### 🛡️ Admin Dashboard (Supervisor)
- Review all submitted surveys
- Approve or reject surveys with detailed feedback
- View comprehensive survey details
- Manage survey workflow

## Demo Credentials

### Surveyor Account
- **Username**: surveyor1
- **Password**: password123

### Supervisor Account
- **Username**: supervisor1
- **Password**: admin123

## Technology Stack

- **Frontend**: React 19 with JavaScript
- **Styling**: Plain CSS with CSS Modules approach
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Data Storage**: localStorage (with optional JSON Server)
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd gram-sarvekshak
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Optional - Start JSON Server** (for mock API):
   ```bash
   npm run server
   ```

5. **Start both frontend and backend** (recommended):
   ```bash
   npm run dev:full
   ```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   ├── StatCard.jsx    # Statistics display cards
│   ├── Table.jsx       # Data table component
│   ├── MessageList.jsx # Message list component
│   └── Modal.jsx       # Modal dialog component
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication context
├── lib/                # Utility libraries
│   ├── storage.js      # localStorage utilities
│   └── api.js          # Mock API functions
├── pages/              # Application pages
│   ├── Login.jsx       # Login page
│   ├── SurveyDashboard.jsx # Main dashboard
│   ├── SurveyForm.jsx  # Survey creation/editing
│   ├── Reports.jsx     # Reports and analytics
│   ├── Messages.jsx    # Messaging interface
│   └── AdminDashboard.jsx # Supervisor dashboard
├── styles/             # CSS stylesheets
│   ├── global.css      # Global styles and variables
│   ├── layout.css      # Layout-specific styles
│   └── components.css  # Component-specific styles
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── router.jsx          # Routing configuration
```

## Key Features Explained

### Authentication Flow
1. Users log in with role-based credentials
2. Authentication state is managed via React Context
3. Protected routes ensure proper access control
4. Automatic redirection based on user role

### Survey Workflow
1. **Surveyor** creates a new survey
2. Survey can be saved as draft or submitted
3. **Supervisor** reviews submitted surveys
4. Supervisor can approve or reject with feedback
5. Approved surveys appear in reports

### Data Persistence
- All data is stored in localStorage by default
- Optional JSON Server provides REST API endpoints
- Data persists across browser sessions
- Mock data is automatically initialized

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Responsive navigation
- Touch-friendly interface

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server (port 3001)
- `npm run dev:full` - Start both frontend and backend
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team.

---

**Gram Sarvekshak** - Empowering rural development through systematic surveys and data-driven insights.