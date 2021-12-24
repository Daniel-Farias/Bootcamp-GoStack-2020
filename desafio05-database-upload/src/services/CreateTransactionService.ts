import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enought balance');
    }

    let checkCategoryExist = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExist) {
      checkCategoryExist = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(checkCategoryExist);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: checkCategoryExist,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
