import { Response } from 'express';
import { CustomerService } from '../services/CustomerService';
import { ImportService } from '../services/ImportService';
import { ActivityService } from '../services/ActivityService';
import { CustomerData, CustomerFilters } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';
import { validateEntity } from '../utils/validation';
import { Customer } from '../models/Customer';
import { ActivityType } from '../models/UserActivity';

export class CustomerController {
  private customerService = new CustomerService();
  private importService = new ImportService();
  private activityService = new ActivityService();

  createCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const customerData: CustomerData = req.body;

      // Validate input
      const customer = new Customer();
      Object.assign(customer, customerData);
      const validationErrors = await validateEntity(customer);

      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        });
        return;
      }

      const newCustomer = await this.customerService.createCustomer(customerData);

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.CREATE_CUSTOMER,
          `Created customer: ${newCustomer.name}`,
          { customerId: newCustomer.id }
        );
      }

      res.status(201).json({
        success: true,
        data: newCustomer,
        message: 'Customer created successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  updateCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customerData: Partial<CustomerData> = req.body;

      const updatedCustomer = await this.customerService.updateCustomer(id, customerData);

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.UPDATE_CUSTOMER,
          `Updated customer: ${updatedCustomer.name}`,
          { customerId: updatedCustomer.id }
        );
      }

      res.json({
        success: true,
        data: updatedCustomer,
        message: 'Customer updated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  getCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomer(id);

      if (!customer) {
        res.status(404).json({
          success: false,
          error: 'Customer not found',
        });
        return;
      }

      res.json({
        success: true,
        data: customer,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  listCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const filters: CustomerFilters = {
        search: req.query.search as string,
        company: req.query.company as string,
        hasTickets: req.query.hasTickets === 'true' ? true : req.query.hasTickets === 'false' ? false : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      };

      const result = await this.customerService.listCustomers(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  deleteCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      // Get customer name for logging before deletion
      const customer = await this.customerService.getCustomer(id);
      if (!customer) {
        res.status(404).json({
          success: false,
          error: 'Customer not found',
        });
        return;
      }

      await this.customerService.deleteCustomer(id);

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.DELETE_CUSTOMER,
          `Deleted customer: ${customer.name}`,
          { customerId: id }
        );
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };

  searchCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
        });
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const customers = await this.customerService.searchCustomers(q, limit);

      res.json({
        success: true,
        data: customers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  importCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'CSV file is required',
        });
        return;
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const result = await this.importService.importCustomers(csvContent);

      // Log activity
      if (req.user) {
        await this.activityService.logActivity(
          req.user.userId,
          ActivityType.IMPORT_CUSTOMERS,
          `Imported ${result.imported} customers, ${result.failed} failed`,
          { 
            imported: result.imported,
            failed: result.failed,
            errors: result.errors.slice(0, 5) // Log first 5 errors only
          }
        );
      }

      res.json({
        success: result.success,
        data: result,
        message: `Import completed: ${result.imported} customers imported, ${result.failed} failed`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getCustomerStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.customerService.getCustomerStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

  getSampleCSV = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sampleCSV = this.importService.generateSampleCSV();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sample-customers.csv"');
      res.send(sampleCSV);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
}