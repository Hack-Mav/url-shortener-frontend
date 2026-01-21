# URL Shortener Frontend

A modern, responsive React frontend for a URL shortening service with advanced features including bulk operations, analytics, QR code generation, and comprehensive security measures.

## 🚀 Features

- **URL Shortening**: Create short URLs with optional custom aliases and expiration dates
- **Bulk Operations**: Shorten multiple URLs simultaneously
- **URL History**: View and manage shortened URL history with pagination
- **Analytics**: Track click statistics and performance metrics
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Rate Limiting**: Built-in rate limiting with user-friendly alerts
- **Security**: CSRF protection, HTTPS enforcement, and security headers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **TypeScript**: Full TypeScript support for type safety
- **Code Splitting**: Lazy loading for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **QR Codes**: qrcode.js
- **Notifications**: React Hot Toast
- **Testing**: Jest with React Testing Library
- **Build Tool**: Create React App with custom scripts

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API service (compatible endpoints required)

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortener-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   REACT_APP_BASE_URL_FOR_URL_SHORTENER=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run dev` - Run type-check and start development server

## 🏗️ Project Structure

```
src/
├── Components/
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/              # UI components (Shortener, History, etc.)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── api.ts               # API client configuration
└── App.tsx              # Main application component
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_BASE_URL_FOR_URL_SHORTENER` | Base URL for API endpoints | Required |

### API Endpoints

The frontend expects the following API endpoints:

#### URL Operations
- `POST /shorten` - Create short URL
- `POST /bulk-shorten` - Create multiple short URLs
- `POST /history` - Get URL history (paginated)
- `GET /analytics/{shortId}` - Get URL analytics

#### Request/Response Formats

**Shorten URL Request:**
```json
{
  "long_url": "https://example.com",
  "custom_alias": "my-link",
  "expiry_date": "2024-12-31"
}
```

**Shorten URL Response:**
```json
{
  "success": true,
  "data": {
    "short_id": "my-link",
    "short_url": "https://short.ly/my-link",
    "long_url": "https://example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "expires_at": "2024-12-31T23:59:59Z"
  }
}
```

**History Request:**
```json
{
  "page": 1,
  "limit": 10
}
```

**History Response:**
```json
{
  "success": true,
  "data": [
    {
      "short_id": "abc123",
      "short_url": "https://short.ly/abc123",
      "long_url": "https://example.com",
      "clicks": 42,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Ensure your backend API is accessible at the configured URL

### Using Docker Directly

1. **Build the Docker image**
   ```bash
   docker build -t url-shortener-frontend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e REACT_APP_BASE_URL_FOR_URL_SHORTENER=http://your-backend-url/api \
     url-shortener-frontend
   ```

## 🚀 Production Deployment

### Environment Preparation

1. **Set production environment variables**
   ```env
   REACT_APP_BASE_URL_FOR_URL_SHORTENER=https://your-production-api.com/api
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

### Deployment Options

#### Static Hosting (Vercel, Netlify, etc.)

1. **Build and deploy**
   ```bash
   npm run build
   # Deploy the build/ directory to your hosting provider
   ```

2. **Configure environment variables** in your hosting platform

#### Docker Deployment

1. **Build production image**
   ```bash
   docker build -t url-shortener-frontend:latest .
   ```

2. **Run with nginx**
   ```bash
   docker run -p 80:80 \
     -e REACT_APP_BASE_URL_FOR_URL_SHORTENER=https://your-api.com/api \
     url-shortener-frontend:latest
   ```

#### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener-frontend
  template:
    metadata:
      labels:
        app: url-shortener-frontend
    spec:
      containers:
      - name: frontend
        image: url-shortener-frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_BASE_URL_FOR_URL_SHORTENER
          value: "https://your-api.com/api"
```

## 🔒 Security Features

- **CSRF Protection**: Automatic CSRF token generation and validation
- **HTTPS Enforcement**: All API calls forced to use HTTPS in production
- **Security Headers**: Custom security headers for API requests
- **Rate Limiting**: Client-side rate limiting detection and user alerts
- **Input Validation**: URL validation and sanitization
- **XSS Prevention**: React's built-in XSS protection

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

- Unit tests for hooks and utilities
- Component integration tests
- API client tests
- Type checking tests

## 📊 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: HTTP caching headers for static assets
- **Image Optimization**: Optimized image assets
- **Component Memoization**: React.memo for expensive components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Follow the existing component structure

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the `REACT_APP_BASE_URL_FOR_URL_SHORTENER` environment variable
   - Check if the backend API is running and accessible
   - Ensure CORS is configured on the backend

2. **Build Errors**
   - Run `npm run type-check` to check for TypeScript errors
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Docker Issues**
   - Ensure Docker is running and accessible
   - Check port conflicts with other services
   - Verify environment variables are properly set

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue with detailed error information
- Include your environment details (OS, Node.js version, browser)

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the API endpoint requirements
