export function PoliticianGridImage({ url }: { url: string }) {
  return (
    <div
      className="flex relative size-14 mx-auto border bg-white rounded-xl overflow-hidden"
      style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `url(${url})`,
      }}
    ></div>
  );
}
