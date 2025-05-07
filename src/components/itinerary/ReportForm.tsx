'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createReport } from '@/services/reportService';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import useAuthToken from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const reportReason = [
  { value: 'location_closed', label: 'One of the locations has been closed' },
  { value: 'not_displaying', label: 'Itinerary not displaying spots' },
  { value: 'other', label: 'Other' },
];

export function ReportForm({ itineraryId, onReportSubmitted }: {
  itineraryId: number;
  onReportSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const { authToken } = useAuthToken();

  const handleSubmit = async () => {
    if (!userId) {
      toast.error('Authentication required', {
        description: 'Please sign in to report an itinerary'
      });
      return;
    }

    if (!reason) {
      toast.error('Reason required', {
        description: 'Please select a reason for reporting'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        userId: userId,
        itineraryId,
        details,
        reason,
      }, authToken);
      
      toast.success('Report submitted', {
        description: 'Thank you for reporting'
      });
      setOpen(false);
      setDetails('');
      setReason('');
      
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (error) {
      console.error('Error reporting itinerary:', error);
      toast.error('Failed to report itinerary');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <span 
          className="text-xs text-destructive cursor-pointer" 
          onClick={(e) => e.stopPropagation()}
        >
          Report an issue
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Itinerary</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select
            value={reason}
            onValueChange={setReason}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {reportReason.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 py-4">
          <Label>Additional information</Label>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide details?"
          />
          <div className="flex justify-end">
            <span className="text-sm text-gray-500">
              {details.length} / 200
            </span>
          </div>    
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}