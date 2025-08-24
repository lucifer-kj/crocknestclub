"use client"

import { AlertTriangle, CheckCircle, Database, Key, Settings } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface SetupGuideProps {
  missingVars: string[];
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ missingVars }) => {
  const getIcon = (varName: string) => {
    if (varName.includes('DATABASE')) return <Database className="h-5 w-5" />;
    if (varName.includes('CLERK')) return <Key className="h-5 w-5" />;

    return <Settings className="h-5 w-5" />;
  };

  const getCategory = (varName: string) => {
    if (varName.includes('DATABASE')) return 'Database';
    if (varName.includes('CLERK')) return 'Authentication';

    if (varName.includes('CLOUDINARY')) return 'File Storage';
    return 'Other';
  };

  const groupedVars = missingVars.reduce((acc, varName) => {
    const category = getCategory(varName);
    if (!acc[category]) acc[category] = [];
    acc[category].push(varName);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
        <h1 className="text-2xl font-bold">Setup Required</h1>
        <p className="text-muted-foreground">
          Your application needs some configuration before it can run properly.
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(groupedVars).map(([category, vars]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getIcon(vars[0])}
                {category} Configuration
              </CardTitle>
              <CardDescription>
                The following environment variables are required for {category.toLowerCase()}:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vars.map((varName) => (
                  <div key={varName} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-red-500" />
                    <code className="bg-muted px-2 py-1 rounded">{varName}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Follow these steps to get your application running:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Create Environment File</h4>
            <p className="text-sm text-muted-foreground">
              Create a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Add Required Variables</h4>
            <p className="text-sm text-muted-foreground">
              Copy the variables above and add your actual values. For PostgreSQL, use format:
            </p>
            <code className="block bg-muted px-2 py-1 rounded text-sm">
              DATABASE_URL=&quot;postgresql://&lt;username&gt;:&lt;password&gt;@&lt;host&gt;:&lt;port&gt;/&lt;database_name&gt;&quot;
            </code>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Generate Prisma Client</h4>
            <p className="text-sm text-muted-foreground">
              Run <code className="bg-muted px-1 rounded">npm run db:generate</code> to generate the PostgreSQL client
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">4. Push Database Schema</h4>
            <p className="text-sm text-muted-foreground">
              Run <code className="bg-muted px-1 rounded">npm run db:push</code> to sync your schema with PostgreSQL
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">5. Restart Development Server</h4>
            <p className="text-sm text-muted-foreground">
              Stop the current server (Ctrl+C) and run <code className="bg-muted px-1 rounded">npm run dev</code> again
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={() => window.location.reload()} 
          className="px-8"
        >
          Reload After Setup
        </Button>
      </div>
    </div>
  );
};
