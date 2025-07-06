export default function PostFilters() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <div className="grid w-full grid-cols-12 gap-4 font-mono text-sm font-normal tracking-wide">
          <div className="col-span-2">/ DATE</div>
          <div className="col-span-2">/ THUMBNAIL</div>
          <div className="col-span-8">/ TITLE</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-foreground border-b"></div>
    </div>
  );
}
