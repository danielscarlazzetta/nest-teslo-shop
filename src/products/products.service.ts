import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

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

//Paginar
  findAll(paginationDTO: PaginationDTO) {
    
    const {limit = 10, offset = 0} = paginationDTO
    
    return this._productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {

    let product: Product;

    if( isUUID(term) ){
      product = await this._productRepository.findOneBy({id : term})
    }else{
      product = await this._productRepository.findOneBy({slug : term})
    }

    //const product = await this._productRepository.findOneBy({term});
    
    if(!product)
      throw new NotFoundException(`Producto con id ${term} no encontrado`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this._productRepository.remove(product);
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