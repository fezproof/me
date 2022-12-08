import { createMemo, For } from "solid-js";
import Card from "./Card";
import CardWrapper from "./CardWrapper";
import { data } from "~/data/items.json";

type EquipmentData = typeof data.equipmentCategories[number]["equipment"];

interface CardDisplayProps {
  data: EquipmentData;
}

const CardDisplay = (props: CardDisplayProps) => {
  const fillerArray = createMemo(() => [
    ...Array(4 - (props.data.length % 4)).keys(),
  ]);

  return (
    <div class="text-center print:m-0 m-4">
      <For each={props.data}>
        {({ name, desc }) => (
          <CardWrapper>
            <Card name={name} description={desc} />
          </CardWrapper>
        )}
      </For>

      <For each={fillerArray()}>{() => <CardWrapper>&nbsp;</CardWrapper>}</For>
    </div>
  );
};

export default CardDisplay;
