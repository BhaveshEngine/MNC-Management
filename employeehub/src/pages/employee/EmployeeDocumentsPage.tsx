import { useState } from 'react';
import { UploadCloud, FileText, Download, Eye, X, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';
import { cn } from '@/lib/utils';
import type { EmployeeDocument } from '@/store/AppStore';

export function EmployeeDocumentsPage() {
  const { getDocumentsByEmployee, uploadDocument } = useAppStore();
  const allDocuments = getDocumentsByEmployee(currentEmployee.id);
  
  const [activeTab, setActiveTab] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<EmployeeDocument | null>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Personal' as EmployeeDocument['category']
  });

  const categories = ['All', 'Employment', 'Payroll', 'Tax', 'Company', 'Personal'];

  const filteredDocs = activeTab === 'All' 
    ? allDocuments 
    : allDocuments.filter(d => d.category === activeTab);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;
    
    uploadDocument({
      employeeId: currentEmployee.id,
      name: uploadForm.name,
      category: uploadForm.category,
      size: `${Math.floor(Math.random() * 900) + 100} KB`,
    });
    
    setShowUploadModal(false);
    setShowSuccess(true);
    setUploadForm({ name: '', category: 'Personal' });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="My Documents"
        subtitle="View and manage your official and personal documents"
        actions={
          <Button icon={<UploadCloud className="w-4 h-4" />} onClick={() => setShowUploadModal(true)}>
            Upload Document
          </Button>
        }
      />

      {showSuccess && (
        <div className="bg-success-50 text-success-700 p-4 rounded-lg flex items-center gap-2 border border-success-100 animate-fade">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium text-[14px]">Document uploaded successfully and is pending verification.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6 overflow-x-auto scrollbar-hide">
          {categories.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'py-3 text-[14px] font-medium whitespace-nowrap transition-colors border-b-2',
                activeTab === tab 
                  ? 'border-brand-600 text-brand-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Documents Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Uploaded On</th>
                <th>Size</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-[13px] text-gray-400 py-12">
                    No documents found in this category.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td><span className="text-gray-600 text-[13px]">{doc.category}</span></td>
                    <td><span className="text-gray-600 text-[13px]">{new Date(doc.uploadedOn).toLocaleDateString()}</span></td>
                    <td><span className="text-gray-600 font-mono text-[13px]">{doc.size}</span></td>
                    <td>
                      <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>{doc.status}</Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => setPreviewDoc(doc)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[18px] font-bold text-gray-900">Upload Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Document Name</label>
                <input 
                  type="text"
                  required
                  value={uploadForm.name}
                  onChange={e => setUploadForm(s => ({ ...s, name: e.target.value }))}
                  placeholder="e.g. Passport Copy"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Category</label>
                <select 
                  required
                  value={uploadForm.category}
                  onChange={e => setUploadForm(s => ({ ...s, category: e.target.value as EmployeeDocument['category'] }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-white"
                >
                  <option>Personal</option>
                  <option>Tax</option>
                  <option>Payroll</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Official Employment and Company documents are managed by Admin.</p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">File</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-[13px] font-medium text-brand-600">Click to browse or drag and drop</p>
                  <p className="text-[11px] text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                <Button type="submit">Upload</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[800px] mx-4 h-[80vh] p-0 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">{previewDoc.name}</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">{previewDoc.category} Document • {previewDoc.size}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Download</Button>
                <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-medium text-gray-600">Document Preview Not Available</p>
                <p className="text-sm mt-1">This is a mock representation of the document.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
