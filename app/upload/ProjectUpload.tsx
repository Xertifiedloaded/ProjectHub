'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Tags, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

import { useToast } from '@/hooks/use-toast';
import { ProjectDetails } from './ProjectDetails';
import { FileUpload } from './FileUpload';
import { ProjectMetadata } from './ProjectMetaData';
import { UploadComplete } from './UploadComplete';

interface FormData {
  title: string;
  description: string;
  year: number;
  category: string;
  tags: string[];
  files: File[];
  thumbnail?: File;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  year: new Date().getFullYear(),
  category: '',
  tags: [],
  files: [],
};

export function ProjectUploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const steps = [
    { id: 'details', label: 'Project Details', icon: FileText },
    { id: 'files', label: 'Upload Files', icon: Upload },
    { id: 'metadata', label: 'Add Metadata', icon: Tags },
    { id: 'complete', label: 'Complete', icon: Check },
  ];

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const uploadedFiles = await Promise.all(
        formData.files.map(async (file) => {
          const fileData = new FormData();
          fileData.append('file', file);
          const res = await fetch('/upload/file', {
            method: 'POST',
            body: fileData,
          });
          return res.json();
        })
      );

      let thumbnailUrl;
      if (formData.thumbnail) {
        const thumbnailData = new FormData();
        thumbnailData.append('file', formData.thumbnail);
        const res = await fetch('/upload/thumbnail', {
          method: 'POST',
          body: thumbnailData,
        });
        thumbnailUrl = (await res.json()).url;
      }

      // Create project
      const projectData = {
        title: formData.title,
        description: formData.description,
        year: formData.year,
        category: formData.category,
        tags: formData.tags,
        files: uploadedFiles,
        thumbnail: thumbnailUrl,
        status: 'draft',
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) throw new Error('Failed to create project');

      setCurrentStep('complete');
      toast({
        title: 'Success',
        description: 'Project uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload project',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Upload Project</h1>
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
        >
          Cancel
        </Button>
      </div>

      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index < steps.length - 1
                ? 'flex-1'
                : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === step.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border mx-4" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'details' && (
                <ProjectDetails
                  data={formData}
                  onUpdate={updateFormData}
                />
              )}
              {currentStep === 'files' && (
                <FileUpload
                  data={formData}
                  onUpdate={updateFormData}
                />
              )}
              {currentStep === 'metadata' && (
                <ProjectMetadata
                  data={formData}
                  onUpdate={updateFormData}
                />
              )}
              {currentStep === 'complete' && (
                <UploadComplete
                  projectId={formData.title}
                  onViewProject={() => router.push('/dashboard')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {currentStep !== 'complete' && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'details'}
          >
            Previous
          </Button>
          {currentStep === 'metadata' ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Uploading...' : 'Submit Project'}
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      )}
    </div>
  );
}