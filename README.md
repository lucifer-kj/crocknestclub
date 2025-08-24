# Crocknest Club - E-Commerce Dashboard

A modern, full-stack e-commerce dashboard built with Next.js 13, TypeScript, Prisma, and Clerk authentication.

## 🚀 Features

- **Modern Tech Stack**: Next.js 13, TypeScript, Tailwind CSS
- **Authentication**: Clerk integration for user management
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Instamojo integration for checkout
- **File Storage**: Cloudinary for image uploads
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching support
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **Payments**: Instamojo (UPI, Net Banking, Wallets)
- **File Storage**: Cloudinary
- **State Management**: Zustand
- **UI Components**: Radix UI, Lucide Icons
- **Testing**: Jest, Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)
- Clerk account

- Instamojo account (optional)
- Cloudinary account (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crocknestclub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in your project root:

```env
# Database (Required) - PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database_name"

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your-clerk-key"
CLERK_SECRET_KEY="sk_test_your-clerk-secret"

# Clerk URLs (Optional but recommended)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"



# Instamojo (Optional for development)
INSTAMOJO_API_KEY="your-instamojo-api-key"
INSTAMOJO_AUTH_TOKEN="your-instamojo-auth-token"
INSTAMOJO_SALT="your-instamojo-salt"
INSTAMOJO_BASE_URL="https://test.instamojo.com/api/1.1"

# Cloudinary (Optional for development)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# App
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup

#### Generate Prisma Client
```bash
npm run db:generate
```

#### Push Database Schema
```bash
npm run db:push
```

#### Open Prisma Studio (Optional)
```bash
 npm run db:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`

## 🔧 Database Migration (MySQL → PostgreSQL)

This project has been migrated from MySQL to PostgreSQL. The migration includes:

- Updated Prisma schema to use `postgresql` provider
- Removed MySQL-specific `relationMode = "prisma"`
- Maintained all existing models and relationships
- Added database management scripts

### Migration Steps

1. **Update Environment Variables**: Ensure your `DATABASE_URL` uses PostgreSQL format
2. **Generate New Client**: Run `npm run db:generate` to create PostgreSQL client
3. **Push Schema**: Run `npm run db:push` to sync with PostgreSQL
4. **Verify Connection**: Check that your application connects successfully

## 💳 Payment Integration


- **UPI, Net Banking, Wallets**: Indian payment methods
- **Webhook Handling**: Order status updates
- **Payment Verification**: Automatic order confirmation

### Instamojo Integration
- **Digital Payments**: UPI, Net Banking, Wallets
- **Indian Market Focus**: Optimized for Indian customers
- **Webhook Support**: Real-time payment confirmations

### Hybrid Payment System
The application supports both payment gateways simultaneously:
- **Automatic Fallback**: If one gateway fails, falls back to the other
- **Payment Method Selection**: Users can choose their preferred payment method
- **Zero Downtime**: Seamless switching between payment providers

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run database migrations

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🗄️ Database Schema

The application includes the following models:

- **User**: Authentication and user management
- **Store**: Multi-store support
- **Billboard**: Store banners and promotions
- **Category**: Product categorization
- **Size**: Product size variants
- **Color**: Product color variants
- **Product**: Main product entity
- **Image**: Product images
- **Order**: Customer orders
- **OrderItem**: Order line items

## 🔐 Authentication

Authentication is handled by Clerk:

1. **Sign Up**: Users can create accounts
2. **Sign In**: Secure login with Clerk
3. **Multi-store**: Users can manage multiple stores
4. **Protected Routes**: Dashboard routes require authentication

## 🖼️ File Uploads

Cloudinary integration for image management:

1. **Product Images**: Multiple image support
2. **Billboard Images**: Store banner uploads
3. **Optimized Storage**: Automatic image optimization

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Jest configuration
- **Component Testing**: React Testing Library
- **API Testing**: Endpoint validation
- **Coverage Reports**: Test coverage tracking

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

- `DATABASE_URL`: PostgreSQL connection string
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key

- `INSTAMOJO_API_KEY`: Instamojo API key (if using Instamojo)
- `INSTAMOJO_AUTH_TOKEN`: Instamojo auth token
- `INSTAMOJO_SALT`: Instamojo webhook salt

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify `DATABASE_URL` format
   - Check database credentials
   - Ensure database is accessible

2. **Authentication Issues**
   - Verify Clerk keys are correct
   - Check Clerk dashboard configuration
   - Ensure environment variables are loaded

3. **Payment Gateway Issues**
   - Check API keys and tokens
   - Verify webhook configurations
   - Test with sandbox/test credentials first

4. **Prisma Errors**
   - Run `npm run db:generate` to regenerate client
   - Check database schema compatibility
   - Verify database provider in schema

### Development Mode

In development mode, the application is more flexible:
- Missing optional environment variables won't crash the app
- Helpful setup guide displays when critical variables are missing
- Console warnings for configuration issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review environment variable configuration
3. Verify database connection
4. Check console logs for error messages

## 🔄 Updates

Stay updated with the latest changes:

- Regular dependency updates
- Security patches
- Performance improvements
- New features and bug fixes
