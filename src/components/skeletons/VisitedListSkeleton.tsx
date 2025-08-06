import VisitedAirportSkeleton from "./VisitedAirportSkeleton";

export default function VisitedListSkeleton() {
  return (
    <ul className="w-full space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <VisitedAirportSkeleton key={i} />
      ))}
    </ul>
  );
}
