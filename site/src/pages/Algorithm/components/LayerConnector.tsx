export function LayerConnector({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex justify-center">
      <div className="h-6 w-px" style={{ background: `linear-gradient(${from}, ${to})` }} />
    </div>
  );
}
