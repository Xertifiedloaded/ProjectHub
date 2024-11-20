
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectMetadataProps } from '@/type/card';

export function FileUpload({ data, onUpdate }: ProjectMetadataProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpdate({ files: [...data.files, ...acceptedFiles] });
  }, [data.files, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...data.files];
    newFiles.splice(index, 1);
    onUpdate({ files: newFiles });
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Drag and drop your files here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      </div>

      {data.files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Files</h3>
          <div className="space-y-2">
            {data.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}