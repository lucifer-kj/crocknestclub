// Environment Variables Configuration
// Copy these to your .env.local file

export const requiredEnvVars = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  
  // Payment Gateways

  INSTAMOJO_API_KEY: process.env.INSTAMOJO_API_KEY,
  INSTAMOJO_AUTH_TOKEN: process.env.INSTAMOJO_AUTH_TOKEN,
  INSTAMOJO_SALT: process.env.INSTAMOJO_SALT,
  INSTAMOJO_BASE_URL: process.env.INSTAMOJO_BASE_URL,
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// Validate environment variables at startup - Flexible for development
export const validateEnvironment = () => {
  const missingVars: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Check critical variables
  if (!process.env.DATABASE_URL) {
    missingVars.push('DATABASE_URL');
  }
  
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    missingVars.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  
  if (!process.env.CLERK_SECRET_KEY) {
    missingVars.push('CLERK_SECRET_KEY');
  }
  
  // In production, check all variables
  if (isProduction) {
    Object.entries(requiredEnvVars).forEach(([key, value]) => {
      if (!value && key !== 'NODE_ENV' && key !== 'NEXT_PUBLIC_APP_URL') {
        missingVars.push(key);
      }
    });
  }
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (isProduction) {
      throw new Error(errorMessage);
    } else {
      console.error('❌', errorMessage);
      console.log('💡 Create a .env.local file with the required variables');
      console.log('📖 Check the setup guide for configuration instructions');
    }
  }
  
  return true;
};

// Check if critical variables are present
export const hasCriticalEnvVars = () => {
  return !!(
    process.env.DATABASE_URL &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );
};
