import { For, Show } from "solid-js";
import CardDescription from "./CardDescription";

interface CardProps {
  name: string;
  // price: string;
  // weight: string;
  // damage: string;
  // damageType: string;
  description: string[] | null;
}

const Card = ({
  name,
  // price,
  // weight,
  // damage,
  // damageType,
  description,
}: CardProps) => {
  return (
    <div class="h-full w-full p-1 text-left">
      <div class="h-full w-full border border-gray-900 flex flex-col flex-nowrap">
        <div class="p-1 grid grid-cols-2 text-xs">
          <p class="col-span-2 text-sm">{name}</p>
          <p>price</p>
          <p>weight</p>
          {/* <p>damage</p>
          <p>damageType</p> */}
        </div>
        <div class="flex-1 p-1 text-[6pt] overflow-hidden text-ellipsis">
          <CardDescription description={description} />
        </div>
      </div>
    </div>
  );
};

export default Card;
