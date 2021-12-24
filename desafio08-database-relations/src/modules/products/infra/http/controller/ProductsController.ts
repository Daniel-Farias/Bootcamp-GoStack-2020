import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const createItem = container.resolve(CreateProductService);

    const item = await createItem.execute({
      name,
      price,
      quantity
    });

    return response.json(item);
  }
}
