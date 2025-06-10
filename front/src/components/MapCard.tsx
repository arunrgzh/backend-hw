import React, { FC } from "react";
import Card, { CardData } from "./Card";
import type { MapItem } from "../lib/types";

interface Props {
  map: MapItem;
}

const MapCard: FC<Props> = ({ map }) => {
  const data: CardData = {
    id: map.id,
    title: map.name,
    imageUrl: `/images/maps/${map.fileName}.png`, // or your actual path
    subtitle: `Introduced: ${map.firstAppeared}`,
    details: [], // add anything else like region/difficulty if you extend the JSON
  };

  return <Card item={data} />;
};

export default MapCard;
