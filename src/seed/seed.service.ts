import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';

@Injectable()
export class SeedService {

  constructor(private readonly _productService: ProductsService){

  }
  
  async runSeed(){
    await this.insertNewProduct();
    return 'Execute Seed'
  }

  private async insertNewProduct(){
    await this._productService.deleteAllProduct();
    return true;
  }
}
