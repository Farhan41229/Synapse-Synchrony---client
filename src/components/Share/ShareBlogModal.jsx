import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  Twitter, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Check 
} from 'lucide-react';
import toast from 'react-hot-toast';
import blogService from '@/services/blogService';

/**
 * ShareBlogModal Component
 * Modal for sharing blog posts via social media or copy link
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {string} blogId - Blog ID to share
 * @param {string} title - Blog title for sharing
 */
const ShareBlogModal = ({ isOpen, onClose, blogId, title }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Generate share URL
  const shareUrl = `${window.location.origin}/portal/blogs/${blogId}`;

  // Handle share tracking
  const trackShare = async () => {
    if (!isSharing) {
      setIsSharing(true);
      try {
        await blogService.incrementBlogShare(blogId);
      } catch (error) {
        console.error('Error tracking share:', error);
      }
      // Reset after a short delay to allow multiple shares
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      trackShare();
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  // Share to social media platforms
  const handleSocialShare = (platform) => {
    let socialUrl = '';
    
    switch (platform) {
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        socialUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + shareUrl)}`;
        break;
      default:
        return;
    }

    // Track share and open in new window
    trackShare();
    window.open(socialUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="sm:max-w-md sm:rounded-t-lg mx-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Share this blog</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Share this blog with your friends and community
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Copy Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-muted rounded-md text-sm truncate border">
                {shareUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Share on Social Media</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Twitter/X */}
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3"
              >
                <div className="p-2 bg-black dark:bg-white rounded-md">
                  <Twitter className="h-4 w-4 text-white dark:text-black" />
                </div>
                <span className="text-sm font-medium">Twitter</span>
              </Button>

              {/* Facebook */}
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3"
              >
                <div className="p-2 bg-[#1877F2] rounded-md">
                  <Facebook className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-sm font-medium">Facebook</span>
              </Button>

              {/* LinkedIn */}
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3"
              >
                <div className="p-2 bg-[#0A66C2] rounded-md">
                  <Linkedin className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
              </Button>

              {/* WhatsApp */}
              <Button
                onClick={() => handleSocialShare('whatsapp')}
                variant="outline"
                className="justify-start gap-3 h-auto py-3"
              >
                <div className="p-2 bg-[#25D366] rounded-md">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">WhatsApp</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShareBlogModal;
