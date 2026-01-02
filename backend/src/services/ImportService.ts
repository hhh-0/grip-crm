import csv from 'csv-parser';
import { Readable } from 'stream';
import { CustomerService } from './CustomerService';
import { ParsedData, FieldMapping, ValidationResult, ImportResult, CustomerData } from '../types';

export class ImportService {
  private customerService = new CustomerService();

  async parseCSV(csvContent: string): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      let headers: string[] = [];

      const stream = Readable.from([csvContent]);

      stream
        .pipe(csv())
        .on('headers', (headerList: string[]) => {
          headers = headerList;
        })
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve({
            headers,
            rows: results,
          });
        })
        .on('error', (error) => {
          reject(new Error(`CSV parsing failed: ${error.message}`));
        });
    });
  }

  autoMapFields(headers: string[]): FieldMapping {
    const mapping: FieldMapping = {};

    headers.forEach((header, index) => {
      const lowerHeader = header.toLowerCase().trim();

      // Map name fields
      if (lowerHeader.includes('name') || lowerHeader === 'full name' || lowerHeader === 'contact name') {
        mapping.name = index;
      }
      // Map email fields
      else if (lowerHeader.includes('email') || lowerHeader === 'e-mail' || lowerHeader === 'mail') {
        mapping.email = index;
      }
      // Map phone fields
      else if (lowerHeader.includes('phone') || lowerHeader.includes('tel') || lowerHeader.includes('mobile')) {
        mapping.phone = index;
      }
      // Map company fields
      else if (lowerHeader.includes('company') || lowerHeader.includes('organization') || lowerHeader.includes('business')) {
        mapping.company = index;
      }
    });

    return mapping;
  }

  validateData(data: any[], mapping: FieldMapping): ValidationResult {
    const errors: string[] = [];
    const validRows: any[] = [];
    const invalidRows: any[] = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];
      const customerData: Partial<CustomerData> = {};

      // Extract name (required)
      if (mapping.name !== undefined) {
        const name = row[Object.keys(row)[mapping.name]]?.toString().trim();
        if (name) {
          customerData.name = name;
        } else {
          rowErrors.push(`Row ${index + 1}: Name is required`);
        }
      } else {
        rowErrors.push(`Row ${index + 1}: Name field not found`);
      }

      // Extract email (optional but validate if present)
      if (mapping.email !== undefined) {
        const email = row[Object.keys(row)[mapping.email]]?.toString().trim();
        if (email) {
          if (this.isValidEmail(email)) {
            customerData.email = email;
          } else {
            rowErrors.push(`Row ${index + 1}: Invalid email format`);
          }
        }
      }

      // Extract phone (optional)
      if (mapping.phone !== undefined) {
        const phone = row[Object.keys(row)[mapping.phone]]?.toString().trim();
        if (phone) {
          customerData.phone = phone;
        }
      }

      // Extract company (optional)
      if (mapping.company !== undefined) {
        const company = row[Object.keys(row)[mapping.company]]?.toString().trim();
        if (company) {
          customerData.company = company;
        }
      }

      if (rowErrors.length === 0) {
        validRows.push(customerData);
      } else {
        invalidRows.push({ row: customerData, errors: rowErrors });
        errors.push(...rowErrors);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      validRows,
      invalidRows,
    };
  }

  async importCustomers(csvContent: string): Promise<ImportResult> {
    try {
      // Parse CSV
      const parsedData = await this.parseCSV(csvContent);
      
      if (parsedData.rows.length === 0) {
        return {
          success: false,
          imported: 0,
          failed: 0,
          errors: ['CSV file is empty'],
          customers: [],
        };
      }

      // Auto-map fields
      const mapping = this.autoMapFields(parsedData.headers);

      // Validate data
      const validation = this.validateData(parsedData.rows, mapping);

      const importedCustomers: any[] = [];
      const importErrors: string[] = [...validation.errors];
      let successCount = 0;
      let failCount = validation.invalidRows.length;

      // Import valid customers
      for (const customerData of validation.validRows) {
        try {
          const customer = await this.customerService.createCustomer(customerData as CustomerData);
          importedCustomers.push({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            company: customer.company,
          });
          successCount++;
        } catch (error: any) {
          failCount++;
          importErrors.push(`Failed to import customer "${customerData.name}": ${error.message}`);
        }
      }

      return {
        success: successCount > 0,
        imported: successCount,
        failed: failCount,
        errors: importErrors,
        customers: importedCustomers,
      };
    } catch (error: any) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [error.message],
        customers: [],
      };
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  generateSampleCSV(): string {
    const sampleData = [
      ['Name', 'Email', 'Phone', 'Company'],
      ['John Doe', 'john.doe@example.com', '+1-555-0123', 'Acme Corp'],
      ['Jane Smith', 'jane.smith@example.com', '+1-555-0124', 'Tech Solutions'],
      ['Bob Johnson', 'bob.johnson@example.com', '+1-555-0125', 'Global Industries'],
    ];

    return sampleData.map(row => row.join(',')).join('\n');
  }
}