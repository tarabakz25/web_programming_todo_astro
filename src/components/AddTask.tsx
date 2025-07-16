import type { Task, Status } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TaskCard from '@/components/TaskCard';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';

export default function AddTask() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('cp-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<number | ''>('');
  const [newTaskPlatform, setNewTaskPlatform] = useState<Task['platform']>('atcoder');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskUrl, setNewTaskUrl] = useState('');
  const [newTaskTags, setNewTaskTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  function addTask() {
    if (!newTaskTitle.trim()) return;

    // プラットフォームごとの固定URLを定義
    const platformUrls = {
      atcoder: 'https://atcoder.jp/contests/',
      codeforces: 'https://codeforces.com/problem/',
      leetcode: 'https://leetcode.com/problems/',
      other: ''
    };

    // URLを生成（プラットフォームがotherでない場合のみ）
    const generatedUrl = newTaskPlatform !== 'other' && newTaskTitle.trim() 
      ? `${platformUrls[newTaskPlatform]}${newTaskTitle.trim()}`
      : newTaskUrl;

    setTasks([...tasks, {
      id: uuid(),
      title: newTaskTitle,
      status: 'todo' as Status,
      platform: newTaskPlatform,
      ...(newTaskDifficulty !== '' && { difficulty: Number(newTaskDifficulty) }),
      ...(newTaskDue && { due: newTaskDue }),
      ...(generatedUrl && { url: generatedUrl }),
      ...(newTaskTags.length > 0 && { tags: newTaskTags }),
    }]);

    setNewTaskTitle('');
    setNewTaskDifficulty('');
    setNewTaskPlatform('atcoder');
    setNewTaskDue('');
    setNewTaskUrl('');
    setNewTaskTags([]);
    setTagInput('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTask();
  }

  function addTag() {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !newTaskTags.includes(trimmedTag)) {
      setNewTaskTags([...newTaskTags, trimmedTag]);
      setTagInput('');
    }
  }

  function removeTag(tagToRemove: string) {
    setNewTaskTags(newTaskTags.filter(tag => tag !== tagToRemove));
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="flex flex-col justify-center space-y-4 p-6">
      <div className="text-2xl font-bold text-center">新しいタスクを追加</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タスク名 *
          </label>
          <input
            id="title"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="問題タイトルを入力..."
            className="w-full px-3 py-2 border border-teal-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            プラットフォーム *
          </label>
          <select
            id="platform"
            value={newTaskPlatform}
            onChange={(e) => setNewTaskPlatform(e.target.value as Task['platform'])}
            className="w-full px-3 py-2 border border-teal-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="atcoder">AtCoder</option>
            <option value="codeforces">Codeforces</option>
            <option value="leetcode">LeetCode</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            難易度 *
          </label>
          <input
            id="difficulty"
            type="number"
            value={newTaskDifficulty}
            onChange={(e) => setNewTaskDifficulty(Number(e.target.value))}
            placeholder="難易度を入力..."
            className="w-full px-3 py-2 border border-teal-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>
        <div>
          <label htmlFor="due" className="block text-sm font-medium text-gray-700 mb-1">
            日程 *
          </label>
          <input
            id="due"
            type="date"
            value={newTaskDue}
            onChange={(e) => setNewTaskDue(e.target.value)}
            className="w-full px-3 py-2 border border-teal-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            タグ
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="タグを入力してEnterで追加..."
              className="flex-1 px-3 py-2 border border-teal-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-teal-500 text-white rounded-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              追加
            </button>
          </div>
          {newTaskTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newTaskTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-teal-100 text-teal-800 text-sm rounded-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-teal-600 hover:text-teal-800 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}