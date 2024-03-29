import { uuid } from 'uuidv4';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface RequestDTO {
  title: string;
  value: number;
  type: 'outcome' | 'income';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((previous, current) => {
      if(current.type === 'income') {
        return previous + current.value;
      }
      return previous;
    },0);

    const outcome = this.transactions.reduce((previous, current) => {
      if(current.type === 'outcome') {
        return previous + current.value;
      }
      return previous;
    },0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: RequestDTO): Transaction {
    const { total } = this.getBalance();

    if(total < value && type === 'outcome') {
      throw new Error('Sem saldo!😕');
    }
    const transaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
