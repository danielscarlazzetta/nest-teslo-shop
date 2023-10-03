import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed.data';

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

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( produt => {
      insertPromises.push(this._productService.create( produt ));
    })

    await Promise.all( insertPromises);

    return true;
  }
}
