import { useState } from "react";

export function App(): React.ReactElement {
  const [count, setCount] = useState(0);

  const handleClick = (): void => {
    setCount((prev) => prev + 1);
  };

  return (
    <main>
      <h1>React + Vite + TypeScript</h1>
      <button type="button" onClick={handleClick}>
        Count: {count}
      </button>
    </main>
  );
}
