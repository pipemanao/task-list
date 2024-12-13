import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { SQLiteChanges } from 'jeep-sqlite';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SqliteService {

    public dbReady: BehaviorSubject<boolean>;
    public isWeb: boolean;
    public isIOS: boolean;
    public dbName: string;

    public priorityList = ["", "Baja", "Media", "Alta"];

    constructor(private http: HttpClient) {
        this.dbReady = new BehaviorSubject(false);
        this.isWeb = false;
        this.isIOS = false;
        this.dbName = '';
    }

    async init() {
        const info = await Device.getInfo();
        const sqlite = CapacitorSQLite as any;

        if (info.platform == 'android') {

            try {
                await sqlite.requestPermissions();
            } catch (error) {
                console.error('Esta app requiere permisos para funcionar')
            }

        } else if (info.platform == 'web') {

            this.isWeb = true;
            await sqlite.initWebStore();

        } else if (info.platform == 'ios') {
            this.isIOS = true;
        }

        this.setupDatabase();

    }

    async setupDatabase() {

        const dbSetup = await Preferences.get({ key: 'first_setup_key' });

        if (!dbSetup.value) {
            this.downloadDatabase();
        } else {
            this.dbName = await this.getDbName();
            await CapacitorSQLite.createConnection({ database: this.dbName });
            await CapacitorSQLite.open({ database: this.dbName });
            this.dbReady.next(true);
        }

    }

    downloadDatabase() {
        this.http.get('assets/db/db.json').subscribe(async (jsonExport: JsonSQLite) => {
            const jsonstring = JSON.stringify(jsonExport);
            const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

            if (isValid.result) {
                this.dbName = jsonExport.database;
                await CapacitorSQLite.importFromJson({ jsonstring });
                await CapacitorSQLite.createConnection({ database: this.dbName });
                await CapacitorSQLite.open({ database: this.dbName });

                await Preferences.set({ key: 'first_setup_key', value: '1' });
                await Preferences.set({ key: 'dbname', value: this.dbName });

                this.dbReady.next(true);
            }
        });
    }

    async getDbName() {
        if (!this.dbName) {
            const dbname = await Preferences.get({ key: 'dbname' });

            if (dbname.value) {
                this.dbName = dbname.value
            }
        }

        return this.dbName
    }

    async create(category: string) {
        let sql = 'INSERT INTO categories VALUES(?)';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        category
                    ]
                }
            ]
        }).then((changes: SQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName })
            }

            return changes;
        }).catch(error => Promise.reject(error));
    }

    async read() {
        let sql = 'SELECT * FROM categories';
        const dbName = await this.getDbName();

        return CapacitorSQLite.query({
            database: dbName,
            statement: sql,
            values: []
        }).then((response: capSQLiteValues) => {
            let categories: string[] = [];

            if (this.isIOS && response.values.length > 0) {
                response.values.shift();
            }

            for (let i = 0; i < response.values.length; i++) {
                const category = response.values[i];
                categories.push(category.name);
            }

            return categories;
        }).catch(error => Promise.reject(error));
    }

    async update(newCategory: string, originalCategory: string) {
        let sql = 'update categories SET name = ? WHERE name = ?';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        newCategory,
                        originalCategory
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

    async delete(category: string) {
        let sql = 'DELETE FROM categories WHERE name = ?';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        category
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }


    async createCategory(category: string) {
        let sql = 'INSERT INTO categories (name) VALUES(?)';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        category
                    ]
                }
            ]
        }).then((changes: SQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName })
            }

            return changes;
        }).catch(error => Promise.reject(error));
    }

    async readCategories() {
        let sql = 'SELECT * FROM categories';
        const dbName = await this.getDbName();

        return CapacitorSQLite.query({
            database: dbName,
            statement: sql,
            values: []
        }).then((response: capSQLiteValues) => {
            let categories: string[] = [];

            if (this.isIOS && response.values.length > 0) {
                response.values.shift();
            }

            for (let i = 0; i < response.values.length; i++) {
                const category = response.values[i];
                categories.push(category);
            }

            return categories;
        }).catch(error => Promise.reject(error));
    }

    async updateCategory(categoryId: number, categoryName: string) {
        let sql = 'update categories SET name = ? WHERE id = ?';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        categoryName,
                        categoryId
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

    async deleteCategory(category: string) {
        let sql = 'DELETE FROM categories WHERE name = ?';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        category
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

    async createTask(title: string, description: string, categoryId: number, priority: number, dateToPerform: Date) {
        let sql = 'INSERT INTO todo (title, description, category_id, priority, dateToPerform, creationDate) VALUES(?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        title,
                        description,
                        categoryId,
                        priority,
                        dateToPerform,
                    ]
                }
            ]
        }).then((changes: SQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName })
            }

            return changes;
        }).catch(error => Promise.reject(error));
    }

    async readTasks() {
        let sql = `SELECT t.*, c.name AS category
                    FROM todo t
                    INNER JOIN categories c ON t.category_id = c.id
                    WHERE t.completed = 0 AND t.deleted = 0
                    ORDER BY t.dateToPerform ASC, t.priority DESC;
                    `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.query({
            database: dbName,
            statement: sql,
            values: []
        }).then((response: capSQLiteValues) => {
            let tasks: string[] = [];

            if (this.isIOS && response.values.length > 0) {
                response.values.shift();
            }

            for (let i = 0; i < response.values.length; i++) {
                const task = response.values[i];

                task["priorityName"] = this.priorityList[task.priority]

                tasks.push(task);
            }

            return tasks;
        }).catch(error => Promise.reject(error));
    }

    async readCompletedTasks() {
        let sql = `SELECT t.*, c.name AS category
                    FROM todo t
                    INNER JOIN categories c ON t.category_id = c.id
                    WHERE t.completed = 1
                    ORDER BY t.completedDate DESC, t.priority DESC;
                    `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.query({
            database: dbName,
            statement: sql,
            values: []
        }).then((response: capSQLiteValues) => {
            let tasks: string[] = [];

            if (this.isIOS && response.values.length > 0) {
                response.values.shift();
            }

            for (let i = 0; i < response.values.length; i++) {
                const task = response.values[i];

                task["priorityName"] = this.priorityList[task.priority]

                tasks.push(task);
            }

            return tasks;
        }).catch(error => Promise.reject(error));
    }

    async readDeletedTasks() {
        let sql = `SELECT t.*, c.name AS category
                    FROM todo t
                    INNER JOIN categories c ON t.category_id = c.id
                    WHERE t.deleted = 1
                    ORDER BY t.completedDate DESC, t.priority DESC;
                    `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.query({
            database: dbName,
            statement: sql,
            values: []
        }).then((response: capSQLiteValues) => {
            let tasks: string[] = [];

            if (this.isIOS && response.values.length > 0) {
                response.values.shift();
            }

            for (let i = 0; i < response.values.length; i++) {
                const task = response.values[i];

                task["priorityName"] = this.priorityList[task.priority]

                tasks.push(task);
            }

            return tasks;
        }).catch(error => Promise.reject(error));
    }

    async updateTask(id: number, title: string, description: string, categoryId: number, priority: number, dateToPerform: Date) {
        let sql = `
            update todo 
            SET title = ?, description = ?, category_id = ?, priority = ?, dateToPerform = ?
            WHERE id = ?
        `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        title,
                        description,
                        categoryId,
                        priority,
                        dateToPerform,
                        id
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

    async updateTaskCompleted(id: number) {
        let sql = `
            update todo 
            SET completedDate = CURRENT_TIMESTAMP, completed = 1
            WHERE id = ?
        `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        id
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

    async UpdateDeletedTask(id: number) {
        let sql = `
            update todo 
            SET deletedDate = CURRENT_TIMESTAMP, deleted = 1
            WHERE id = ?
        `;
        const dbName = await this.getDbName();

        return CapacitorSQLite.executeSet({
            database: dbName,
            set: [
                {
                    statement: sql,
                    values: [
                        id
                    ]
                }
            ]
        }).then((changes: capSQLiteChanges) => {
            if (this.isWeb) {
                CapacitorSQLite.saveToStore({ database: dbName });
            }
        }).catch(error => Promise.reject(error));
    }

}
