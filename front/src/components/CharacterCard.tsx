import Card, { CardData } from "./Card";
import { Character } from "../lib/types";

const CharacterCard = ({ character }: { character: Character }) => {
  const data: CardData = {
    id: character.id,
    title: character.name,
    imageUrl: `/images/characters/${character.modelKV}.png`, // adjust if needed
    subtitle: character.team,
    details: [`Model: ${character.modelKV}`],
  };

  return <Card item={data} />;
};

export default CharacterCard;
