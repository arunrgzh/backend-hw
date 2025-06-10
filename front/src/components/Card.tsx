import React, { FC } from "react";

export interface CardData {
  id: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
  details?: string[];
}

const Card: FC<{ item: CardData }> = ({ item }) => (
  <div className="bg-[#1F2633] rounded-2xl overflow-hidden shadow-lg">
    <img
      src={item.imageUrl}
      alt={item.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4 space-y-2">
      <h3 className="font-bold text-lg">{item.title}</h3>
      {item.subtitle && (
        <p className="text-sm text-gray-400">{item.subtitle}</p>
      )}
      {item.details && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {item.details.map((d) => (
            <span key={d} className="px-2 py-1 bg-[#2A313E] rounded">
              {d}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default Card;
