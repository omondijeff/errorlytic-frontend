# VAGnosis Frontend

## 🎯 **Overview**

This is the frontend application for VAGnosis, a comprehensive **Multi-tenant SaaS platform** for automotive diagnostics with AI-powered error code analysis. The frontend provides an intuitive user interface for automotive repair businesses, insurance companies, and individual users across East Africa.

> **Note**: This is the frontend component of the VAGnosis platform. For the complete project overview, see the [root README](../README.md).

### **Key Features**

- 🔐 **Role-Based Dashboards** tailored for different user types
- 📱 **Mobile-First Design** with responsive layouts
- 💰 **Multi-Currency Support** (KES, UGX, TZS, USD)
- 📊 **Interactive Analytics** with charts and visualizations
- 🎨 **Modern UI/UX** with accessibility compliance
- ⚡ **Real-Time Updates** with WebSocket integration
- 📁 **File Upload** with drag-and-drop functionality
- 📋 **Step-by-Step Walkthroughs** for repair processes

---

## 🏗️ **Project Structure**

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Common components (Button, Modal, etc.)
│   │   ├── forms/          # Form components
│   │   ├── charts/         # Chart and visualization components
│   │   └── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── analysis/       # Analysis pages
│   │   ├── quotations/     # Quotation pages
│   │   └── billing/        # Billing pages
│   ├── services/           # API service layer
│   │   ├── api.js          # API client configuration
│   │   ├── auth.js         # Authentication services
│   │   ├── analysis.js     # Analysis services
│   │   └── billing.js      # Billing services
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   ├── assets/             # Static assets
│   └── App.js              # Main App component
├── public/                 # Public static files
└── README.md               # This file
```

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 16+
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

### **Installation**

1. **Install Dependencies**
```bash
npm install
# or
yarn install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Server**
```bash
npm start
# or
yarn start
```

4. **Access the Application**
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3000` (configured in .env)

---

## 🎨 **Design System**

### **Color Palette**

#### **Severity Levels**
- **Critical**: `#DC2626` (Red)
- **High**: `#EA580C` (Orange)
- **Medium**: `#D97706` (Yellow)
- **Low**: `#16A34A` (Green)

#### **Status Colors**
- **Success**: `#16A34A` (Green)
- **Warning**: `#D97706` (Yellow)
- **Error**: `#DC2626` (Red)
- **Info**: `#2563EB` (Blue)

### **Typography**
- **Primary Font**: Inter, system-ui, sans-serif
- **Monospace**: 'Fira Code', 'Monaco', monospace

### **Spacing Scale**
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**
- Touch-friendly interfaces
- Swipe gestures for navigation
- Optimized for small screens
- Progressive Web App (PWA) capabilities

---

## 🔐 **Authentication Flow**

### **User Roles & Permissions**

| Role | Dashboard Features | Permissions |
|------|-------------------|-------------|
| **individual** | Personal dashboard | Basic analysis, personal quotations |
| **garage_user** | Garage dashboard | Organization analysis, quotations |
| **garage_admin** | Admin dashboard | Full garage management, billing |
| **insurer_user** | Insurance dashboard | View claims, basic analysis |
| **insurer_admin** | Admin dashboard | Full insurance management |
| **superadmin** | System dashboard | Full system access |

### **Authentication Components**
- Login/Register forms
- Password reset flow
- Role selection interface
- Team invitation system
- Two-factor authentication (2FA)

---

## 📊 **Key Features**

### **Dashboard System**
- **Role-Aware Dashboards**: Different layouts for each user role
- **Usage Statistics**: Visual progress bars and limit indicators
- **Activity Feeds**: Recent actions and notifications
- **Quick Actions**: Role-specific action buttons

### **File Upload & Analysis**
- **Drag-and-Drop Upload**: Support for VCDS/OBD files
- **Progress Tracking**: Real-time upload and analysis progress
- **File Management**: Upload history and file organization
- **Format Support**: .txt, .csv, .xml files

### **Analysis Display**
- **Error Code Visualization**: Color-coded severity levels
- **AI-Powered Insights**: Plain language explanations
- **Interactive Charts**: Error distribution and trends
- **Export Functionality**: PDF generation and sharing

### **Repair Walkthroughs**
- **Step-by-Step Interface**: Stepper UI with navigation
- **Interactive Editing**: Add/edit/remove steps
- **Progress Tracking**: Completion status and time estimates
- **Export Options**: PDF generation for offline use

### **Quotation System**
- **Dynamic Pricing**: Real-time calculation engine
- **Multi-Currency Support**: KES, UGX, TZS, USD
- **Status Management**: Track customer decisions
- **Sharing Options**: Links and PDF exports

### **Billing & Subscriptions**
- **Plan Comparison**: Feature matrix and pricing
- **Usage Monitoring**: Track limits and usage
- **Payment History**: Transaction and invoice management
- **Invoice Generation**: Professional PDF invoices

---

## 🛠️ **Technology Stack**

### **Core Technologies**
- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router v6
- **Styling**: Styled Components or Emotion
- **Forms**: React Hook Form with Yup validation

### **UI Libraries**
- **Component Library**: Material-UI, Ant Design, or Chakra UI
- **Icons**: React Icons or Heroicons
- **Charts**: Chart.js, D3.js, or Recharts
- **Date Picker**: React DatePicker
- **File Upload**: React Dropzone

### **Development Tools**
- **Build Tool**: Vite or Create React App
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Type Checking**: TypeScript

---

## 🧪 **Testing Strategy**

### **Testing Levels**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Complete user journey testing
- **Accessibility Tests**: WCAG compliance testing

### **Test Coverage Goals**
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Complete user journeys
- **Accessibility**: 100% WCAG compliance

### **Testing Tools**
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **axe-core**: Accessibility testing

---

## 📱 **Progressive Web App (PWA)**

### **PWA Features**
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Real-time notifications
- **App Installation**: Install as native app
- **Background Sync**: Sync data when online

### **Mobile Optimizations**
- **Touch Gestures**: Swipe navigation and interactions
- **Camera Integration**: Photo capture for vehicle identification
- **GPS Integration**: Location-based features
- **Performance**: Optimized for mobile devices

---

## 🔧 **Development Guidelines**

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Enforced code quality rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### **Component Guidelines**
- **Functional Components**: Use React hooks
- **Props Interface**: Define TypeScript interfaces
- **Error Boundaries**: Implement error handling
- **Accessibility**: WCAG 2.1 AA compliance

### **Performance Guidelines**
- **Code Splitting**: Lazy loading for routes
- **Memoization**: Use React.memo and useMemo
- **Bundle Optimization**: Tree shaking and compression
- **Image Optimization**: WebP format and lazy loading

---

## 📚 **User Stories**

For detailed user stories and requirements, see:
- **Frontend User Stories**: [docs/FRONTEND_USER_STORIES.md](../docs/FRONTEND_USER_STORIES.md)

### **Key User Stories**
- **US-001**: User registration with role selection
- **US-007**: Role-aware dashboard system
- **US-010**: File upload with progress tracking
- **US-012**: AI-powered analysis display
- **US-016**: Repair walkthrough generation
- **US-020**: Quotation generation and editing
- **US-025**: Subscription plan management

---

## 🚀 **Deployment**

### **Build Process**
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### **Environment Configuration**
```bash
# Development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development

# Production
REACT_APP_API_URL=https://api.vagnosis.com
REACT_APP_ENV=production
```

### **Deployment Options**
- **Vercel**: Recommended for React applications
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **Docker**: Containerized deployment

---

## 📊 **Analytics & Monitoring**

### **User Analytics**
- **Page Views**: Track user navigation
- **Feature Usage**: Monitor feature adoption
- **Performance Metrics**: Load times and errors
- **Conversion Tracking**: Registration and subscription rates

### **Error Monitoring**
- **Client-Side Errors**: JavaScript error tracking
- **API Errors**: Failed request monitoring
- **Performance Issues**: Slow loading detection
- **User Feedback**: Error reporting system

---

## 🤝 **Contributing**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** changes with tests
4. **Submit** a pull request
5. **Review** and merge

### **Code Review Process**
- **Automated Tests**: All tests must pass
- **Code Quality**: ESLint and TypeScript checks
- **Accessibility**: WCAG compliance verification
- **Performance**: Bundle size and load time checks

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**VAGnosis Frontend v1.0.0** - Professional Automotive Diagnostic Platform

*Designed for automotive professionals across East Africa*
