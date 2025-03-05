import React from 'react';
import { Button } from "@/components/ui/button"
import { FileIcon, FileSpreadsheetIcon, FileTextIcon, FileTypeIcon } from 'lucide-react';

const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || 'unknown';
};

const getFileInfoFromUrl = (url: string) => {
  const fileName = url.split('/').pop() || '';
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  return { fileName, fileExtension };
};


const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileIcon className="h-6 w-6 text-red-500" />
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileTextIcon className="h-6 w-6 text-blue-500" />
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheetIcon className="h-6 w-6 text-green-500" />
    case 'ppt':
    case 'pptx':
      return <FileTypeIcon className="h-6 w-6 text-orange-500" />
    default:
      return <FileIcon className="h-6 w-6 text-gray-500" />
  }
}

interface FileAttachment {
  type: string
  url: string
  caption: string
  name?: string
}

interface FileListProps {
  files: FileAttachment[]
}

export function FileList({ files }: FileListProps) {
  
  return (
    <div>
      {files.map((file, index) => {
        const { fileName, fileExtension } = file.type === 'document'
          ? getFileInfoFromUrl(file.url)
          : { fileName: file.name || file.caption, fileExtension: getFileExtension(file.name || file.caption) };

        return (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-100 rounded-lg mb-1">
            {getFileIcon(fileExtension)}
            <div className="flex-grow">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-gray-500 uppercase">{fileExtension}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
            >
              View
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;

