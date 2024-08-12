import { Injectable } from "@angular/core";
import { Task } from "../task-form/task.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class TaskService {
    Tasks: Task[] = [];

    // private apiUrl = 'https://task-app-25ee5-default-rtdb.firebaseio.com'
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    addTask(task: Task) {
        return this.http
            .post<{ name: string }>(`${this.apiUrl}/tasks.json`, task);
    }

    getTasks() {
        return this.http
            .get<{ [key: string]: Task }>(`${this.apiUrl}/tasks.json`)
            .pipe(
                map(responseData => {
                    const tasksArray: Task[] = [];
                    for (const key in responseData) {
                        tasksArray.push({
                            ...responseData[key],
                            id: key
                        });
                    }
                    return tasksArray;
                })
            )
    }

    deleteTasks() {
        return this.http
            .delete(`${this.apiUrl}/tasks.json`)
    }

    deleteTask(id: string) {
        return this.http
            .delete(`${this.apiUrl}/tasks/${id}.json`)
    }

    updateTasks(task: Task) {
        return this.http
            .patch(`${this.apiUrl}/tasks/${task.id}.json`, task)
    }
}