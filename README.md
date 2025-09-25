# Errorlytic - Automotive Diagnostic Platform

## 🚗 **Overview**

Errorlytic is a comprehensive **Multi-tenant SaaS platform** for automotive diagnostics with AI-powered error code analysis. The platform serves automotive repair businesses, insurance companies, and individual users across East Africa with advanced diagnostic capabilities, billing management, and multi-currency support.

### **Key Features**

- 🔐 **Multi-tenant Architecture** with organization-based isolation
- 🤖 **AI-Powered Analysis** using OpenAI for intelligent error code interpretation
- 💰 **Multi-Currency Support** (KES, UGX, TZS, USD) with proper formatting
- 📊 **Advanced Billing System** with subscriptions, invoicing, and fraud detection
- 🔒 **Role-Based Access Control** with 6 distinct user roles
- 📁 **S3-Compatible File Storage** for diagnostic reports and documents
- ⚡ **Real-time Caching** with Redis for optimal performance
- 📋 **Comprehensive Audit Logging** for compliance and tracking
- 🐳 **Docker-Ready** with complete containerization setup

---

## 🏗️ **Project Structure**

```
Errorlytic/
├── backend/                 # Backend API (Node.js + Express)
│   ├── routes/             # API route handlers
│   ├── models/             # MongoDB data models
│   ├── services/           # Business logic services
│   ├── middleware/         # Express middleware
│   ├── tests/              # Backend tests
│   └── README.md           # Backend documentation
├── frontend/               # Frontend Application (React)
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── README.md           # Frontend documentation
├── docs/                   # Shared documentation
│   ├── shared/             # Common documentation
│   └── FRONTEND_USER_STORIES.md
└── README.md               # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 16+
- MongoDB 6.0+
- Redis 7+
- MinIO (S3-compatible storage)
- OpenAI API Key
- Stripe Account (for payments)

### **Development Setup**

1. **Clone the repository**

```bash
git clone <repository-url>
cd Errorlytic
```

2. **Backend Setup**

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup** (when implemented)

```bash
cd frontend
npm install
npm start
```

4. **Docker Setup** (Alternative)

```bash
cd backend
docker-compose up -d
```

---

## 📋 **Documentation**

- **Backend API**: [backend/README.md](backend/README.md)
- **Frontend User Stories**: [docs/FRONTEND_USER_STORIES.md](docs/FRONTEND_USER_STORIES.md)
- **API Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

---

## 🎯 **User Roles**

| Role              | Description              | Permissions                         |
| ----------------- | ------------------------ | ----------------------------------- |
| **individual**    | Individual users         | Basic analysis, personal quotations |
| **garage_user**   | Garage employees         | Organization analysis, quotations   |
| **garage_admin**  | Garage administrators    | Full garage management, billing     |
| **insurer_user**  | Insurance employees      | View claims, basic analysis         |
| **insurer_admin** | Insurance administrators | Full insurance management           |
| **superadmin**    | System administrators    | Full system access                  |

---

## 💰 **Multi-Currency Support**

| Currency           | Code | Symbol | Format Example |
| ------------------ | ---- | ------ | -------------- |
| Kenyan Shilling    | KES  | KSh    | KSh 1,000.00   |
| Ugandan Shilling   | UGX  | USh    | USh 1,000.00   |
| Tanzanian Shilling | TZS  | TSh    | TSh 1,000.00   |
| US Dollar          | USD  | $      | $1,000.00      |

---

## 🔧 **Technology Stack**

### **Backend**

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management
- **File Storage**: MinIO (S3-compatible)
- **AI Integration**: OpenAI GPT-4
- **Authentication**: JWT with refresh tokens
- **Payment**: Stripe integration
- **Documentation**: Swagger/OpenAPI 3.0

### **Frontend** (Planned)

- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **UI Library**: Material-UI or Ant Design
- **Charts**: Chart.js or D3.js
- **Forms**: React Hook Form with Yup validation

---

## 🐳 **Docker Deployment**

```bash
# Start all services
cd backend
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### **Docker Services**

| Service           | Port      | Description           |
| ----------------- | --------- | --------------------- |
| **app**           | 3002      | Main API application  |
| **mongo**         | 27018     | MongoDB database      |
| **mongo-express** | 9091      | MongoDB web interface |
| **redis**         | 6381      | Redis cache           |
| **minio**         | 9002/9003 | S3-compatible storage |

---

## 🧪 **Testing**

### **Backend Testing**

```bash
cd backend
npm test
npm run test:coverage
```

### **API Testing**

- **Postman Collection**: Available in `backend/` directory
- **Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📊 **API Endpoints**

### **Authentication** (`/api/v1/auth`)

- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Token refresh
- `GET /profile` - Get user profile

### **File Upload & Analysis** (`/api/v1/upload`, `/api/v1/analysis`)

- `POST /upload` - Upload VCDS/OBD files
- `POST /analysis/process/:uploadId` - Generate AI analysis
- `GET /analysis/:id` - Get analysis details

### **Walkthroughs** (`/api/v1/walkthrough`)

- `POST /walkthrough/generate/:analysisId` - Generate repair walkthrough
- `GET /walkthrough/:analysisId` - Get walkthrough

### **Quotations** (`/api/v1/quotations`)

- `POST /quotations/generate/:analysisId` - Generate quotation
- `GET /quotations` - List quotations
- `GET /quotations/:id/export` - Export as PDF

### **Billing** (`/api/v1/billing`)

- `GET /billing/plans` - Available subscription plans
- `POST /billing/subscribe` - Create subscription
- `GET /billing/dashboard` - Billing dashboard

---

## 🔒 **Security Features**

- **JWT Authentication** with refresh token rotation
- **Role-Based Access Control** (RBAC)
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **Fraud Detection** system
- **Audit Logging** for compliance
- **CORS Configuration** for cross-origin requests

---

## 📈 **Performance & Monitoring**

- **Redis Caching** for optimal performance
- **Health Check Endpoint**: `/health`
- **Usage Statistics**: `/api/v1/billing/dashboard`
- **Analysis Metrics**: `/api/v1/analysis/statistics/dashboard`
- **Comprehensive Logging** and error tracking

---

## 🤝 **Contributing**

### **Development Guidelines**

- Follow RESTful API conventions
- Write comprehensive tests
- Update documentation for new features
- Follow the existing code structure

### **Getting Help**

- **Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)
- **Issues**: Create GitHub issues for bugs and feature requests

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Errorlytic v1.0.0** - Professional Automotive Diagnostic Platform

_Built with ❤️ for the automotive industry in East Africa_
