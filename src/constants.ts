interface KanbanColumn {
  title: string;
  status: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { title: 'Backlog', status: 'backlog' },
  { title: 'A Fazer', status: 'todo' },
  { title: 'Em Progresso', status: 'in_progress' },
  { title: 'Em Revisão', status: 'in_review' },
  { title: 'Concluído', status: 'done' }
];
