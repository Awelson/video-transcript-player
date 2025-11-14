
import React from 'react';

interface ControlPanelProps {
  onVideoChange: (videoId: string) => void;
  onTranscriptChange: (file: File) => void;
  onLoad: () => void;
  onToggleEditMode: () => void;
  onSaveTranscript: () => void;
  isEditing: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onVideoChange,
  onTranscriptChange,
  onLoad,
  onToggleEditMode,
  onSaveTranscript,
  isEditing,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="video-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            YouTube Video ID
          </label>
          <input
            type="text"
            id="video-id"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter YouTube Video ID"
            onChange={(e) => onVideoChange(e.target.value)}
            disabled={isEditing}
          />
        </div>
        <div>
          <label htmlFor="transcript-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Transcript File (.json)
          </label>
          <input
            type="file"
            id="transcript-file"
            accept=".json"
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              dark:file:bg-indigo-900/50 dark:file:text-indigo-300
              hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900"
            onChange={(e) => e.target.files && onTranscriptChange(e.target.files[0])}
            disabled={isEditing}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={onLoad}
          className={`px-4 py-2 rounded-md ${
            isEditing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          disabled={isEditing}
        >
          Load Video & Transcript
        </button>
        <button
          onClick={onToggleEditMode}
          className={`px-4 py-2 rounded-md ${
            isEditing
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isEditing ? 'Back' : 'Edit Transcript'}
        </button>
        {isEditing && (
          <button
            onClick={onSaveTranscript}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Download New Transcript
          </button>
        )}
      </div>
    </div>
  );
};
