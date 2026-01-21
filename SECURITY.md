# Security Implementation Documentation

This document outlines the security features implemented in the URL Shortener frontend application.

## 🛡️ Security Features Implemented

### 1. CSRF Protection
- **Token Generation**: CSRF tokens are generated using cryptographically secure random values
- **Session Storage**: Tokens are stored in sessionStorage for the session duration
- **Request Headers**: All API requests include the CSRF token in the `X-CSRF-Token` header
- **Automatic Management**: Tokens are automatically generated and attached to requests

### 2. Input Sanitization
- **XSS Prevention**: All user inputs are sanitized to remove potentially dangerous characters
- **URL Sanitization**: Specialized URL sanitization that preserves valid URL structure while removing threats
- **Protocol Filtering**: Only allows safe protocols (HTTP, HTTPS, FTP)
- **Character Filtering**: Removes HTML tags, JavaScript protocols, and event handlers

### 3. Rate Limiting Indication
- **Visual Alerts**: Users see clear notifications when rate-limited
- **Time Display**: Shows remaining time until next request is allowed
- **Auto-retry**: Provides retry functionality when rate limit expires
- **API Integration**: Parses rate limit headers from API responses

### 4. HTTPS Enforcement
- **Protocol Upgrading**: Automatically converts HTTP URLs to HTTPS
- **Base URL Security**: Enforces HTTPS for all API base URLs
- **Request Validation**: Ensures all outgoing requests use secure protocols
- **URL Validation**: Validates that URLs use HTTPS before processing

## 🔧 Implementation Details

### Security Utilities (`src/utils/security.ts`)
- `generateCSRFToken()`: Creates cryptographically secure CSRF tokens
- `sanitizeInput()`: Removes dangerous characters from user input
- `sanitizeURL()`: Specialized URL sanitization for security
- `enforceHTTPS()`: Converts HTTP URLs to HTTPS
- `parseRateLimitHeaders()`: Extracts rate limit information from API responses

### API Security (`src/api.ts`)
- CSRF tokens automatically added to all requests
- Security headers included in API calls
- HTTPS enforcement for all API endpoints
- Rate limiting error handling

### Input Validation Enhancement
- **URL Validator**: Enhanced with sanitization and HTTPS preference
- **Alias Validator**: Includes input sanitization for custom aliases
- **Form Components**: Updated to use sanitized inputs

### User Interface Components
- **RateLimitAlert**: Displays rate limiting information to users
- **Enhanced Forms**: Include rate limiting checks and sanitized inputs
- **Security Headers**: CSP and other security headers in HTML

## 📋 Security Headers

### Content Security Policy (CSP)
```
default-src 'self'; 
script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: https:; 
connect-src 'self' https:; 
font-src 'self';
```

### Additional Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🔄 Rate Limiting Flow

1. **Request Check**: Before API calls, check if user is rate-limited
2. **API Response**: Parse rate limit headers from server responses
3. **User Notification**: Display alerts when rate-limited
4. **Auto-Recovery**: Clear rate limit status when time expires
5. **Manual Retry**: Allow users to retry when appropriate

## 🛠️ Usage Examples

### Using Sanitized Inputs
```typescript
import { getSecureUrl, getSanitizedAlias } from '../utils/validators';

const secureUrl = getSecureUrl(userInput);
const sanitizedAlias = getSanitizedAlias(aliasInput);
```

### Rate Limiting Hook
```typescript
import { useRateLimit } from '../hooks/useRateLimit';

const { isRateLimited, timeRemaining, updateRateLimit } = useRateLimit();
```

### CSRF Protection
CSRF protection is automatically handled by the API client - no manual implementation needed.

## 🔍 Security Best Practices

1. **Always Sanitize Inputs**: Never trust user input directly
2. **Use HTTPS**: Ensure all communications are encrypted
3. **Implement Rate Limiting**: Prevent abuse and DoS attacks
4. **Use Security Headers**: Add layers of protection against common attacks
5. **Validate Server-Side**: Client-side security is helpful but not sufficient

## 🚀 Deployment Considerations

- Ensure HTTPS is properly configured on the server
- Configure rate limiting headers on the backend API
- Implement CSRF validation on the server
- Monitor security headers and CSP violations
- Regular security audits and updates

## 📞 Security Issues

If you discover any security vulnerabilities, please report them responsibly through the appropriate channels.

---

*This security implementation provides multiple layers of protection while maintaining a smooth user experience.*
