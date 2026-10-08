import { useState } from 'react';
import { Search, Megaphone, Calendar, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/AppStore';
import type { Announcement } from '@/store/AppStore';

export function EmployeeAnnouncementsPage() {
  const { state } = useAppStore();
  const allAnnouncements = state.announcements || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = allAnnouncements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || ann.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return <Badge variant="danger">High Priority</Badge>;
      case 'Medium': return <Badge variant="warning">Medium Priority</Badge>;
      case 'Low': return <Badge variant="success">Normal</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto animate-slide-up space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Stay updated with the latest company news and broadcasts."
      />

      <Card padding="none" className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Input 
            placeholder="Search announcements..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <select 
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-700 w-full sm:w-[200px]"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </Card>

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="py-20 text-center">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No announcements found</h3>
            <p className="text-gray-500">Check back later for company updates.</p>
          </Card>
        ) : (
          filteredAnnouncements.map(ann => (
            <Card key={ann.id} className="hover:border-brand-300 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[16px] font-bold text-gray-900">{ann.title}</h3>
                    {getPriorityBadge(ann.priority)}
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    <span className="mx-1">•</span>
                    Posted by {ann.createdBy}
                  </div>
                  <p className="text-[14px] text-gray-600 line-clamp-2 mt-2">
                    {ann.description}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="shrink-0"
                  icon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => setSelectedAnnouncement(ann)}
                >
                  Read more
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade">
          <Card className="w-full max-w-[600px] mx-4 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                  <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900">Announcement</h3>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {getPriorityBadge(selectedAnnouncement.priority)}
                <span className="text-[13px] text-gray-500 font-medium">
                  {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedAnnouncement.title}</h2>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedAnnouncement.description}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedAnnouncement(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
