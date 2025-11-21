# 🏢 Employee Organization Chart

> An interactive, drag-and-drop organization chart built with React that visualizes company hierarchy and allows real-time employee management.

## ✨ Features

### 🎯 Core Functionality
- **📊 Interactive Organization Chart** - Visual tree structure showing company hierarchy
- **🔍 Smart Search** - Real-time search by name, designation, or team
- **🏷️ Team Filtering** - Filter employees by department with automatic hierarchy preservation
- **↔️ Drag & Drop** - Intuitive drag-and-drop to reassign employee managers
- **⚡ Optimistic Updates** - Instant UI feedback with background API sync
- **🎨 Visual Feedback** - Color-coded highlights, animations, and status indicators

### 🎮 User Experience
- **🔎 Zoom & Pan Controls** - Mouse wheel zoom (30%-300%) and drag-to-pan
- **🎯 Preset Zoom Levels** - Quick buttons for 50%, 75%, 100%, 150%
- **🎨 Beautiful Notifications** - Non-intrusive toast notifications for all actions
- **🚫 Smart Validation** - Prevents circular reporting structures
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **♿ Accessibility** - Keyboard navigation and screen reader support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ProfessorAyush/Employee-Organization-Chart.git
cd employee-org-chart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=http://localhost:3001/api
```

4. **Start the development server**
```bash
npm start
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Tech Stack

### Core Technologies
- **React 18** - UI library with hooks
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Custom styling with flexbox and grid

### Key Libraries
| Library | Purpose | Version |
|---------|---------|---------|
| `react-organizational-chart` | Tree structure visualization | ^2.2.0 |
| `react-zoom-pan-pinch` | Zoom and pan functionality | ^3.1.0 |
| `react-hot-toast` | Beautiful toast notifications | ^2.4.1 |
| `styled-components` | CSS-in-JS styling | ^6.1.0 |

### Development Tools
- **Create React App** - React project setup
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
employee-org-chart/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # App icon
├── src/
│   ├── components/             # React components
│   │   ├── EmployeeList.jsx   # Left sidebar with search/filter
│   │   └── OrgChart.jsx       # Organization chart with drag-drop
│   ├── services/              # API services
│   │   └── api.js             # API calls (fetch, update)
│   ├── utils/                 # Helper functions
│   │   └── chartHelpers.js    # Data transformation utilities
│   ├── App.js                 # Main application component
│   ├── App.css                # Global styles
│   └── index.js               # Application entry point
├── .env                       # Environment variables
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

---

## 🎯 Usage Guide

### 1. Search for Employees
Type in the search box to filter employees by:
- Name (e.g., "John")
- Designation (e.g., "Manager")
- Team (e.g., "Engineering")

### 2. Filter by Team
Use the dropdown to view specific teams:
- Select a team to see only those employees
- Managers from other teams are included for hierarchy context
- Filtered employees are highlighted in purple

### 3. Navigate the Chart
- **Zoom In/Out**: Scroll mouse wheel or use +/- buttons
- **Pan**: Click and drag on empty space
- **Reset View**: Click the ⊙ button or double-click
- **Preset Zoom**: Use 50%, 75%, or 150% buttons

### 4. Reassign Managers (Drag & Drop)
1. Click and hold an employee card
2. Drag over the new manager's card
3. Release to drop
4. See instant visual feedback
5. Toast notification confirms the change

### 5. Error Prevention
The app prevents:
- ❌ Circular reporting structures (A reports to B, B to A)
- ❌ Self-reporting (employee can't be their own manager)
- ❌ Invalid relationships

---

## 🔧 Configuration

### API Endpoints

Configure your backend API in `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// GET /api/employees - Fetch all employees
// PATCH /api/employees/:id - Update employee manager
```

### Mock Data

For development without a backend, use MirageJS:

```javascript
// src/index.js
import { makeServer } from './mirage';

if (process.env.NODE_ENV === 'development') {
  makeServer();
}
```

Example employee structure:
```json
{
  "id": "1",
  "name": "Jane Smith",
  "designation": "CEO",
  "team": "Executive",
  "managerId": null,
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 🎨 Customization

### Styling

Modify colors in `App.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --error-color: #ef4444;
}
```

### Zoom Limits

Adjust zoom range in `OrgChart.jsx`:
```javascript
<TransformWrapper
  minScale={0.3}  // Minimum zoom (30%)
  maxScale={3}    // Maximum zoom (300%)
  initialScale={1} // Starting zoom (100%)
/>
```

### Toast Configuration

Customize notifications in `App.js`:
```javascript
<Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: { /* your styles */ }
  }}
/>
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Example Test Cases
```javascript
// Search functionality
test('filters employees by search term', () => {
  // Test implementation
});

// Drag and drop
test('updates manager on successful drop', () => {
  // Test implementation
});

// Validation
test('prevents circular reporting structure', () => {
  // Test implementation
});
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production
Set these in your hosting platform:
```env
REACT_APP_API_URL=https://your-api.com/api
GENERATE_SOURCEMAP=false
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Source map warnings during build
```bash
# Solution: Add to .env file
GENERATE_SOURCEMAP=false
```

**Issue:** Drag and drop not working
- Ensure `e.stopPropagation()` is called in drag handlers
- Check that panning is disabled during drag

**Issue:** API calls failing
- Verify `REACT_APP_API_URL` in `.env`
- Check CORS configuration on backend
- Ensure API endpoints match expected format

---

## 📈 Performance Optimization

### Implemented Optimizations
-  React.memo for expensive components
-  useCallback for event handlers
-  useMemo for computed values
-  Lazy loading for images
-  Debounced search input
-  Virtual scrolling for large lists (optional)


### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features


---



### Version History
- **v1.0.0** (2025-11-21) - Initial release
  - Basic org chart visualization
  - Drag & drop functionality
  - Search and filter

---

**Made with ❤️ and React**