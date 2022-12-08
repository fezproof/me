import { createEffect, createMemo, createSignal, For } from "solid-js";
import CardDisplay from "~/components/CardDisplay";
import { data } from "~/data/items.json";

export default function Home() {
  const [category, setCategory] = createSignal(
    data.equipmentCategories[0].index
  );

  const cardData = createMemo(() => {
    return (
      data.equipmentCategories.find((c) => c.index === category())?.equipment ??
      []
    );
  });

  return (
    <main>
      <div class="print:hidden p-4">
        <select
          class="border border-gray-200"
          name="type"
          value={category()}
          onChange={(e) => {
            setCategory(e.currentTarget.value);
          }}
        >
          <For each={data.equipmentCategories}>
            {({ index, name }) => <option value={index}>{name}</option>}
          </For>
        </select>
      </div>
      <CardDisplay data={cardData()} />
    </main>
  );
}
