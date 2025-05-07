import { useMap } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

const ZoomControls = () => {
  const map = useMap();
  
  const zoomIn = () => {
    map.zoomIn();
  };
  
  const zoomOut = () => {
    map.zoomOut();
  };
  
  return (
    <div className="absolute right-4 bottom-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={zoomIn}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
        onClick={zoomOut}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default ZoomControls; 