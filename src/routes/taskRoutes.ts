import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import userCrud from '../dbCrud/taskCrud'
import {TaskInterface} from '../model/Task';
import taskCrud from '../dbCrud/taskCrud';

const router = express.Router();

interface ErrorResponse {
    message: string,
    error: string
}

router.get('/', async (req: Request & { user?: { id: string; email: string } }, res) => {
    try{
        const allTasks = await taskCrud.getTasks(req.user!.id);
        return res.status(200).json(allTasks);
    }catch (error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(400).json({message: "Couldn't get tasks", error: errorMessage});
    }
})

router.get(
  "/user/:userId",
  async (req: Request<{ userId: string }>, res: Response<TaskInterface[] | ErrorResponse>) => {
    try {
      const { userId } = req.params;
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user id", error: "Bad ObjectId" });
      }
      const tasks = await taskCrud.getTasksByUserID({ assignedTo: userId });
      return res.status(200).json(tasks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return res.status(400).json({ message: "Couldn't get tasks", error: errorMessage });
    }
  }
);

router.post('/', async (req: Request, res: Response<TaskInterface | ErrorResponse>) => {
    try {
        const {title, status, assignedTo, description} = req.body;
        if(!title || !status || !assignedTo){
            throw new Error("Either title, status or assignedTo is missing. All is required to post!");
        }

        const now = new Date();
         let finishedAt = req.body.finishedAt;
    if (finishedAt === '' || finishedAt === 'null' || finishedAt === undefined) {
      finishedAt = null;
    }else if (finishedAt === 'done'){
        finishedAt === now
    }
        const newTask = await taskCrud.createTask({
            title,
            description,
            status,
            assignedTo,
            finishedAt,
            createdAt: now,
            updatedAt: now
        })

        return res.status(200).json(newTask);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(400).json({message:"Couldn't create task", error: errorMessage});
    }
})

router.put('/:id', async (req: Request, res: Response<TaskInterface | ErrorResponse>) => {
    try{
        const updateTask = await taskCrud.updateTask(req.params.id, req.body);
        if(!updateTask){
            return res.status(404).json({message: "Task not found", error: "Task not found"});
        }
        return res.status(200).json(updateTask);
    }catch (error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        return res.status(400).json({message: "Couldnt update task", error: errorMessage})
    }
})


router.delete("/:id", async(req: Request, res: Response<TaskInterface | ErrorResponse>) => {
try {
    const deleteTask = await userCrud.deleteTask(req.params.id);
    if(!deleteTask){
        return res.status(404).json({message:"Task not found", error: "Task not found"});
    }
    return res.status(200).json(deleteTask); 
} catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(400).json({message:"Couldn't delete task", error: errorMessage});
}
})


export default router;