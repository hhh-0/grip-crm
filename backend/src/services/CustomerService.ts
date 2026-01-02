import { AppDataSource } from '../config/database';
import { Customer } from '../models/Customer';
import { CustomerData, CustomerFilters, PaginatedResponse } from '../types';
import { ILike, FindManyOptions, MoreThanOrEqual } from 'typeorm';

export class CustomerService {
  private customerRepository = AppDataSource.getRepository(Customer);

  async createCustomer(customerData: CustomerData): Promise<Customer> {
    // Check for duplicate email if provided
    if (customerData.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: customerData.email }
      });

      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }
    }

    const customer = this.customerRepository.create(customerData);
    return this.customerRepository.save(customer);
  }

  async updateCustomer(id: string, customerData: Partial<CustomerData>): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Check for duplicate email if updating email
    if (customerData.email && customerData.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findOne({
        where: { email: customerData.email }
      });

      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }
    }

    Object.assign(customer, customerData);
    return this.customerRepository.save(customer);
  }

  async getCustomer(id: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id },
      relations: ['tickets', 'customerNotes'],
    });
  }

  async listCustomers(filters: CustomerFilters = {}): Promise<PaginatedResponse<Customer>> {
    const {
      search,
      company,
      hasTickets,
      limit = 50,
      offset = 0,
    } = filters;

    const queryBuilder = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.tickets', 'tickets');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.company ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply company filter
    if (company) {
      queryBuilder.andWhere('customer.company ILIKE :company', {
        company: `%${company}%`
      });
    }

    // Apply hasTickets filter
    if (hasTickets !== undefined) {
      if (hasTickets) {
        queryBuilder.andWhere('tickets.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('tickets.id IS NULL');
      }
    }

    // Apply pagination
    queryBuilder
      .orderBy('customer.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    const [customers, total] = await queryBuilder.getManyAndCount();

    return {
      data: customers,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteCustomer(id: string): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['tickets'],
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Check if customer has associated tickets
    if (customer.tickets && customer.tickets.length > 0) {
      throw new Error('Cannot delete customer with associated tickets');
    }

    await this.customerRepository.remove(customer);
  }

  async searchCustomers(query: string, limit: number = 10): Promise<Customer[]> {
    return this.customerRepository.find({
      where: [
        { name: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { company: ILike(`%${query}%`) },
      ],
      take: limit,
      order: { name: 'ASC' },
    });
  }

  async getCustomerStats(): Promise<{
    total: number;
    withTickets: number;
    withoutTickets: number;
    recentlyAdded: number;
  }> {
    const total = await this.customerRepository.count();

    const withTickets = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.tickets', 'tickets')
      .where('tickets.id IS NOT NULL')
      .getCount();

    const withoutTickets = total - withTickets;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentlyAdded = await this.customerRepository.count({
      where: {
        createdAt: MoreThanOrEqual(thirtyDaysAgo)
      }
    });

    return {
      total,
      withTickets,
      withoutTickets,
      recentlyAdded,
    };
  }
}