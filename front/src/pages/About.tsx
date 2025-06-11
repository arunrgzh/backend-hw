import React, { FC, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Bg from "../assets/img/background_2.png";
import TextGenerateEffect from "../components/TextGenerate";
import FooterLogo from "../assets/img/logo.png";
import MapCard from "../components/MapCard";
import CharacterCard from "../components/CharacterCard";

import { rawMaps } from "../lib/data"; // ✅ import JSON data
import { Character, MapItem } from "../lib/types";

const tabs = ["Characters", "Maps"] as const;
type Tab = (typeof tabs)[number];

const About: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Characters");
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const HIGHLIGHTS = new Set(["CHARACTERS", "MAPS"]);

  // Fetch characters from backend
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/characters?search=${search}`
        );
        const data = await res.json();
        setCharacters(data);
      } catch (error) {
        console.error("Ошибка при загрузке персонажей:", error);
      }
    };

    fetchCharacters();
  }, [search]);

  // Handle adding a new character
  const addCharacter = async () => {
    if (!newName.trim() || !newDescription.trim()) {
      alert("Please provide both a name and description");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
        }),
      });

      const addedCharacter = await response.json();

      // Optimistically update the characters list
      setCharacters((prev) => [addedCharacter, ...prev]);

      // Reset form fields and hide the form
      setNewName("");
      setNewDescription("");
      setShowAdd(false);
    } catch (error) {
      console.error("Error adding character:", error);
      alert("Failed to add character.");
    }
  };

  // Handle toggling the Add Character form
  const toggleAddForm = () => {
    setShowAdd((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      <Navbar />

      {/* Hero / Banner */}
      <section
        className="min-h-screen relative h-64 md:h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Bg})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full text-center px-4 gap-6">
          <TextGenerateEffect
            wordClassName="text-white max-w-3xl font-jersey text-xl md:text-2xl lg:text-5xl font-bold mx-auto text-center"
            words="LEARN MORE ABOUT YOUR FAVOURITE CHARACTERS AND MAPS"
            wordsCallbackClass={({ word }) =>
              HIGHLIGHTS.has(word)
                ? "bg-gradient-to-r from-[#FF9B01] to-[#D36611] bg-clip-text text-transparent"
                : ""
            }
          />

          <div className="w-full max-w-md relative mt-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-poppins w-full pl-4 pr-12 py-3 rounded-lg bg-primary backdrop-blur text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-400">
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* Tabs and Add Character Button */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "border-b-2 border-primary-orange text-white"
                    : "text-gray-500 hover:text-gray-300"
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Only show "Add Character" button when the "Characters" tab is active */}
          {activeTab === "Characters" && (
            <button
              onClick={toggleAddForm}
              className="bg-primary-orange px-4 py-2 rounded-lg text-black font-bold"
            >
              + Add Character
            </button>
          )}
        </div>

        {/* Add Character Form */}
        {showAdd && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">New Character</h3>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-primary backdrop-blur"
            />
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-primary backdrop-blur"
            />
            <div className="flex space-x-2">
              <button
                onClick={addCharacter}
                className="bg-green-500 px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="bg-red-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Characters grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeTab === "Characters"
            ? characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))
            : rawMaps.map((map) => <MapCard key={map.id} map={map} />)}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
          <div className="flex  items-center gap-2">
            <img
              src={FooterLogo}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-lg"></span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Strike Mentor. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
