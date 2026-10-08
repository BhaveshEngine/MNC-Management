import { useState } from 'react';
import { Laptop, Monitor, Smartphone, Keyboard, Mouse, CreditCard, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import { currentEmployee } from '@/data/employee-mock-data';

export function EmployeeAssetsPage() {
  const { getAssetsByEmployee, reportAssetIssue } = useAppStore();
  const assets = getAssetsByEmployee(currentEmployee.id);
  
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [issueForm, setIssueForm] = useState({
    assetId: '',
    issueType: 'Hardware Malfunction',
    description: ''
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Laptop': return <Laptop className="w-8 h-8 text-blue-500" />;
      case 'Monitor': return <Monitor className="w-8 h-8 text-indigo-500" />;
      case 'Mobile': return <Smartphone className="w-8 h-8 text-purple-500" />;
      case 'Accessory': return type.includes('Keyboard') ? <Keyboard className="w-8 h-8 text-emerald-500" /> : <Mouse className="w-8 h-8 text-emerald-500" />;
      case 'Identification': return <CreditCard className="w-8 h-8 text-amber-500" />;
      default: return <Laptop className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.assetId || !issueForm.description) return;
    
    reportAssetIssue({
      employeeId: currentEmployee.id,
      assetId: issueForm.assetId,
      issueType: issueForm.issueType,
      description: issueForm.description,
    });
    
    setShowIssueModal(false);
    setShowSuccess(true);
    setIssueForm({ assetId: '', issueType: 'Hardware Malfunction', description: '' });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="My Assets"
        subtitle="Manage and track company assets assigned to you"
        actions={
          <Button icon={<AlertCircle className="w-4 h-4" />} onClick={() => setShowIssueModal(true)}>
            Report an Issue
          </Button>
        }
      />

      {showSuccess && (
        <div className="bg-success-50 text-success-700 p-4 rounded-lg flex items-center gap-2 border border-success-100 animate-fade">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-medium text-[14px]">Your issue has been successfully reported to the IT admin team.</p>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No assets assigned.
          </div>
        ) : (
          assets.map(asset => (
            <Card key={asset.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {getAssetIcon(asset.type)}
                </div>
                <Badge variant="success">{asset.status}</Badge>
              </div>
              
              <h3 className="font-bold text-gray-900 text-[16px] mb-1">{asset.name}</h3>
              <p className="text-[13px] text-gray-500 mb-4">{asset.type}</p>
              
              <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-[13px]">
                <div>
                  <p className="text-gray-400 font-medium uppercase tracking-wider text-[11px] mb-1">Asset ID</p>
                  <p className="font-medium text-gray-900 font-mono">{asset.assetId}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium uppercase tracking-wider text-[11px] mb-1">Condition</p>
                  <p className="font-medium text-gray-900">{asset.condition}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Report Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[500px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-[18px] font-bold text-gray-900">Report Asset Issue</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleReportIssue} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Select Asset</label>
                <select 
                  required
                  value={issueForm.assetId}
                  onChange={e => setIssueForm(s => ({ ...s, assetId: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-white"
                >
                  <option value="" disabled>Select an asset...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.assetId}>{a.name} ({a.assetId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Issue Type</label>
                <select 
                  required
                  value={issueForm.issueType}
                  onChange={e => setIssueForm(s => ({ ...s, issueType: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] text-gray-700 bg-white"
                >
                  <option>Hardware Malfunction</option>
                  <option>Software Issue</option>
                  <option>Damage</option>
                  <option>Loss/Theft</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={issueForm.description}
                  onChange={e => setIssueForm(s => ({ ...s, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-3 rounded-lg border border-gray-200 text-[14px] text-gray-700"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowIssueModal(false)}>Cancel</Button>
                <Button type="submit">Submit Report</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
