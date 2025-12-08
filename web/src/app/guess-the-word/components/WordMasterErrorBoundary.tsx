import React from 'react';
import { Button } from './ui/button'; // Anticipating UI components move to ./ui/
import { Card, CardContent } from './ui/card'; // Anticipating UI components move to ./ui/

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WordMasterErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('WordMaster Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-md p-8 shadow-2xl">
            <CardContent className="flex flex-col items-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-foreground/70 text-center">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button 
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="w-full"
              >
                Restart Session
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
} 