import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly _productRepository: Repository<Product>,
  ) {
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this._productRepository.create(createProductDto);
      await this._productRepository.save(product);
      return product;
    } catch (err) {
      this.handleDBException(err);
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDBException(err: any) {
    if (err.code === '23505') {
      throw new BadRequestException(err.detail);
    }
    this.logger.error(err);
    throw new InternalServerErrorException('Check server logs')
  }
}


/*
{
    "title": "Polera",
    "price":
    "description":
    "slug": "Polera_Seleccion"
    "stock":
    "size": ["SM","M","L"],
    "gender": "men"
}
*/