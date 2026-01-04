# Errorlytic Frontend

## 🎯 **Overview**

This is the frontend application for Errorlytic, a comprehensive **Multi-tenant SaaS platform** for automotive diagnostics with AI-powered error code analysis. The frontend provides an intuitive user interface for automotive repair businesses, insurance companies, and individual users across East Africa.

> **Note**: This is the frontend component of the Errorlytic platform. For the complete project overview, see the [root README](../README.md).

## 🚀 **Tech Stack**

### **Core Technologies**

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### **UI/UX Libraries**

- **Framer Motion** - Smooth animations and transitions
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons
- **Lucide React** - Additional icon library

### **Form Handling**

- **React Hook Form** - Performant forms with easy validation
- **Yup** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### **Data Fetching**

- **RTK Query** - Data fetching and caching
- **TanStack Query** - Server state management
- **Axios** - HTTP client

### **Web3 Integration** (Future)

- **Ethers.js** - Ethereum library
- **Web3Modal** - Wallet connection
- **Wagmi** - React hooks for Ethereum

## 🎨 **Design System**

### **Brand Colors (Tajilabs)**

```css
Primary Orange: #E05426 (HSL: 13 78% 52%)
Secondary Orange: #FFAB88 (HSL: 19 100% 76%)
```

### **Typography**

- **Primary Font**: Poppins (300, 400, 500, 600, 700)
- **Secondary Font**: Lexend Deca (300, 400, 500, 600, 700)
- **Accent Font**: Montserrat (300, 400, 500, 600, 700)

### **Design Principles**

- **Apple Standards**: Clean, minimal, intuitive interface
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive**: Mobile-first design approach
- **Performance**: Optimized for speed and smooth interactions

## 📁 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   ├── UI/             # Basic UI components
│   ├── Forms/          # Form components
│   └── Charts/         # Chart components
├── pages/              # Page components
│   ├── Auth/           # Login, Register pages
│   ├── Dashboard/      # Dashboard page
│   ├── Analysis/       # Analysis pages
│   ├── Quotations/     # Quotation pages
│   ├── Billing/        # Billing pages
│   └── Profile/        # Profile pages
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── index.ts        # Store configuration
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # App constants
```

## 🛠 **Setup & Installation**

### **Prerequisites**

- Node.js 18+
- npm or yarn
- Backend API running on port 3003

### **Installation**

1. **Clone and navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### **Available Scripts**

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run tests
```

## 🔐 **Authentication**

The frontend implements a comprehensive authentication system with:

- **JWT Token Management** - Secure token storage and refresh
- **Role-Based Access Control** - 6 different user roles
- **Protected Routes** - Automatic redirects for unauthorized access
- **Persistent Sessions** - Remember user login state

### **User Roles**

1. **Individual** - Personal diagnostic analysis
2. **Garage User** - Basic garage operations
3. **Garage Admin** - Full garage management
4. **Insurer User** - Insurance claim analysis
5. **Insurer Admin** - Insurance company management
6. **Superadmin** - Platform administration

## 🎨 **UI Components**

### **Design System Components**

- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Elevated cards with hover effects
- **Forms**: Accessible form inputs with validation
- **Loading States**: Smooth loading spinners and skeletons
- **Modals**: Accessible modal dialogs
- **Navigation**: Responsive sidebar and header

### **Custom Styling**

- **Gradient Backgrounds** - Tajilabs brand gradients
- **Glass Effects** - Modern glassmorphism
- **Smooth Animations** - Framer Motion transitions
- **Shadow System** - Consistent elevation shadows

## 📱 **Responsive Design**

The frontend is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 **Performance Optimizations**

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Component lazy loading
- **Image Optimization** - Optimized image loading
- **Bundle Analysis** - Regular bundle size monitoring
- **Caching** - RTK Query caching strategies

## 🔧 **Development Guidelines**

### **Code Style**

- **TypeScript** - Strict type checking enabled
- **ESLint** - Consistent code formatting
- **Prettier** - Automatic code formatting
- **Conventional Commits** - Standardized commit messages

### **Component Guidelines**

- **Functional Components** - Use React hooks
- **TypeScript Props** - Properly typed component props
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Memoization where appropriate

## 🌐 **API Integration**

The frontend integrates with the Errorlytic backend API:

- **Base URL**: `http://localhost:3003/api/v1`
- **Authentication**: JWT Bearer tokens
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: Skeleton screens and spinners
- **Caching**: RTK Query automatic caching

## 🔮 **Future Features**

### **Web3 Integration**

- **Blockchain Authentication** - Wallet-based login
- **NFT Certificates** - Digital diagnostic certificates
- **Smart Contracts** - Automated billing and payments
- **Decentralized Storage** - IPFS for diagnostic files

### **Advanced Features**

- **Real-time Updates** - WebSocket integration
- **Offline Support** - Progressive Web App features
- **Mobile App** - React Native mobile app
- **Analytics Dashboard** - Advanced reporting

## 📊 **Analytics & Monitoring**

- **Performance Monitoring** - Core Web Vitals tracking
- **Error Tracking** - Comprehensive error reporting
- **User Analytics** - User behavior tracking
- **A/B Testing** - Feature flag system

## 🤝 **Contributing**

1. Follow the established code style
2. Write comprehensive TypeScript types
3. Add proper error handling
4. Include accessibility features
5. Test on multiple devices and browsers

## 📄 **License**

This project is part of the Errorlytic platform by Tajilabs. All rights reserved.

---

**Built with ❤️ by Tajilabs**
