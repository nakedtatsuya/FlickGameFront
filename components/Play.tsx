"use client";

import { useState, useEffect } from "react";
import NavigateButton from "@/components/NavigateButton";
import { WordList } from "@/models/word";

import FlickKeyboard from "@/components/flick/FlickKeyboard";
import GameUI from "@/components/ui/gameUI";

type PlayProps = {
  data: WordList;
};

const Play = ({ data }: PlayProps) => {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentWord = data.words[currentIndex];

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const handleNextWord = () => {
    const nextIndex = currentIndex + 1;
    setIsFinished(nextIndex >= data.words.length);

    if (!isCorrect) return;
    if (nextIndex < data.words.length) {
      setCurrentIndex(nextIndex);
    }

    setUserInput("");
    setIsCorrect(false);
  };

  const [userInput, setUserInput] = useState("");
  const handleSetUserInput = (input: string) => {
    setUserInput(input);
    setIsCorrect(input === currentWord.word.furigana);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Play画面</h1>
      <GameUI
        loading={loading}
        currentIndex={currentIndex}
        userInput={userInput}
        isCorrect={isCorrect}
        isFinished={isFinished}
      />
      <p>{currentWord.word.content}</p>
      <p className="h-8">{userInput}</p>
      {isFinished ? <NavigateButton to="result" label="結果画面へ" /> : <></>}
      <FlickKeyboard
        userInput={userInput}
        handleSetUserInput={handleSetUserInput}
        onClickEnter={handleNextWord}
      />
    </main>
  );
};

export default Play;
