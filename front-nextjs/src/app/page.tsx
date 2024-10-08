import { EventCard } from "@/components/event-card";
import { Title } from "@/components/title";
import { EventModel } from "@/models/event.model";
import { listEvents } from "@/models/mocks/list-events";


export default function Home() {
  const events: EventModel[] = listEvents();

  return (
    <main className="mt-10 flex flex-col">
      <Title>Eventos disponíveis</Title>
      <div className="mt-8 sm:grid sm:grid-cols-auto-fit-cards flex flex-wrap justify-center gap-x-2 gap-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}