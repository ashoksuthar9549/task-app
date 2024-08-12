import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from '../common/task.service';
import { Task } from '../task-form/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];
  @Output() editTask = new EventEmitter<Task>();
  selectedTask: any;
  error = null;
  isFetching = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(){
    this.fetchTasks();
  }
  fetchTasks() {
    this.isFetching = true;
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
        this.isFetching = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isFetching = false;
      }
    });
  }

  onEditTask(task: Task) {
    this.selectedTask = { ...task };
    this.editTask.emit(task);
  }

  onDeleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      },
      error: (error) => {
        this.error = error.message;
        this.isFetching = false;
      }
    })
  }
}
