
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadCompleteProps {
  projectId: string;
  onViewProject: () => void;
}

export function UploadComplete({ projectId, onViewProject }: UploadCompleteProps) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Upload Complete!</h2>
        <p className="text-muted-foreground">
          Your project has been successfully uploaded and is now being processed.
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm font-medium">Project ID</p>
        <p className="text-sm text-muted-foreground font-mono">{projectId}</p>
      </div>

      <div className="space-y-4 pt-4">
        <Button 
          onClick={onViewProject}
          className="w-full"
        >
          View Project
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard/upload'}
          className="w-full"
        >
          Upload Another Project
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        You can view and manage your project from your dashboard at any time.
      </p>
    </div>
  );
}