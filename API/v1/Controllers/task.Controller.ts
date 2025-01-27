import { Request, Response } from 'express';
import Task from '../Models/task.Model';
import paginationHelper from '../../../Helpers/pagination';

export const index = async (req: Request, res: Response) => {
    const find: { deleted: boolean, status?: string } = { 
        deleted: false
    };
    //filter
    if (req.query.status) {
        find.status = req.query.status as string;
    }
    //sort
    const sort: Record<string, "asc" | "desc"> = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey as string] = (req.query.sortValue === 'asc' ? 'asc' : 'desc');
    }
    //pagination
    const initPagination = {
        currentPage: 1,
        limitItem: 4,
        totalPage: 1,
        skip: 0
    };
    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countTask);
    
    const tasks = await Task
                        .find(find)
                        .sort(sort)
                        .limit(objectPagination.limitItem)
                        .skip(objectPagination.skip);
    res.json({
        code: 200,
        message: 'list tasks',
        tasks: tasks
    });
}

export const detail = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const task = await Task.findOne({ _id: id, deleted: false });
    res.json({
        code: 200,
        message: 'detail task',
        task: task
    });
}