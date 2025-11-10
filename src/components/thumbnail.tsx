import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { XIcon } from "lucide-react";

interface ThumbnailProps{
    url: string|null|undefined;
};

export const Thumbnail =( {url}: ThumbnailProps)=>{
    if(!url) return null;


    return (
       <Dialog>
         <DialogTrigger>
            <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-cursor-zoom-in">
          <img 
          src={url}
          alt="Message image"
          className="rounded-mg object-cover size-full"/>
        </div>
         </DialogTrigger>
         <DialogContent className="max-w-[880] border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="text-lg font-bold text-center mb-2">
                Message Image
                </DialogTitle>

        <img 
          src={url}
          alt="Message image"
          className="rounded-mg object-cover size-full"/>
         </DialogContent>
       </Dialog>
    );
};