export type AlgoInfoProps = {
  name: string;
  description: string;
  time?: { best: string; average: string; worst: string };
  space: string;
  pseudocode: string;
};

export function AlgoInfo({ name, description, time, space, pseudocode }: AlgoInfoProps) {
  return (
    <div className="av-edu">
      <h3>{name}</h3>
      <p>{description}</p>
      {time && (
        <div className="av-complexity">
          <div className="av-cx-item"><span>Best Case</span><code>{time.best}</code></div>
          <div className="av-cx-item"><span>Average Case</span><code>{time.average}</code></div>
          <div className="av-cx-item"><span>Worst Case</span><code>{time.worst}</code></div>
          <div className="av-cx-item"><span>Space</span><code>{space}</code></div>
        </div>
      )}
      {!time && (
        <div className="av-complexity">
          <div className="av-cx-item"><span>Space</span><code>{space}</code></div>
        </div>
      )}
      <pre className="av-pseudo">{pseudocode}</pre>
    </div>
  );
}
