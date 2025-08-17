# DeQuote VAG Car Quotation System

A comprehensive car quotation estimate system specifically designed for VAG Group vehicles (Volkswagen, Audi, Porsche, Skoda, Seat, Fiat) with AI-powered error code explanations and repair estimates in Kenya Shillings.

## Features

- **VAG-Specific Focus**: Specialized for Volkswagen Group vehicles
- **VCDS Report Processing**: Upload and analyze VCDS diagnostic reports
- **AI-Powered Explanations**: ChatGPT integration for detailed error code explanations
- **Cost Estimation**: Automatic repair cost calculations in Kenya Shillings (KES)
- **User Management**: Role-based access control (User, Mechanic, Admin)
- **File Management**: Secure VCDS report upload and storage
- **RESTful API**: Comprehensive API endpoints for all functionality
- **Docker Support**: Full containerization with MongoDB

## Supported Vehicle Makes

- Volkswagen
- Audi
- Porsche
- Skoda
- Seat
- Fiat

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-4 API
- **File Upload**: Multer with file validation
- **Authentication**: JWT with bcrypt
- **Containerization**: Docker & Docker Compose
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js 16+
- Docker and Docker Compose
- OpenAI API key (optional, for AI features)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd deQuote
```

### 2. Environment Setup

Copy the environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dequote_vag

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

### 3. Docker Deployment

Start the entire system with Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Manual Installation

If you prefer to run without Docker:

```bash
# Install dependencies
npm install

# Start MongoDB (ensure MongoDB is running)
# Start the application
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Quotations

- `POST /api/quotations` - Create new quotation
- `GET /api/quotations` - List user quotations
- `GET /api/quotations/:id` - Get specific quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/process-vcds` - Process VCDS report
- `POST /api/quotations/:id/approve` - Approve quotation

### Error Codes

- `GET /api/error-codes` - List error codes with filtering
- `GET /api/error-codes/:code` - Get specific error code
- `GET /api/error-codes/search/autocomplete` - Search error codes
- `GET /api/error-codes/stats/summary` - Error code statistics
- `GET /api/error-codes/vehicle/:make` - Vehicle-specific error codes

### File Upload

- `POST /api/upload/vcds-report` - Upload VCDS report
- `GET /api/upload/vcds-report/:quotationId` - Get report info
- `DELETE /api/upload/vcds-report/:quotationId` - Remove report
- `GET /api/upload/vcds-report/:quotationId/download` - Download report

## Usage Examples

### 1. Create a Quotation

```bash
curl -X POST http://localhost:3000/api/quotations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleInfo": {
      "make": "Volkswagen",
      "model": "Golf",
      "year": 2020,
      "vin": "WVWZZZ1KZAW123456",
      "mileage": 50000
    },
    "notes": "Engine check light on"
  }'
```

### 2. Upload VCDS Report

```bash
curl -X POST http://localhost:3000/api/upload/vcds-report \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "quotationId=QUOTATION_ID" \
  -F "vcdsReport=@/path/to/vcds_report.txt"
```

### 3. Process VCDS Report

```bash
curl -X POST http://localhost:3000/api/quotations/QUOTATION_ID/process-vcds \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Error Code Details

```bash
curl http://localhost:3000/api/error-codes/P0300
```

## VCDS Report Format Support

The system supports various VCDS report formats:

- **Text files** (.txt) - Plain text diagnostic reports
- **CSV files** (.csv) - Comma-separated diagnostic data
- **PDF files** (.pdf) - PDF diagnostic reports
- **Excel files** (.xls, .xlsx) - Spreadsheet diagnostic data
- **JSON files** (.json) - Structured diagnostic data

## AI Integration

### OpenAI Configuration

To enable AI-powered error code explanations:

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add your API key to the `.env` file
3. The system will automatically use AI for:
   - Error code explanations
   - Repair recommendations
   - Cost-saving suggestions
   - Troubleshooting steps

### AI Features

- **Smart Error Explanations**: Context-aware explanations for VAG vehicles
- **Repair Recommendations**: AI-suggested repair priorities and methods
- **Cost Optimization**: Suggestions for cost-effective repair strategies
- **Troubleshooting**: Step-by-step diagnostic procedures

## Database Schema

### Collections

- **users**: User accounts and authentication
- **quotations**: Car repair quotations and estimates
- **error_codes**: VAG-specific error code database
- **repair_costs**: Repair cost categories and labor rates

### Key Models

- **User**: Authentication, roles, profile information
- **Quotation**: Vehicle info, VCDS reports, error codes, cost estimates
- **ErrorCode**: Error details, severity, costs, VAG compatibility
- **RepairCost**: Labor rates, parts costs, category breakdowns

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Role-Based Access**: User, Mechanic, and Admin roles
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: File type and size restrictions
- **CORS Protection**: Cross-origin request security

## Development

### Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm test             # Run tests
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
```

### Project Structure

```
deQuote/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── services/        # Business logic services
├── uploads/         # File upload storage
├── docker-compose.yml
├── Dockerfile
├── server.js        # Main application file
└── package.json
```

## Monitoring & Health Checks

- **Health Endpoint**: `GET /health` - System status check
- **Docker Health**: Built-in Docker health checks
- **MongoDB Monitoring**: Connection status monitoring
- **Error Logging**: Comprehensive error logging and tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the API documentation

## Roadmap

- [ ] Web-based frontend interface
- [ ] Mobile application
- [ ] Advanced VCDS parsing
- [ ] Integration with parts suppliers
- [ ] Customer management system
- [ ] Reporting and analytics dashboard
- [ ] Multi-language support
- [ ] Advanced AI diagnostics

---

**Note**: This system is specifically designed for VAG Group vehicles and provides estimates in Kenya Shillings (KES). For other vehicle brands or currencies, modifications may be required.
