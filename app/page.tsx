import Link from "next/link";

const Grid = (props: { title: string; description: string; href: string }) => {
  return (
    <Link
      href={props.href}
      className="flex flex-col items-start max-sm:text-left rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      rel="noopener noreferrer">
      <h2 className={`mb-3 text-2xl font-semibold`}>{props.title}</h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>{props.description}</p>
    </Link>
  );
};

export default function Home() {
  return (
    <div className="grid text-left sm:max-w-5xl sm:w-full sm:mb-0 sm:grid-cols-3">
      <Grid
        title="Address Book"
        description="Internal and external addresses published by other companies."
        href="/addresses"
      />
      <Grid
        title="Courier List"
        description="Internal and external courier name list published by other companies."
        href="/couriers"
      />
      <Grid title="Goods Library" description="All trade items definitions in the internal database." href="/goods" />
      <Grid title="Route List" description="All routes and route proposals in the network." href="/routes" />
      <Grid title="Create Route" description="Create a new route proposal." href="/routes/create" />
    </div>
  );
}
