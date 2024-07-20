"use client";

import { useState, useEffect } from "react";
import NavigateButton from "@/components/NavigateButton";
import { WordListResponse } from "@/models/word";
import { useRouter } from "next/navigation";

import FlickKeyboard from "@/components/flick/FlickKeyboard";

type PlayProps = {
  response: WordListResponse;
};

const Play = ({ response }: PlayProps) => {
  const router = useRouter();
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [time, setTime] = useState(response.limit_time);

  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0 && !isFinished) {
        setTime(time - 1);
      } else if (time <= 0) {
        localStorage.setItem("score", currentScore.toString());
        router.push("/result");
        return;
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentScore, isFinished, loading, response.limit_time, router, time]);

  const currentWord = response.words[currentIndex];

  useEffect(() => {
    if (response) {
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    const nextIndex = currentIndex + 1;
    const newScore = currentScore + currentWord.point_allocation;

    if (!isCorrect) return;
    if (nextIndex < response.words.length) {
      setCurrentIndex(nextIndex);
      setCurrentScore(newScore);
    } else {
      setIsFinished(true);
      localStorage.setItem("score", newScore.toString());
    }

    setUserInput("");
    setIsCorrect(false);
  }, [
    currentIndex,
    currentScore,
    currentWord.point_allocation,
    isCorrect,
    response.words.length,
  ]);

  const handleSetUserInput = (input: string) => {
    setUserInput(input);
    setIsCorrect(input === currentWord.word_furigana);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Play画面</h1>
      <p>残り時間：{time}</p>
      <p>{currentWord.word_text}</p>
      <p className="h-8">{userInput}</p>
      {isFinished ? <NavigateButton to="result" label="結果画面へ" /> : <></>}
      <FlickKeyboard
        userInput={userInput}
        handleSetUserInput={handleSetUserInput}
      />
    </main>
  );
};

export default Play;
