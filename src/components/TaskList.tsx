import type { Task, Status } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TaskCard from '@/components/TaskCard';
import { v4 as uuid } from 'uuid';
import { useState } from 'react';

export default function TaskList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('cp-tasks', []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<number | ''>('');
  const [newTaskPlatform, setNewTaskPlatform] = useState<Task['platform']>('atcoder');
  const [newTaskDue, setNewTaskDue] = useState('');

  function addTask() {
    if (!newTaskTitle.trim()) return;
    
    setTasks([...tasks, { 
      id: uuid(),
      title: newTaskTitle,
      status: 'todo' as Status,
      platform: newTaskPlatform,
      ...(newTaskDifficulty !== '' && { difficulty: Number(newTaskDifficulty) }),
      ...(newTaskDue && { due: newTaskDue }),
    }]);
    
    // フォームをリセット
    setNewTaskTitle('');
    setNewTaskDifficulty('');
    setNewTaskPlatform('atcoder');
    setNewTaskDue('');
  }

  function toggleTask(id: string) {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTask();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-screen">
      {/* 左側: タスク追加画面 */}
      <div className="flex flex-col space-y-4 p-6">
        <h2 className="text-2xl font-bold text-center">新しいタスクを追加</h2>
        
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
              placeholder="問題名やタスクを入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="atcoder">AtCoder</option>
              <option value="codeforces">Codeforces</option>
              <option value="leetcode">LeetCode</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              難易度 (1-10)
            </label>
            <input
              id="difficulty"
              type="number"
              min="1"
              max="10"
              value={newTaskDifficulty}
              onChange={(e) => setNewTaskDifficulty(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="1-10の数値で入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="due" className="block text-sm font-medium text-gray-700 mb-1">
              期限
            </label>
            <input
              id="due"
              type="date"
              value={newTaskDue}
              onChange={(e) => setNewTaskDue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            タスクを追加
          </button>
        </form>
      </div>

      {/* 右側: タスクリスト */}
      <div className="flex flex-col space-y-4 p-6">
        <h2 className="text-2xl font-bold text-center">タスクリスト</h2>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              まだタスクがありません。左側からタスクを追加してください。
            </p>
          ) : (
            tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
