import { Request, Response } from 'express';
import CourseService from '../services/CourseService';
import Controller, { HTTPMethods } from '../typings/Controller';

export default class CourseController extends Controller {
  path = '/course';
  routes = [
    {
      path: '/create',
      method: HTTPMethods.POST,
      handler: this.handleCreate,
    },

    {
      path: '/update',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdate,
    },

    {
      path: '/id/get/:id',
      method: HTTPMethods.GET,
      handler: this.handleGetById,
    },

    {
      path: '/author/get/:author',
      method: HTTPMethods.GET,
      handler: this.handleGetByAuthor,
    },

    {
      path: '/name/get/:name',
      method: HTTPMethods.GET,
      handler: this.handleGetByName,
    },

    {
      path: '/delete',
      method: HTTPMethods.DELETE,
      handler: this.handleDelete,
    },

    {
      path: '/student/add',
      method: HTTPMethods.GET,
      handler: this.handleAddStudent,
    },
  ];

  constructor() {
    super();
  }

  async handleCreate(request: Request, response: Response): Promise<void> {
    const name = request.body.name;
    const description = request.body.description;
    const author = request.body.author;

    const courseService = new CourseService(name, description, author);
    const data = await courseService.create();

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleUpdate(request: Request, response: Response): Promise<void> {
    // TODO добавить проверку по автору
    const id = request.body.id;
    const newName = request.body.newName;
    const newDescription = request.body.newDescription;

    const courseService = new CourseService(newName, newDescription);
    const data = await courseService.update(id);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetById(request: Request, response: Response): Promise<void> {
    const id = request.params.id;

    const courseService = new CourseService();
    const data = await courseService.getById(id);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetByAuthor(request: Request, response: Response): Promise<void> {
    const author = request.params.author;

    const courseService = new CourseService();
    const data = await courseService.getByAuthor(author);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleGetByName(request: Request, response: Response): Promise<void> {
    const name = request.params.name;

    const courseService = new CourseService();
    const data = await courseService.getByName(name);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleDelete(request: Request, response: Response): Promise<void> {
    // TODO добавить проверку по автору
    const id = request.body.id;

    const courseService = new CourseService();
    const data = await courseService.delete(id);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }

  async handleAddStudent(request: Request, response: Response): Promise<void> {
    // TODO добавить проверку по автору
    const id = request.body.id;

    const courseService = new CourseService();
    const data = await courseService.addStudent(id);

    if (!data.success) {
      super.error(response, data.message, data.statusCode);
      return;
    }

    super.success(response, data.data!, data.message);
  }
}
