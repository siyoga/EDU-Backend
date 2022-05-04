import Controller, { HTTPMethods } from "../typings/Controller"

export default class CourseController extends Controller {
  path = "/course";
  routes = [
    {
      path: '/create',
      method: HTTPMethods.POST,
      handler: 
    },

    {
      path: '/update',
      method: HTTPMethods.PUT,
      handler:
    },

    {
      path: '/get',
      method: HTTPMethods.GET,
      handler: 
    },

    {
      path: '/author/get',
      method: HTTPMethods.GET,
      handler:
    },

    {
      path: '/delete',
      method: HTTPMethods.DELETE,
      handler:
    },

    {
      path: '/student/add',
      method: HTTPMethods.GET,
      handler: 
    }
  ]
}