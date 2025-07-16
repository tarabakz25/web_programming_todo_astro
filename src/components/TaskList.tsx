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
    <div className="flex flex-col space-y-4 p-6">
      <div className="text-2xl font-bold text-center">タスク一覧</div>
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
  );
}
