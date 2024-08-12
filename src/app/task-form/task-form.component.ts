import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from './task.model';
import { TaskService } from '../common/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit, OnChanges {
  @ViewChild('formData') formData!: NgForm;
  @Output() fetchTasks = new EventEmitter<void>();
  @Input() task: Task = { taskName: '', taskDescription: '', id: '' };
  tasks: Task[] = [];
  error = null;

  isEdit: boolean = false;
  taskData: Task = { taskName: '', taskDescription: '', id: '' };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    if (this.task && this.task.taskName) {
      this.isEdit = true;
      this.taskData = { ...this.task };
    } else {
      this.isEdit = false;
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.isEdit) {
      this.updateTask();
      this.isEdit = false;
    } else {
      this.addTask();
    }
    this.formData.resetForm();
  }

  addTask() {
    const newTask: Task = {
      taskName: this.taskData.taskName,
      taskDescription: this.taskData.taskDescription,
      id: new Date().getTime().toString(),
    };
    this.taskService.addTask(newTask).subscribe({
      next: () => {
        this.fetchTaskList();
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  updateTask() {
    this.taskService.updateTasks(this.taskData).subscribe({
      next: () => {
        this.fetchTaskList();
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  fetchTaskList() {
    this.fetchTasks.emit();
  }

  clearTasks() {
    this.taskService.deleteTasks().subscribe({
      next: () => {
        this.tasks = [];
        this.fetchTaskList();
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }

  resetForm() {
    this.taskData = { taskName: '', taskDescription: '', id: '' };
    this.isEdit = false;
  }
}
