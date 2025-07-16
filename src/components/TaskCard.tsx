import type { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";

export default function TaskCard({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  // 期限が近いかどうかをチェック（3日以内）
  const isDueSoon = task.due && new Date(task.due) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const isOverdue = task.due && new Date(task.due) < new Date();

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-xl border p-3 flex items-center gap-2">
      <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={() => onToggle(task.id)}
        className="size-5 accent-indigo-500"
      />

      <div className="flex-1">
        <p className="font-medium">{task.title}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-indigo-500">
            {task.platform}
          </span>
          {task.due && (
            <span className={`
              ${isOverdue ? 'text-red-600 font-medium' : 
                isDueSoon ? 'text-orange-600 font-medium' : 'text-gray-500'}
            `}>
              期限: {formatDate(task.due)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.difficulty && (
          <Badge variant="outline">★ {task.difficulty}</Badge>
        )}
        {isOverdue && task.status !== 'done' && (
          <Badge variant="destructive">期限切れ</Badge>
        )}
        {isDueSoon && !isOverdue && task.status !== 'done' && (
          <Badge variant="secondary">期限間近</Badge>
        )}
      </div>
    </div>
  );
}
