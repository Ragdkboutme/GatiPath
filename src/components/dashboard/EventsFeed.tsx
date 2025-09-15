import { useState } from "react";
import { AlertTriangle, ArrowRight, Clock, CheckCircle, X, Eye, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

type Event = {
  id: number;
  type: 'alert' | 'warning' | 'info';
  location: string;
  locationOdia?: string;
  message: string;
  messageOdia?: string;
  time: string;
  resolved?: boolean;
  coordinates?: [number, number];
};

const initialEvents: Event[] = [
  {
    id: 1,
    type: 'alert',
    location: 'Patia Square',
    locationOdia: 'ପାଟିଆ ସ୍କୱାର',
    message: 'Accident detected',
    messageOdia: 'ଦୁର୍ଘଟଣା ଚିହ୍ନଟ ହୋଇଛି',
    time: '2 min ago',
    resolved: false,
    coordinates: [20.288059, 85.844539],
  },
  {
    id: 2,
    type: 'warning',
    location: 'Nandankanan Road',
    locationOdia: 'ନନ୍ଦନକାନନ ରୋଡ',
    message: 'Traffic signal malfunction',
    messageOdia: 'ଟ୍ରାଫିକ ସିଗନାଲ ଖରାପ',
    time: '15 min ago',
    resolved: false,
    coordinates: [20.305659, 85.833339],
  },
  {
    id: 3,
    type: 'info',
    location: 'Jaydev Vihar',
    locationOdia: 'ଜୟଦେବ ବିହାର',
    message: 'Road work in progress',
    messageOdia: 'ରାସ୍ତା କାମ ଚାଲିଛି',
    time: '1 hour ago',
    resolved: false,
    coordinates: [20.296059, 85.824539],
  },
];

export const EventsFeed = ({ isOdia = false }: { isOdia?: boolean }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  // Function to mark an event as resolved
  const resolveEvent = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, resolved: true } : event
    ));
    
    toast({
      title: "Event resolved",
      description: "The event has been marked as resolved.",
      variant: "default",
    });
  };

  // Function to dismiss an event
  const dismissEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    
    toast({
      title: "Event dismissed",
      description: "The event has been removed from the feed.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">{isOdia ? "କୌଣସି ଘଟଣା ନାହିଁ" : "No events to display"}</p>
        </div>
      ) : (
        events.map((event) => (
          <div 
            key={event.id} 
            className={`flex items-start gap-2 pb-3 border-b border-border last:border-0 last:pb-0 ${event.resolved ? 'opacity-60' : ''}`}
          >
            <div className={
              `p-1 rounded-full ${
                event.type === 'alert' ? 'bg-destructive/10 text-destructive' :
                event.type === 'warning' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              }`
            }>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{isOdia ? event.locationOdia : event.location}</p>
                <Badge variant="outline" className={
                  `text-xs font-normal ${
                    event.resolved ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''
                  }`
                }>
                  {event.resolved ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {isOdia ? "ସମାଧାନ ହୋଇଛି" : "Resolved"}
                    </>
                  ) : (
                    event.type
                  )}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{isOdia ? event.messageOdia : event.message}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{event.time}</span>
                </div>
                
                {!event.resolved && (
                  <div className="flex items-center gap-1">
                    {event.coordinates && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        title={isOdia ? "ମାନଚିତ୍ରରେ ଦେଖନ୍ତୁ" : "View on map"}
                        asChild
                      >
                        <Link to={`/?lat=${event.coordinates[0]}&lng=${event.coordinates[1]}`}>
                          <MapPin className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      title={isOdia ? "ସମାଧାନ କରନ୍ତୁ" : "Mark as resolved"}
                      onClick={() => resolveEvent(event.id)}
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      title={isOdia ? "ଖାରଜ କରନ୍ତୁ" : "Dismiss"}
                      onClick={() => dismissEvent(event.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};