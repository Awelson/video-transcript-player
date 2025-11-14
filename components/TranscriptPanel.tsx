
import React, { useEffect, useRef, useState } from 'react';
import { TranscriptLine } from '../types';
import { PlayCircleIcon } from './Icons';

interface TranscriptPanelProps {
  transcript: TranscriptLine[];
  currentTime: number;
  onLineClick: (time: number) => void;
  isEditing: boolean;
  onTranscriptChange: (newTranscript: TranscriptLine[]) => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
  currentTime,
  onLineClick,
  isEditing,
  onTranscriptChange,
}) => {
  const activeLineRef = useRef<HTMLLIElement>(null);
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [jsonString, setJsonString] = useState(JSON.stringify(transcript, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  const activeLineId = transcript.find(
    line => currentTime >= line.startTime && currentTime < line.endTime
  )?.id;

  useEffect(() => {
    setJsonString(JSON.stringify(transcript, null, 2));
  }, [transcript]);

  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current && !isEditing) {
      const lineElement = activeLineRef.current;
      const containerElement = scrollContainerRef.current;

      const lineTop = lineElement.offsetTop;
      const lineHeight = lineElement.offsetHeight;
      const containerHeight = containerElement.clientHeight;

      const scrollPosition = lineTop - (containerHeight / 2) + (lineHeight / 2) - 30;

      containerElement.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [activeLineId, isEditing]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      onTranscriptChange(parsed);
      setParseError(null);
    } catch (error) {
      setParseError("Invalid JSON format");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-[70vh] flex flex-col">
      {isEditing ? (
        <div className="flex-grow flex flex-col p-4">
          <textarea
            value={jsonString}
            onChange={handleJsonChange}
            className="flex-grow w-full p-2 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"
          />
          {parseError && <p className="text-red-500 text-sm mt-2">{parseError}</p>}
        </div>
      ) : (
        <ul ref={scrollContainerRef} className="p-4 space-y-2 h-full overflow-y-auto">
          {transcript.map(line => {
            const isActive = activeLineId === line.id;
            return (
              <li
                key={line.id}
                ref={isActive ? activeLineRef : null}
                className={`p-4 rounded-lg transition-all duration-300 ease-in-out transform ${
                  isActive
                    ? 'bg-indigo-700 text-white shadow-lg scale-100'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() => onLineClick(line.startTime)}
                    className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors mt-1"
                  >
                    <PlayCircleIcon className="w-6 h-6" />
                  </button>
                  <div className="flex-grow">
                    <p
                      className={`font-semibold text-lg whitespace-pre-line ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {line.text}
                    </p>
                    <p
                      className={`text-sm mt-1 whitespace-pre-line ${
                        isActive
                          ? 'text-indigo-200'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {line.subtext}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};