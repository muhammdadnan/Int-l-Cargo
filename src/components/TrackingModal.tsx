import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrackingModal = ({ open, onOpenChange }: TrackingModalProps) => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const { toast } = useToast();

  const handleTrackPackage = () => {
    if (invoiceNumber.trim()) {
      toast({
        title: "Tracking Package",
        description: `Searching for package with invoice: ${invoiceNumber}`,
      });
      setInvoiceNumber("");
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid invoice number",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Tracking
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="text"
            placeholder="Enter your invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full"
            onKeyPress={(e) => e.key === 'Enter' && handleTrackPackage()}
          />
          <Button 
            onClick={handleTrackPackage}
            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white"
          >
            Track Package
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingModal;