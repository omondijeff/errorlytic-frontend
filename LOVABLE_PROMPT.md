# VAGnosis Enterprise Dashboard - Lovable Generation Prompt

## Project Overview

Create a world-class, enterprise-grade automotive diagnostic dashboard that rivals Google Cloud Console, Microsoft Azure Portal, and Apple Developer Console in terms of design sophistication, user experience, and functionality. This is VAGnosis - a comprehensive SaaS platform for automotive diagnostic analysis, repair walkthroughs, and quotation generation.

## Core Platform Features

### 🚗 **Automotive Diagnostic Intelligence**

- **VCDS/OBD File Analysis**: Upload and parse diagnostic reports (TXT, XML, PDF)
- **AI-Powered DTC Analysis**: Intelligent interpretation of Diagnostic Trouble Codes
- **Repair Walkthroughs**: Step-by-step repair guides with tools and parts
- **Smart Quotations**: Automated pricing with multi-currency support (KES, UGX, TZS, USD)
- **Vehicle Management**: Complete vehicle history and diagnostic vault

### 🏢 **Enterprise Multi-Tenancy**

- **Role-Based Access Control**: 6 distinct user roles (individual, garage_user, garage_admin, insurer_user, insurer_admin, superadmin)
- **Organization Management**: Multi-tenant workspaces for garages and insurance companies
- **Usage Metering**: Comprehensive billing and quota management
- **Audit Logging**: Complete activity tracking and compliance

### 💼 **Business Intelligence**

- **Analytics Dashboard**: Real-time insights, usage metrics, and performance KPIs
- **Billing Management**: Subscription tiers, overage tracking, and payment processing
- **Report Generation**: PDF exports, shareable links, and professional documentation
- **API Management**: Rate limiting, usage monitoring, and developer tools

## Design Requirements

### 🎨 **Visual Design Standards**

Create a design system that matches or exceeds enterprise platforms:

**Color Palette:**

- Primary: Deep automotive blue (#1e3a8a) with automotive orange accents (#f97316)
- Secondary: Professional grays (#374151, #6b7280, #9ca3af)
- Success: Forest green (#059669)
- Warning: Amber (#d97706)
- Error: Red (#dc2626)
- Background: Clean whites and subtle grays (#f9fafb, #f3f4f6)

**Typography:**

- Headers: Inter or SF Pro Display (bold, clean, modern)
- Body: Inter or SF Pro Text (excellent readability)
- Code: JetBrains Mono or SF Mono
- Hierarchical sizing: 6 levels (h1-h6) with consistent spacing

**Layout Principles:**

- **Grid System**: 12-column responsive grid with consistent gutters
- **Spacing**: 8px base unit with scale (4, 8, 16, 24, 32, 48, 64px)
- **Cards**: Subtle shadows, rounded corners (8px), proper padding
- **Navigation**: Sidebar + top bar hybrid (collapsible sidebar)
- **Content Density**: Balanced information density with breathing room

### 🖥️ **Layout Architecture**

**Main Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Top Navigation Bar (Fixed)                              │
│ [Logo] [Search] [Notifications] [User Menu] [Theme]     │
├─────────────┬───────────────────────────────────────────┤
│ Sidebar     │ Main Content Area                         │
│ (Collapsible)│                                         │
│ • Dashboard │ ┌─────────────────────────────────────┐   │
│ • Uploads   │ │ Page Header + Breadcrumbs          │   │
│ • Analysis  │ ├─────────────────────────────────────┤   │
│ • Vehicles  │ │ Content Cards & Data Tables        │   │
│ • Quotations│ │                                     │   │
│ • Settings  │ │                                     │   │
│ • Admin     │ └─────────────────────────────────────┘   │
└─────────────┴───────────────────────────────────────────┘
```

## Key Pages & Components

### 📊 **Dashboard (Primary Landing)**

**Layout**: Multi-column grid with key metrics cards
**Components**:

- **Usage Overview**: Current period usage vs limits (circular progress)
- **Recent Activity**: Timeline of uploads, analyses, quotations
- **Quick Actions**: Upload file, create quotation, view vehicles
- **Performance Metrics**: Analysis success rate, average processing time
- **Revenue Analytics**: Monthly recurring revenue, usage trends
- **System Health**: API status, queue depth, error rates

### 📁 **File Upload & Management**

**Features**:

- **Drag & Drop Zone**: Large, intuitive file drop area with progress indicators
- **File History**: Sortable table with status badges, file types, timestamps
- **Batch Operations**: Multi-select actions, bulk delete, export
- **Storage Management**: Usage visualization, cleanup tools
- **File Preview**: Quick preview for supported formats

### 🔍 **Analysis Dashboard**

**Components**:

- **DTC Code Display**: Color-coded severity badges (Critical/Recommended/Monitor)
- **AI Confidence Scores**: Visual indicators for analysis reliability
- **Module Breakdown**: Pie charts showing affected systems
- **Timeline View**: Analysis history with trend indicators
- **Export Options**: PDF, CSV, JSON formats
- **Comparison Tools**: Side-by-side analysis comparison

### 🛠️ **Repair Walkthrough Interface**

**Features**:

- **Step-by-Step Guide**: Interactive checklist with progress tracking
- **Parts Management**: OEM vs aftermarket options, pricing, availability
- **Tool Requirements**: Required tools with specifications
- **Time Estimates**: Labor hours with confidence intervals
- **Media Support**: Images, videos, diagrams for each step
- **Customization**: Editable steps, custom notes, personalization

### 💰 **Quotation Builder**

**Components**:

- **Dynamic Pricing**: Real-time calculation with currency conversion
- **Parts Database**: Searchable parts with OEM/aftermarket options
- **Labor Calculator**: Hourly rates with complexity multipliers
- **Tax & Markup**: Configurable business rules
- **Preview Mode**: Live PDF preview with professional formatting
- **Approval Workflow**: Status tracking, comments, revisions

### 🚗 **Vehicle Management**

**Features**:

- **Vehicle Registry**: VIN lookup, plate recognition, vehicle history
- **Diagnostic History**: Complete analysis timeline per vehicle
- **Maintenance Tracking**: Service intervals, recall notifications
- **Fleet Management**: Multi-vehicle operations for garages
- **Integration**: OBD scanner integration, telematics data

### ⚙️ **Settings & Administration**

**Sections**:

- **Organization Settings**: Company info, branding, currency preferences
- **User Management**: Role assignments, permissions, invitations
- **Billing & Plans**: Subscription management, usage monitoring
- **API Configuration**: Rate limits, webhooks, integrations
- **System Preferences**: Notifications, themes, language settings

## Advanced UI Components

### 📈 **Data Visualization**

- **Charts**: Line, bar, pie, donut charts with smooth animations
- **Metrics Cards**: KPI displays with trend indicators and sparklines
- **Heatmaps**: Usage patterns, error distributions
- **Timeline Views**: Activity streams, audit logs
- **Comparison Tables**: Side-by-side data analysis

### 🔔 **Notification System**

- **Toast Notifications**: Success, warning, error messages
- **In-App Alerts**: System announcements, quota warnings
- **Email Integration**: Digest emails, real-time alerts
- **Push Notifications**: Browser notifications for critical events

### 🔍 **Search & Filtering**

- **Global Search**: Search across all entities (vehicles, analyses, quotations)
- **Advanced Filters**: Multi-criteria filtering with saved filter sets
- **Quick Filters**: Predefined filter combinations
- **Search Suggestions**: Autocomplete with recent searches

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Tablet Support**: Adapted layouts for tablet form factors
- **Desktop Enhancement**: Full feature set with keyboard shortcuts
- **Progressive Web App**: Offline capabilities, app-like experience

## Technical Implementation

### 🛠️ **Technology Stack**

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand or Redux Toolkit
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts or Chart.js
- **Icons**: Lucide React or Heroicons
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library

### 🔌 **API Integration**

**Base URL**: `http://localhost:3000/api/v1`
**Authentication**: JWT Bearer tokens with automatic refresh
**Error Handling**: Comprehensive error boundaries with user-friendly messages
**Loading States**: Skeleton loaders, progress indicators, optimistic updates

### 📊 **Data Management**

- **Caching Strategy**: Intelligent caching with React Query
- **Real-time Updates**: WebSocket connections for live data
- **Offline Support**: Service worker with background sync
- **Data Persistence**: Local storage for user preferences

## User Experience Standards

### 🎯 **Interaction Design**

- **Micro-interactions**: Subtle animations for feedback and delight
- **Loading States**: Engaging loading animations, not just spinners
- **Empty States**: Helpful illustrations and guidance
- **Error States**: Clear error messages with recovery actions
- **Success Feedback**: Confirmation animations and progress indicators

### ♿ **Accessibility**

- **WCAG 2.1 AA Compliance**: Full accessibility standards
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: High contrast ratios for readability
- **Focus Management**: Clear focus indicators and logical tab order

### 🌍 **Internationalization**

- **Multi-language Support**: English (primary), Swahili (secondary)
- **Currency Formatting**: Proper localization for East African currencies
- **Date/Time Formats**: Regional formatting preferences
- **RTL Support**: Right-to-left language support

## Performance Requirements

### ⚡ **Performance Standards**

- **Initial Load**: < 3 seconds for first meaningful paint
- **Navigation**: < 500ms for route transitions
- **API Responses**: < 2 seconds for data operations
- **File Uploads**: Progress indicators with chunked uploads
- **Bundle Size**: Optimized with code splitting and lazy loading

### 🔧 **Optimization Techniques**

- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Caching**: Aggressive caching with proper invalidation
- **Compression**: Gzip/Brotli compression for assets
- **CDN**: Static asset delivery via CDN

## Security & Compliance

### 🔒 **Security Features**

- **Authentication**: Secure JWT implementation with refresh tokens
- **Authorization**: Role-based access control with permission checks
- **Data Protection**: Encryption in transit and at rest
- **Audit Logging**: Complete user activity tracking
- **Input Validation**: Comprehensive client and server-side validation

### 📋 **Compliance**

- **GDPR Compliance**: Data privacy controls and user consent
- **Industry Standards**: Automotive industry security requirements
- **Data Retention**: Configurable data retention policies
- **Backup & Recovery**: Automated backup and disaster recovery

## Success Metrics

### 📊 **Key Performance Indicators**

- **User Engagement**: Time spent in application, feature adoption
- **Task Completion**: Upload-to-analysis-to-quotation workflow success
- **Performance**: Page load times, API response times
- **User Satisfaction**: NPS scores, user feedback ratings
- **Business Impact**: Revenue per user, usage growth

## Deliverables

### 🎨 **Design System**

- Complete component library with documentation
- Style guide with color palettes, typography, spacing
- Icon library with consistent visual language
- Animation guidelines and micro-interaction patterns

### 💻 **Application Features**

- Fully functional dashboard with all core features
- Responsive design across all device types
- Complete API integration with error handling
- User authentication and role-based access
- File upload and management system
- Analysis visualization and reporting
- Quotation builder with PDF export
- Settings and administration panels

### 📚 **Documentation**

- Component documentation with usage examples
- API integration guide
- User manual and help system
- Deployment and configuration instructions

## Final Notes

This dashboard should feel like a premium enterprise product that automotive professionals would be proud to use daily. It should combine the sophistication of Google Cloud Console with the user-friendliness of modern SaaS applications, specifically tailored for the automotive diagnostic industry.

The design should convey trust, professionalism, and technical expertise while remaining intuitive and efficient for daily use. Every interaction should feel polished and purposeful, with attention to detail that matches the quality of enterprise platforms from major tech companies.

Focus on creating a product that not only meets functional requirements but also delights users with its design quality and user experience excellence.
