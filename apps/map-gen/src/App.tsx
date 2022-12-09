import type { Component } from "solid-js";
import Map from "./components/Map";

const App: Component = () => {
  return (
    <>
      <h1 class="m-2">Map Generator</h1>
      <main class="fixed inset-0 p-10 grid grid-cols-1 grid-rows-1">
        <Map />
      </main>
    </>
  );
};

export default App;
